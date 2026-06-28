import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { NewsModel } from "@/src/models/News";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));

    const result = await NewsModel.findAll(page, limit, false);
    return corsJson({ success: true, data: result.items, total: result.total, page: result.page, pages: result.pages });
  } catch (error) {
    console.error("Admin list news error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { title, body: newsBody, category, image_url, published_at, translations } = body;

    if (!title) return corsJson({ error: "title is required" }, { status: 400 });

    const article = await NewsModel.create({
      title,
      body: newsBody,
      category,
      imageUrl: image_url,
      publishedAt: published_at ? new Date(published_at) : undefined,
      translations,
    });

    return corsJson({ success: true, article }, { status: 201 });
  } catch (error) {
    console.error("Create news error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
