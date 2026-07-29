import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { LanguageCenterModel } from "@/src/models/LanguageCenter";

/**
 * Story 5.14 : valeurs disponibles pour construire les filtres (pays, villes, langues,
 * niveaux, formats, examens). Calculé sur le catalogue publié, pour ne jamais proposer
 * un filtre qui ne ramènerait rien.
 */
export async function GET(_request: NextRequest) {
  try {
    const facets = await LanguageCenterModel.facets();
    return corsJson({ success: true, data: facets });
  } catch (error) {
    console.error("Language center facets error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
