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
