import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { VisaModel } from "@/src/models/Visa";
import { CountryModel } from "@/src/models/Country";
import { EmbassyModel } from "@/src/models/Embassy";

// Story 4.2 : destination = pays validé, ambassade (si fournie) compétente (même pays).
async function validateVisaRule(
  destinationCountry: string,
  embassyId?: number | null
): Promise<string | null> {
  if (!(await CountryModel.isValidatedByName(destinationCountry))) {
    return "destination_country doit être un pays validé";
  }
  if (embassyId != null) {
    const embassy = await EmbassyModel.findById(embassyId);
    if (!embassy) return "embassy_id introuvable";
    if (embassy.country !== destinationCountry) {
      return "ambassade non compétente pour cette destination";
    }
  }
  return null;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const visaId = parseInt(id);
    if (isNaN(visaId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const body = await request.json();
    const {
      origin_country,
      destination_country,
      visa_required,
      visa_type,
      processing_time,
      cost,
      documents_required,
      notes,
      embassy_id,
    } = body;

    const embassyId =
      embassy_id === "" || embassy_id === undefined || embassy_id === null
        ? null
        : Number(embassy_id);
    if (embassyId !== null && Number.isNaN(embassyId)) {
      return corsJson({ error: "embassy_id invalide" }, { status: 400 });
    }

    if (destination_country) {
      const validationError = await validateVisaRule(destination_country, embassyId);
      if (validationError) return corsJson({ error: validationError }, { status: 400 });
    }

    const visa = await VisaModel.update(visaId, {
      originCountry: origin_country,
      destinationCountry: destination_country,
      visaRequired: visa_required,
      visaType: visa_type,
      processingTime: processing_time,
      cost,
      documentsRequired: documents_required,
      notes,
      embassyId,
    });

    if (!visa) return corsJson({ error: "Visa rule not found" }, { status: 404 });

    return corsJson({ success: true, visa });
  } catch (error) {
    console.error("Update visa error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const visaId = parseInt(id);
    if (isNaN(visaId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const deleted = await VisaModel.delete(visaId);
    if (!deleted) return corsJson({ error: "Visa rule not found" }, { status: 404 });

    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete visa error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
