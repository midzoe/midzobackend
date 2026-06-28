import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TourismCountryModel } from "@/src/models/TourismCountry";

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    if (!body.name) return corsJson({ error: "name is required" }, { status: 400 });

    const data = await TourismCountryModel.create({
      name: body.name,
      nameFr: body.name_fr,
      region: body.region,
      capital: body.capital,
      flag: body.flag,
      image: body.image,
      description: body.description,
      currency: body.currency,
      language: body.language,
      bestTime: body.best_time,
      avgBudgetPerDay: body.avg_budget_per_day,
      topAttractions: body.top_attractions,
      visaForAfricans: body.visa_for_africans,
      processingTimeVisa: body.processing_time_visa,
      directFlightsFrom: body.direct_flights_from,
      tourismAvailable: body.tourism_available,
      isValidated: body.is_validated,
    });

    return corsJson({ success: true, data }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return corsJson({ error: "Country already exists" }, { status: 409 });
    console.error("Create tourism country error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
