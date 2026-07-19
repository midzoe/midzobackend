import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { StudyCountryModel } from "@/src/models/StudyCountry";
import { enrichStudyCountry, EnrichNotConfiguredError, ENRICH_MODEL } from "@/lib/enrichStudyCountry";

// Story 5.5 : POST /api/admin/study-countries/enrich → génère un brouillon IA (isValidated=false).
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    if (!body?.name) return corsJson({ error: "name is required" }, { status: 400 });

    const draft = await enrichStudyCountry(body.name);

    const data = await StudyCountryModel.create({
      name: body.name,
      nameFr: draft.nameFr,
      region: draft.region,
      capital: draft.capital,
      description: draft.description,
      languageInstruction: draft.languageInstruction,
      tuitionRange: draft.tuitionRange,
      livingCost: draft.livingCost,
      visaDifficulty: draft.visaDifficulty,
      scholarshipAvailable: draft.scholarshipAvailable,
      popularScholarships: draft.popularScholarships,
      popularPrograms: draft.popularPrograms,
      admissionRequirements: draft.admissionRequirements,
      topUniversities: draft.topUniversities,
      processingTimeVisa: draft.processingTimeVisa,
      // Brouillon : non validé, source tracée.
      isValidated: false,
      source: `ai:${ENRICH_MODEL}`,
    });

    return corsJson({ success: true, data }, { status: 201 });
  } catch (error: any) {
    if (error instanceof EnrichNotConfiguredError) {
      return corsJson({ error: "AI enrichment is not configured on the server" }, { status: 503 });
    }
    if (error?.code === "P2002") {
      return corsJson({ error: "Country already exists" }, { status: 409 });
    }
    console.error("Enrich study country error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
