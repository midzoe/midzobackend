import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { AccommodationModel } from "@/src/models/Accommodation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") ?? undefined;
    const city = searchParams.get("city") ?? undefined;
    const type = searchParams.get("type") ?? undefined;
    const maxPriceParam = searchParams.get("max_price");
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;

    const accommodations = await AccommodationModel.findAll({ country, city, type, maxPrice });
    return corsJson({ success: true, accommodations });
  } catch (error) {
    console.error("Accommodations list error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
