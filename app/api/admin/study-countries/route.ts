import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { StudyCountryModel } from "@/src/models/StudyCountry";

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    if (!body.name) return corsJson({ error: "name is required" }, { status: 400 });

    const data = await StudyCountryModel.create({
      name: body.name,
      nameFr: body.name_fr,
      region: body.region,
      capital: body.capital,
      flag: body.flag,
      image: body.image,
      description: body.description,
      languageInstruction: body.language_instruction,
      tuitionRange: body.tuition_range,
      livingCost: body.living_cost,
      visaDifficulty: body.visa_difficulty,
      scholarshipAvailable: body.scholarship_available,
      popularScholarships: body.popular_scholarships,
      popularPrograms: body.popular_programs,
      admissionRequirements: body.admission_requirements,
      topUniversities: body.top_universities,
      processingTimeVisa: body.processing_time_visa,
      studyAvailable: body.study_available,
      isValidated: body.is_validated,
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
