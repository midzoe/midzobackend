import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { TouristSiteModel } from "@/src/models/TouristSite";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const items = await TouristSiteModel.findAll({
      country: searchParams.get("country") ?? undefined,
      category: searchParams.get("category") ?? undefined,
    });

    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List tourist sites error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
