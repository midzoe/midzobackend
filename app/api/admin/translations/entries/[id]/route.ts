import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { isSiteLang } from "@/lib/languages";
import { deeplTranslate, forgetCachedTranslation } from "@/lib/translate";

/**
 * Admin : corriger une traduction (PUT { text }) — elle devient « manuelle » et DeepL ne la
 * remplacera plus ; ou rétablir la version DeepL (DELETE) : retraduite tout de suite si la clé
 * est sur le serveur, sinon supprimée et refaite au prochain passage du script.
 */
const SELECT = { id: true, lang: true, source: true, text: true, manual: true, via: true, updatedAt: true } as const;

async function guard(request: NextRequest, idParam: string) {
  const auth = await getAuthWithRole(request);
  if (!auth) return { error: corsJson({ error: "Unauthorized" }, { status: 401 }) };
  if (!isAdmin(auth.role)) return { error: corsJson({ error: "Forbidden" }, { status: 403 }) };
  const id = Number(idParam);
  const entry = Number.isInteger(id) ? await prisma.textTranslation.findUnique({ where: { id } }) : null;
  if (!entry) return { error: corsJson({ error: "Not found" }, { status: 404 }) };
  return { auth, entry };
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { auth, entry, error } = await guard(request, (await params).id);
    if (error) return error;
    const body = await request.json().catch(() => null);
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!text) return corsJson({ error: "empty_text" }, { status: 400 });
    if (text.length > 20_000) return corsJson({ error: "too_long" }, { status: 400 });

    const item = await prisma.textTranslation.update({
      where: { id: entry!.id },
      data: { text, manual: true, via: "admin", updatedBy: Number(auth!.userId) },
      select: SELECT,
    });
    forgetCachedTranslation(entry!.sourceHash, entry!.lang);
    await logAdminAction(auth!.userId, "translation.edit", {
      type: "translation",
      id: entry!.id,
      details: { lang: entry!.lang, before: entry!.text, after: text },
    });
    return corsJson({ success: true, item });
  } catch (err) {
    console.error("admin/translations/entries PUT:", err);
    return corsJson({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { auth, entry, error } = await guard(request, (await params).id);
    if (error) return error;
    if (!isSiteLang(entry!.lang)) return corsJson({ error: "invalid_lang" }, { status: 400 });

    let item = null;
    if (process.env.DEEPL_API_KEY) {
      const [text] = await deeplTranslate([entry!.source], entry!.lang);
      item = await prisma.textTranslation.update({
        where: { id: entry!.id },
        data: { text: text ?? entry!.source, manual: false, via: "auto", updatedBy: Number(auth!.userId) },
        select: SELECT,
      });
    } else {
      await prisma.textTranslation.delete({ where: { id: entry!.id } });
    }
    forgetCachedTranslation(entry!.sourceHash, entry!.lang);
    await logAdminAction(auth!.userId, "translation.reset", {
      type: "translation",
      id: entry!.id,
      details: { lang: entry!.lang, before: entry!.text },
    });
    return corsJson({ success: true, item, pending: !item });
  } catch (err) {
    console.error("admin/translations/entries DELETE:", err);
    return corsJson({ error: "Server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
