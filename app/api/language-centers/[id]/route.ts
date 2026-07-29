import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { LanguageCenterModel } from "@/src/models/LanguageCenter";

/** Story 5.14 : fiche publique d'un centre de langue (404 tant qu'elle n'est pas validée). */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const centerId = parseInt(id);
    if (isNaN(centerId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const center = await LanguageCenterModel.findById(centerId);
    if (!center || !center.isValidated) {
      return corsJson({ error: "Language center not found" }, { status: 404 });
    }

    return corsJson({ success: true, data: center });
  } catch (error) {
    console.error("Get language center error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
