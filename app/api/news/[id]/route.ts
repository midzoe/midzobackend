import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { NewsModel } from "@/src/models/News";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const newsId = parseInt(id);
    if (isNaN(newsId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const article = await NewsModel.findById(newsId);
    if (!article) return corsJson({ error: "Article not found" }, { status: 404 });

    return corsJson({ success: true, data: article });
  } catch (error) {
    console.error("News find error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
