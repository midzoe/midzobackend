import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { RestaurantModel } from "@/src/models/Restaurant";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const items = await RestaurantModel.findAll({
      country: searchParams.get("country") ?? undefined,
      cuisine: searchParams.get("cuisine") ?? undefined,
      priceRange: searchParams.get("price_range") ?? undefined,
    });

    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List restaurants error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
