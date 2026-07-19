import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { PartnerModel } from "@/src/models/Partner";

// Story 6.3 : redirection trackée — incrémente le compteur de clics du partenaire.
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const partnerId = parseInt(id);
    if (isNaN(partnerId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const partner = await PartnerModel.trackClick(partnerId);
    if (!partner) return corsJson({ error: "Partner not found" }, { status: 404 });

    return corsJson({ success: true, url: partner.url, clickCount: partner.clickCount });
  } catch (error) {
    console.error("Track partner click error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
