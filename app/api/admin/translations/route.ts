import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { SITE_LANGS } from "@/lib/languages";
import { catalogTexts, charsTranslatedThisMonth, hashText, wantedFor } from "@/lib/translate";

/**
 * Admin : état de la traduction du catalogue, par langue (textes traduits, à traduire, corrigés
 * à la main) et consommation DeepL du mois par la traduction automatique.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const texts = await catalogTexts(new URL(request.url).origin);
    const status = [];
    for (const lang of SITE_LANGS) {
      const hashes = wantedFor(texts, lang).map(hashText);
      const [translated, manual] = await Promise.all([
        prisma.textTranslation.count({ where: { lang, sourceHash: { in: hashes } } }),
        prisma.textTranslation.count({ where: { lang, manual: true } }),
      ]);
      status.push({ lang, total: hashes.length, translated, missing: hashes.length - translated, manual });
    }
    return corsJson({
      success: true,
      texts: texts.length,
      status,
      auto: {
        enabled: !!process.env.DEEPL_API_KEY,
        monthlyCap: Number(process.env.DEEPL_MONTHLY_CHAR_CAP) || 300_000,
        usedThisMonth: await charsTranslatedThisMonth(),
      },
    });
  } catch (err) {
    console.error("admin/translations GET:", err);
    return corsJson({ error: "Server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
