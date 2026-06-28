import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { NewsModel } from "@/src/models/News";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const articleId = parseInt(id);
    if (isNaN(articleId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const body = await request.json();
    const { title, body: newsBody, category, image_url, published_at, translations } = body;

    const article = await NewsModel.update(articleId, {
      title,
      body: newsBody,
      category,
      imageUrl: image_url,
      publishedAt: published_at ? new Date(published_at) : undefined,
      translations,
    });

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
