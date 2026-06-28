import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { VisaModel } from "@/src/models/Visa";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const items = await VisaModel.findAll();
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("Admin list visa error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

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

    if (!origin_country || !destination_country) {
      return corsJson(
        { error: "origin_country and destination_country are required" },
        { status: 400 }
      );
    }

    const visa = await VisaModel.create({
      originCountry: origin_country,
      destinationCountry: destination_country,
      visaRequired: visa_required,
      visaType: visa_type,
      processingTime: processing_time,
      cost,
      documentsRequired: documents_required,
      notes,
    });

    return corsJson({ success: true, visa }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return corsJson({ error: "Visa rule already exists for this route" }, { status: 409 });
    }
    console.error("Create visa error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
