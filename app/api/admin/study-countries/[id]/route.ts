import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { StudyCountryModel } from "@/src/models/StudyCountry";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const countryId = parseInt(id);
    if (isNaN(countryId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const body = await request.json();
    const data = await StudyCountryModel.update(countryId, {
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

    if (!data) return corsJson({ error: "Country not found" }, { status: 404 });
    return corsJson({ success: true, data });
  } catch (error) {
    console.error("Update study country error:", error);
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

    const deleted = await StudyCountryModel.delete(countryId);
    if (!deleted) return corsJson({ error: "Country not found" }, { status: 404 });

    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete study country error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
