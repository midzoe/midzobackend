import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { NewsModel, newsPayload } from "@/src/models/News";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const articleId = parseInt(id);
    if (isNaN(articleId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    // Payload partiel : les champs absents restent `undefined` et Prisma ne les touche pas.
    // Story 11.2 : la validation d'un brouillon scrappé n'envoie que `is_published`.
    const article = await NewsModel.update(articleId, newsPayload(await request.json()));

    if (!article) return corsJson({ error: "Article not found" }, { status: 404 });

    return corsJson({ success: true, article });
  } catch (error) {
    console.error("Update news error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const articleId = parseInt(id);
    if (isNaN(articleId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const deleted = await NewsModel.delete(articleId);
    if (!deleted) return corsJson({ error: "Article not found" }, { status: 404 });

    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete news error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
