import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { StudyCountryModel } from "@/src/models/StudyCountry";
import { UniversityModel } from "@/src/models/University";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const countryId = parseInt(id);
    if (isNaN(countryId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const data = await StudyCountryModel.findByIdPublic(countryId);
    if (!data) return corsJson({ error: "Country not found" }, { status: 404 });

    // Story 5.2 : facettes réellement disponibles pour ce pays, dérivées des
    // universités en base (matching University.country == StudyCountry.name).
    // `languages` provient des langues d'instruction du pays (source actuelle ;
    // l'exigence de langue par université arrive en 5.3).
    const [cities, programs] = await Promise.all([
      UniversityModel.getCitiesByCountry(data.name),
      UniversityModel.getProgramsByCountry(data.name),
    ]);
    const facets = { cities, programs, languages: data.languageInstruction ?? [] };

    return corsJson({ success: true, data, facets });
  } catch (error) {
    console.error("Study country error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
