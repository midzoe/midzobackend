import { createHash } from "crypto";
import { after, NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CORS_HEADERS } from "@/lib/cors";
import { LANGUAGE_CONFIG, SOURCE_LANG, TARGET_LANGS, isSiteLang, type SiteLang } from "@/lib/languages";
import { TRANSLATABLE, collectTexts, mapTexts, ruleForPath, rulesForAdminPath, type TranslatableRule } from "@/lib/translatable";

/**
 * Traduction du contenu du catalogue (DeepL) et mémoire de traduction (`text_translations`).
 *
 * - Lecture : les routes publiques enveloppées par `withLocale` renvoient le contenu dans la
 *   langue demandée (`?locale=de`) ; `/api/translations` sert les libellés traduits à l'affichage.
 * - Écriture : `scripts/translate-catalog.ts` (en local, sans limite de temps), et, quand
 *   `DEEPL_API_KEY` est posée sur le serveur, à l'enregistrement d'une fiche en admin
 *   (`withAutoTranslate`), dans la limite de `DEEPL_MONTHLY_CHAR_CAP` caractères par mois.
 * - Une traduction corrigée à la main (`manual`) n'est jamais remplacée par DeepL.
 */
export { isSiteLang, type SiteLang } from "@/lib/languages";

const CONTEXT = "Site d'une agence qui accompagne des étudiants et voyageurs africains : études à l'étranger, visas, logement, banque, voyages.";
const DEFAULT_MONTHLY_CAP = 300_000;

export const hashText = (text: string) => createHash("sha256").update(text.trim()).digest("hex");

/** Texte visiblement français : pas de version « fr » à produire (quota DeepL). */
export function looksFrench(text: string): boolean {
  if (/[éèêàçùœ]/i.test(text)) return true;
  const words = text.toLowerCase().match(/\b(le|la|les|des|du|de|et|pour|avec|une|un|est|en|au|aux|sur|dans|par)\b/g);
  return (words?.length ?? 0) >= 2;
}

/** Textes à traduire vers `lang` : en français, seulement ceux saisis dans une autre langue. */
export const wantedFor = (texts: string[], lang: SiteLang) => (lang === SOURCE_LANG ? texts.filter((t) => !looksFrench(t)) : texts);

// ── Lecture (avec un cache court par instance : la mémoire change rarement) ──────────────────

const CACHE_TTL_MS = 5 * 60_000;
const cache = new Map<string, { text: string | null; at: number }>();

export function forgetCachedTranslation(sourceHash: string, lang: string) {
  cache.delete(`${lang}:${sourceHash}`);
}

/** Traductions connues : texte source → traduction. Les textes absents de la mémoire sont omis. */
export async function lookupTranslations(texts: string[], lang: SiteLang): Promise<Record<string, string>> {
  const unique = [...new Set(texts.map((t) => t.trim()).filter(Boolean))];
  if (!unique.length) return {};
  const now = Date.now();
  const out: Record<string, string> = {};
  const toFetch = new Map<string, string>();
  for (const t of unique) {
    const hash = hashText(t);
    const hit = cache.get(`${lang}:${hash}`);
    if (hit && now - hit.at < CACHE_TTL_MS) {
      if (hit.text && hit.text !== t) out[t] = hit.text;
    } else toFetch.set(hash, t);
  }
  if (toFetch.size) {
    const rows = await prisma.textTranslation.findMany({
      where: { lang, sourceHash: { in: [...toFetch.keys()] } },
      select: { sourceHash: true, text: true },
    });
    const found = new Map(rows.map((r) => [r.sourceHash, r.text]));
    for (const [hash, source] of toFetch) {
      const text = found.get(hash) ?? null;
      cache.set(`${lang}:${hash}`, { text, at: now });
      if (text && text !== source) out[source] = text;
    }
  }
  return out;
}

/** Langue demandée par le site (`?locale=de`) ; null pour la langue de saisie ou une valeur inconnue. */
function requestedLocale(request: NextRequest): SiteLang | null {
  const locale = new URL(request.url).searchParams.get("locale");
  return isSiteLang(locale) ? locale : null;
}

/** Données d'une route publique, avec les champs traduisibles dans la langue demandée. */
export async function localizeData<T>(data: T, rule: TranslatableRule, lang: SiteLang): Promise<T> {
  const texts = wantedFor(collectTexts(data, rule.keys), lang);
  if (!texts.length) return data;
  const map = await lookupTranslations(texts, lang);
  if (!Object.keys(map).length) return data;
  return mapTexts(data, rule.keys, (s) => map[s.trim()] ?? s) as T;
}

type RouteHandler = (request: NextRequest, context: any) => Promise<Response> | Response;

/**
 * Enveloppe une route publique GET : avec `?locale=`, la réponse JSON est rendue dans cette
 * langue. Sans paramètre (ou en cas d'échec de la mémoire), la réponse d'origine est renvoyée.
 */
export function withLocale(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    const response = await handler(request, context);
    const lang = requestedLocale(request);
    const rule = ruleForPath(new URL(request.url).pathname.replace(/^\/api/, ""));
    if (!lang || !rule || !response.ok || !response.headers.get("content-type")?.includes("application/json")) return response;
    try {
      const data = await localizeData(await response.clone().json(), rule, lang);
      const localized = NextResponse.json(data, { status: response.status });
      response.headers.forEach((v, k) => { if (k !== "content-length" && k !== "content-type") localized.headers.set(k, v); });
      Object.entries(CORS_HEADERS).forEach(([k, v]) => localized.headers.set(k, v));
      return localized;
    } catch (error) {
      console.error("withLocale:", error);
      return response;
    }
  };
}

// ── Écriture (DeepL) ─────────────────────────────────────────────────────────────────────────

export class DeeplError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

function deeplEndpoint(key: string) {
  // Les clés de l'offre gratuite finissent par « :fx » et ont leur propre domaine.
  return key.endsWith(":fx") ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate";
}

/** Un appel DeepL (50 textes au plus, ~100 ko) ; renvoie les traductions dans l'ordre. */
async function deeplBatch(texts: string[], lang: SiteLang, key: string, sourceLang?: string): Promise<string[]> {
  const { deepl, formality } = LANGUAGE_CONFIG[lang];
  const res = await fetch(deeplEndpoint(key), {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: texts,
      target_lang: deepl,
      ...(sourceLang && { source_lang: sourceLang }),
      preserve_formatting: true,
      context: CONTEXT,
      ...(formality && { formality }),
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    // 456 = quota épuisé ; 403 = clé refusée.
    throw new DeeplError(`DeepL ${res.status}${detail ? ` : ${detail.slice(0, 200)}` : ""}`, res.status);
  }
  const body = (await res.json()) as { translations: { text: string }[] };
  return body.translations.map((t) => t.text);
}

/** Traduction DeepL d'une liste de textes, avec reprise depuis le français des textes mixtes. */
export async function deeplTranslate(texts: string[], lang: SiteLang): Promise<string[]> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new DeeplError("DEEPL_API_KEY n'est pas configurée");
  const result = await deeplBatch(texts, lang, key);
  // Texte mixte (« Numéro fiscal (Steuer-Identifikationsnummer) ») : DeepL y détecte parfois la
  // langue cible et le rend tel quel. S'il a l'air français, on le retraduit depuis le français.
  const retry = lang === SOURCE_LANG ? [] : texts.map((_, i) => i).filter((i) => result[i] === texts[i] && looksFrench(texts[i]));
  if (retry.length) {
    const again = await deeplBatch(retry.map((i) => texts[i]), lang, key, "FR");
    retry.forEach((i, k) => { result[i] = again[k] ?? result[i]; });
  }
  return result;
}

function batches(texts: string[]): string[][] {
  const out: string[][] = [];
  let current: string[] = [];
  let size = 0;
  for (const t of texts) {
    const bytes = Buffer.byteLength(t, "utf8");
    if (current.length && (current.length >= 50 || size + bytes > 100_000)) {
      out.push(current);
      current = [];
      size = 0;
    }
    current.push(t);
    size += bytes;
  }
  if (current.length) out.push(current);
  return out;
}

/** Caractères envoyés à DeepL ce mois-ci par la traduction automatique (hors script local). */
export async function charsTranslatedThisMonth(): Promise<number> {
  const start = new Date();
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);
  const rows = await prisma.$queryRaw<{ n: bigint | null }[]>`
    SELECT SUM(LENGTH(source))::bigint AS n FROM text_translations WHERE via = 'auto' AND created_at >= ${start}`;
  return Number(rows[0]?.n ?? 0);
}

export interface TranslateStats {
  lang: SiteLang;
  missing: number;
  translated: number;
  characters: number;
}

/**
 * Traduit vers `lang` les textes absents de la mémoire et les enregistre. Les traductions
 * existantes — dont celles corrigées à la main — ne sont jamais touchées. `budget` : nombre
 * maximal de caractères à envoyer (le reste attend le passage suivant).
 */
export async function translateMissing(
  texts: string[],
  lang: SiteLang,
  opts: { budget?: number; via?: "script" | "auto" } = {},
): Promise<TranslateStats> {
  const unique = wantedFor([...new Set(texts.map((t) => t.trim()).filter(Boolean))], lang);
  const known = new Set(
    (await prisma.textTranslation.findMany({
      where: { lang, sourceHash: { in: unique.map(hashText) } },
      select: { sourceHash: true },
    })).map((r) => r.sourceHash)
  );
  let missing = unique.filter((t) => !known.has(hashText(t)));
  const total = missing.length;
  if (opts.budget !== undefined) {
    let left = opts.budget;
    missing = missing.filter((t) => (left -= t.length) >= 0);
  }
  let translated = 0;
  let characters = 0;
  for (const batch of batches(missing)) {
    const result = await deeplTranslate(batch, lang);
    await prisma.textTranslation.createMany({
      data: batch.map((source, i) => ({ sourceHash: hashText(source), lang, source, text: result[i] ?? source, via: opts.via ?? "script" })),
      skipDuplicates: true,
    });
    translated += batch.length;
    characters += batch.reduce((a, t) => a + t.length, 0);
  }
  return { lang, missing: total, translated, characters };
}

/** Textes traduisibles (champs remplacés et libellés d'affichage) d'une règle, lus sur la route publique. */
export async function ruleTexts(origin: string, rule: TranslatableRule): Promise<string[]> {
  const res = await fetch(`${origin}/api${rule.source}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${rule.source} : ${res.status}`);
  return collectTexts(await res.json(), [...rule.keys, ...(rule.displayKeys ?? [])]);
}

/** Tous les textes traduisibles du catalogue. */
export async function catalogTexts(origin: string, rules: TranslatableRule[] = TRANSLATABLE): Promise<string[]> {
  const all = new Set<string>();
  for (const rule of rules) (await ruleTexts(origin, rule)).forEach((t) => all.add(t));
  return [...all];
}

/**
 * Enveloppe une route admin d'écriture : après un enregistrement réussi, les textes nouveaux ou
 * modifiés de ce catalogue sont traduits (après la réponse, sans la ralentir). Sans clé DeepL
 * sur le serveur, rien ne se passe : le script local s'en charge.
 */
export function withAutoTranslate(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    const response = await handler(request, context);
    if (response.ok && process.env.DEEPL_API_KEY) {
      const url = new URL(request.url);
      const rules = rulesForAdminPath(url.pathname.replace(/^\/api/, ""));
      if (rules.length) {
        after(async () => {
          try {
            const cap = Number(process.env.DEEPL_MONTHLY_CHAR_CAP) || DEFAULT_MONTHLY_CAP;
            let budget = cap - (await charsTranslatedThisMonth());
            if (budget <= 0) return console.warn("Traduction automatique : plafond mensuel DeepL atteint");
            const texts = await catalogTexts(url.origin, rules);
            for (const lang of TARGET_LANGS.concat(SOURCE_LANG)) {
              const stats = await translateMissing(texts, lang, { budget, via: "auto" });
              budget -= stats.characters;
              if (budget <= 0) break;
            }
          } catch (error) {
            console.error("Traduction automatique :", error);
          }
        });
      }
    }
    return response;
  };
}
