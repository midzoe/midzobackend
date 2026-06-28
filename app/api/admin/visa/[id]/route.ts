import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { VisaModel } from "@/src/models/Visa";

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
    } = body;

    const visa = await VisaModel.update(visaId, {
      originCountry: origin_country,
      destinationCountry: destination_country,
      visaRequired: visa_required,
      visaType: visa_type,
      processingTime: processing_time,
      cost,
      documentsRequired: documents_required,
      notes,
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
