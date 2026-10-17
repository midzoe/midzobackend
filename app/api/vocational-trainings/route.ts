import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { VocationalTrainingModel } from "@/src/models/VocationalTraining";

// Offres d'Ausbildung publiées, filtrables par pays / ville / domaine (parcours Study).
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const items = await VocationalTrainingModel.findAll({
      country: searchParams.get("country") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      domain: searchParams.get("domain") ?? undefined,
    });
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List vocational trainings error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
