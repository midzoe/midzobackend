import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { catalogTexts, hashText, looksFrench } from "@/lib/translate";

/**
 * Admin : état de la traduction du catalogue (textes à traduire par langue). La traduction
 * elle-même se fait en local (`npx tsx scripts/translate-catalog.ts`) : la clé DeepL n'est
 * pas sur le serveur.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const texts = await catalogTexts(new URL(request.url).origin);
    const status = [];
    for (const lang of ["en", "de", "fr"]) {
      const wanted = lang === "fr" ? texts.filter((t) => !looksFrench(t)) : texts;
      const known = await prisma.textTranslation.count({ where: { lang, sourceHash: { in: wanted.map(hashText) } } });
      status.push({ lang, total: wanted.length, translated: known, missing: wanted.length - known });
    }
    return corsJson({ success: true, texts: texts.length, status });
  } catch (err) {
    console.error("admin/translations GET:", err);
    return corsJson({ error: "Server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
