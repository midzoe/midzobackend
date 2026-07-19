import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TourismCountryModel } from "@/src/models/TourismCountry";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const countryId = parseInt(id);
    if (isNaN(countryId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const body = await request.json();
    const data = await TourismCountryModel.update(countryId, {
      name: body.name,
      nameFr: body.name_fr ?? body.nameFr,
      region: body.region,
      capital: body.capital,
      flag: body.flag,
      image: body.image,
      description: body.description,
      currency: body.currency,
      language: body.language,
      bestTime: body.best_time ?? body.bestTime,
      avgBudgetPerDay: body.avg_budget_per_day ?? body.avgBudgetPerDay,
      topAttractions: body.top_attractions ?? body.topAttractions,
      visaForAfricans: body.visa_for_africans ?? body.visaForAfricans,
      processingTimeVisa: body.processing_time_visa ?? body.processingTimeVisa,
      directFlightsFrom: body.direct_flights_from ?? body.directFlightsFrom,
      tourismAvailable: body.tourism_available ?? body.tourismAvailable,
      isValidated: body.is_validated ?? body.isValidated,
    });

    if (!data) return corsJson({ error: "Country not found" }, { status: 404 });
    return corsJson({ success: true, data });
  } catch (error) {
    console.error("Update tourism country error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const countryId = parseInt(id);
    if (isNaN(countryId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const deleted = await TourismCountryModel.delete(countryId);
    if (!deleted) return corsJson({ error: "Country not found" }, { status: 404 });

    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete tourism country error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
