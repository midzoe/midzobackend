import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { BlogModel } from "@/src/models/Blog";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const postId = parseInt(id);
    if (isNaN(postId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const body = await request.json();
    const { title, slug, body: postBody, excerpt, category, author, image, published_at, is_published } = body;

    const post = await BlogModel.update(postId, {
      title,
      slug,
      body: postBody,
      excerpt,
      category,
      author,
      imageUrl: image,
      publishedAt: published_at ? new Date(published_at) : undefined,
      isPublished: is_published,
    });

    if (!post) return corsJson({ error: "Post not found" }, { status: 404 });
    return corsJson({ success: true, data: post });
  } catch (error) {
    console.error("Update blog error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const postId = parseInt(id);
    if (isNaN(postId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const deleted = await BlogModel.delete(postId);
    if (!deleted) return corsJson({ error: "Post not found" }, { status: 404 });

    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete blog error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
