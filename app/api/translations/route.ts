import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { isSiteLang, lookupTranslations } from "@/lib/translate";

/**
 * Traductions du contenu du catalogue, lues dans la mémoire de traduction (jamais DeepL ici :
 * une route publique ne doit pas pouvoir consommer le quota). Corps : { lang, texts: [...] } ;
 * réponse : { translations: { texte source: traduction } } — les textes inconnus sont omis.
 */
const MAX_TEXTS = 4000;
const MAX_CHARS = 600_000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const lang = body?.lang;
    const texts: unknown = body?.texts;
    if (!isSiteLang(lang)) return corsJson({ error: "invalid_lang" }, { status: 400 });
    if (!Array.isArray(texts) || !texts.every((t) => typeof t === "string")) {
      return corsJson({ error: "invalid_texts" }, { status: 400 });
    }
    if (texts.length > MAX_TEXTS || texts.reduce((a: number, t: string) => a + t.length, 0) > MAX_CHARS) {
      return corsJson({ error: "too_large" }, { status: 413 });
    }
    return corsJson({ success: true, translations: await lookupTranslations(texts as string[], lang) });
  } catch (error) {
    console.error("translations:", error);
    return corsJson({ error: "Server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
