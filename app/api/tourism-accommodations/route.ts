import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { TourismAccommodationModel } from "@/src/models/TourismAccommodation";

// Hébergement touristique (à la nuit). Le logement étudiant au mois reste sur /api/accommodations.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const items = await TourismAccommodationModel.findAll({
      country: searchParams.get("country") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      priceRange: searchParams.get("price_range") ?? undefined,
    });

    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List tourism accommodations error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
