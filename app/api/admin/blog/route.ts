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
    const { title, body: postBody, category, image_url, published_at, translations } = body;

    if (!title) return corsJson({ error: "title is required" }, { status: 400 });

    const post = await BlogModel.create({
      title,
      body: postBody,
      category,
      imageUrl: image_url,
      publishedAt: published_at ? new Date(published_at) : undefined,
      translations,
    });

    return corsJson({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("Create blog error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
