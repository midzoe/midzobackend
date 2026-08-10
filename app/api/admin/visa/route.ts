import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { VisaModel } from "@/src/models/Visa";
import { visaPayload, parseEmbassyId } from "@/lib/visa-input";
import { validateVisaRule } from "@/lib/visa-guard";

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
    const data = visaPayload(body);

    if (!data.originCountry || !data.destinationCountry) {
      return corsJson(
        { error: "origin_country and destination_country are required" },
        { status: 400 }
      );
    }

    const embassyId = parseEmbassyId(body.embassy_id);
    if (embassyId !== null && Number.isNaN(embassyId)) {
      return corsJson({ error: "embassy_id invalide" }, { status: 400 });
    }

    const validationError = await validateVisaRule(data.destinationCountry, embassyId);
    if (validationError) return corsJson({ error: validationError }, { status: 400 });

    const visa = await VisaModel.create({
      ...data,
      originCountry: data.originCountry,
      destinationCountry: data.destinationCountry,
    });

    return corsJson({ success: true, visa }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return corsJson(
        { error: "Une fiche existe déjà pour cette route et ce type de visa" },
        { status: 409 }
      );
    }
    console.error("Create visa error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
