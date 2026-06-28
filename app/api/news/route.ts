import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { NewsModel } from "@/src/models/News";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));

    const result = await NewsModel.findAll(page, limit);
    return corsJson({ success: true, ...result });
  } catch (error) {
    console.error("News list error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
