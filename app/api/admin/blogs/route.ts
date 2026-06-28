import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { BlogModel } from "@/src/models/Blog";

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { title, slug, body: postBody, excerpt, category, author, image, published_at, is_published } = body;

    if (!title) return corsJson({ error: "title is required" }, { status: 400 });

    const post = await BlogModel.create({
      title,
      slug,
      body: postBody,
      excerpt,
      category,
      author,
      imageUrl: image,
      publishedAt: published_at ? new Date(published_at) : undefined,
      isPublished: is_published ?? false,
    });

    return corsJson({ success: true, data: post }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return corsJson({ error: "Slug already exists" }, { status: 409 });
    console.error("Create blog error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
