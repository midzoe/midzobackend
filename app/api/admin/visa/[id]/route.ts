import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { VisaModel } from "@/src/models/Visa";
import { visaPayload, parseEmbassyId } from "@/lib/visa-input";
import { validateVisaRule } from "@/lib/visa-guard";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const visaId = parseInt(id);
    if (isNaN(visaId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const body = await request.json();
    const data = visaPayload(body);

    const embassyId = parseEmbassyId(body.embassy_id);
    if (embassyId !== null && Number.isNaN(embassyId)) {
      return corsJson({ error: "embassy_id invalide" }, { status: 400 });
    }

    // La destination n'est contrôlée que si elle est fournie (mise à jour partielle) ;
    // l'ambassade l'est contre la destination réellement enregistrée après coup.
    const destination = data.destinationCountry ?? (await VisaModel.findById(visaId))?.destinationCountry;
    if (!destination) return corsJson({ error: "Visa rule not found" }, { status: 404 });

    const validationError = await validateVisaRule(
      destination,
      Object.prototype.hasOwnProperty.call(body, "embassy_id") ? embassyId : null
    );
    if (validationError) return corsJson({ error: validationError }, { status: 400 });

    const visa = await VisaModel.update(visaId, data);
    if (!visa) return corsJson({ error: "Visa rule not found" }, { status: 404 });

    return corsJson({ success: true, visa });
  } catch (error: any) {
    if (error.code === "P2002") {
      return corsJson(
        { error: "Une fiche existe déjà pour cette route et ce type de visa" },
        { status: 409 }
      );
    }
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
