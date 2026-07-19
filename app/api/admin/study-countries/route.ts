import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { StudyCountryModel } from "@/src/models/StudyCountry";

// Story 9.1 : liste admin des pays d'étude — inclut les brouillons (isValidated=false)
// pour permettre la validation (9.2/9.7).
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const items = await StudyCountryModel.findAll();
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("Admin list study countries error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    if (!body.name) return corsJson({ error: "name is required" }, { status: 400 });

    const data = await StudyCountryModel.create({
      name: body.name,
      nameFr: body.name_fr ?? body.nameFr,
      region: body.region,
      capital: body.capital,
      flag: body.flag,
      image: body.image,
      description: body.description,
      languageInstruction: body.language_instruction ?? body.languageInstruction,
      tuitionRange: body.tuition_range ?? body.tuitionRange,
      livingCost: body.living_cost ?? body.livingCost,
      visaDifficulty: body.visa_difficulty ?? body.visaDifficulty,
      scholarshipAvailable: body.scholarship_available ?? body.scholarshipAvailable,
      popularScholarships: body.popular_scholarships ?? body.popularScholarships,
      popularPrograms: body.popular_programs ?? body.popularPrograms,
      admissionRequirements: body.admission_requirements ?? body.admissionRequirements,
      topUniversities: body.top_universities ?? body.topUniversities,
      processingTimeVisa: body.processing_time_visa ?? body.processingTimeVisa,
      studyAvailable: body.study_available ?? body.studyAvailable,
      isValidated: body.is_validated ?? body.isValidated,
    });

    return corsJson({ success: true, data }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return corsJson({ error: "Country already exists" }, { status: 409 });
    console.error("Create study country error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
