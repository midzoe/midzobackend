import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { TrainingModel } from "@/src/models/Training";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const items = await TrainingModel.findAll({
      country: searchParams.get("country") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      duration: searchParams.get("duration") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    });

    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List trainings error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
