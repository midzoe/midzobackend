import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { isSiteLang } from "@/lib/languages";

/**
 * Admin : recherche dans les traductions d'une langue (texte d'origine ou traduction), pour les
 * relire et les corriger. `manual=1` : seulement les traductions corrigées à la main.
 */
const PAGE_SIZE = 25;

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const params = new URL(request.url).searchParams;
    const lang = params.get("lang");
    if (!isSiteLang(lang)) return corsJson({ error: "invalid_lang" }, { status: 400 });
    const q = (params.get("q") ?? "").trim();
    const page = Math.max(1, Number(params.get("page")) || 1);
    const where = {
      lang,
      ...(params.get("manual") === "1" && { manual: true }),
      ...(q && {
        OR: [
          { source: { contains: q, mode: "insensitive" as const } },
          { text: { contains: q, mode: "insensitive" as const } },
        ],
      }),
    };
    const [items, total] = await Promise.all([
      prisma.textTranslation.findMany({
        where,
        orderBy: [{ manual: "desc" }, { updatedAt: "desc" }],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: { id: true, lang: true, source: true, text: true, manual: true, via: true, updatedAt: true },
      }),
      prisma.textTranslation.count({ where }),
    ]);
    return corsJson({ success: true, items, total, page, pageSize: PAGE_SIZE });
  } catch (err) {
    console.error("admin/translations/entries GET:", err);
    return corsJson({ error: "Server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
