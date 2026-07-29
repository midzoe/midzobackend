import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { TourismEventModel } from "@/src/models/TourismEvent";

/**
 * Story 6.2 (filtres story 6.8) : événements tourisme publiés.
 * Filtres facultatifs : ?country=&year=&subcategory= — `country` attend le nom anglais
 * du pays de tourisme, `subcategory` le libellé affiché (« Safari », « Sport »…).
 * Les notes internes ne sortent jamais d'ici.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") ?? "");

    const items = await TourismEventModel.findPublic({
      country: searchParams.get("country")?.trim() || undefined,
      year: Number.isFinite(year) ? year : undefined,
      subcategory: searchParams.get("subcategory")?.trim() || undefined,
    });

    const data = items.map(({ internalNotes, ...rest }) => rest);
    return corsJson({ success: true, data, total: data.length });
  } catch (error) {
    console.error("List tourism events error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
