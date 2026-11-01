import { createHash } from "crypto";
import prisma from "@/lib/prisma";
import { TRANSLATABLE, collectTexts } from "@/lib/translatable";

/**
 * Traduction du contenu du catalogue (DeepL) et mémoire de traduction (`text_translations`).
 *
 * Le site lit la mémoire (`/api/translations`, lecture seule). DeepL n'est appelé qu'en local,
 * par `scripts/translate-catalog.ts` : la clé reste dans le `.env` local, jamais sur Vercel.
 * Après un ajout ou une modification en admin, relancer ce script (seuls les nouveaux textes
 * sont envoyés à DeepL).
 */
export const SITE_LANGS = ["fr", "en", "de"] as const;
export type SiteLang = (typeof SITE_LANGS)[number];
export const isSiteLang = (v: unknown): v is SiteLang => SITE_LANGS.includes(v as SiteLang);

const DEEPL_TARGET: Record<SiteLang, string> = { fr: "FR", en: "EN-GB", de: "DE" };
// Vouvoiement (« Sie », « vous ») comme le reste du site.
const FORMALITY: Partial<Record<SiteLang, string>> = { fr: "prefer_more", de: "prefer_more" };
const CONTEXT = "Site d'une agence qui accompagne des étudiants et voyageurs africains : études à l'étranger, visas, logement, banque, voyages.";

export const hashText = (text: string) => createHash("sha256").update(text.trim()).digest("hex");

/** Texte visiblement français : la cible « fr » ne lui est pas envoyée (quota DeepL). */
export function looksFrench(text: string): boolean {
  if (/[éèêàçùœ]/i.test(text)) return true;
  const words = text.toLowerCase().match(/\b(le|la|les|des|du|de|et|pour|avec|une|un|est|en|au|aux|sur|dans|par)\b/g);
  return (words?.length ?? 0) >= 2;
}

/** Traductions connues : texte source → traduction. Les textes absents de la mémoire sont omis. */
export async function lookupTranslations(texts: string[], lang: SiteLang): Promise<Record<string, string>> {
  const unique = [...new Set(texts.map((t) => t.trim()).filter(Boolean))];
  if (!unique.length) return {};
  const byHash = new Map(unique.map((t) => [hashText(t), t]));
  const rows = await prisma.textTranslation.findMany({
    where: { lang, sourceHash: { in: [...byHash.keys()] } },
    select: { sourceHash: true, text: true },
  });
  const out: Record<string, string> = {};
  for (const r of rows) {
    const source = byHash.get(r.sourceHash);
    if (source && r.text !== source) out[source] = r.text;
  }
  return out;
}

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
async function deeplBatch(texts: string[], lang: SiteLang, key: string): Promise<string[]> {
  const res = await fetch(deeplEndpoint(key), {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: texts,
      target_lang: DEEPL_TARGET[lang],
      preserve_formatting: true,
      context: CONTEXT,
      ...(FORMALITY[lang] && { formality: FORMALITY[lang] }),
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

export interface TranslateStats {
  lang: SiteLang;
  missing: number;
  translated: number;
  characters: number;
}

/** Traduit vers `lang` les textes absents de la mémoire et les enregistre. */
export async function translateMissing(texts: string[], lang: SiteLang): Promise<TranslateStats> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new DeeplError("DEEPL_API_KEY n'est pas configurée");

  let unique = [...new Set(texts.map((t) => t.trim()).filter(Boolean))];
  if (lang === "fr") unique = unique.filter((t) => !looksFrench(t));
  const known = new Set(
    (await prisma.textTranslation.findMany({
      where: { lang, sourceHash: { in: unique.map(hashText) } },
      select: { sourceHash: true },
    })).map((r) => r.sourceHash)
  );
  const missing = unique.filter((t) => !known.has(hashText(t)));
  let translated = 0;
  let characters = 0;
  for (const batch of batches(missing)) {
    const result = await deeplBatch(batch, lang, key);
    await prisma.textTranslation.createMany({
      data: batch.map((source, i) => ({ sourceHash: hashText(source), lang, source, text: result[i] ?? source })),
      skipDuplicates: true,
    });
    translated += batch.length;
    characters += batch.reduce((a, t) => a + t.length, 0);
  }
  return { lang, missing: missing.length, translated, characters };
}

/** Tous les textes traduisibles du catalogue, lus sur les routes publiques du site lui-même. */
export async function catalogTexts(origin: string): Promise<string[]> {
  const all = new Set<string>();
  for (const rule of TRANSLATABLE) {
    const res = await fetch(`${origin}/api${rule.source}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`${rule.source} : ${res.status}`);
    collectTexts(await res.json(), rule.keys).forEach((t) => all.add(t));
  }
  return [...all];
}
