import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { LanguageCenterModel } from "@/src/models/LanguageCenter";

/**
 * Story 5.4 (filtres langue/pays), enrichie story 5.14.
 *
 * Liste publique : seules les fiches validées sortent (gate Epic 9). Les filtres sont
 * cumulables et insensibles à la casse ; `country` attend le vocabulaire anglais du
 * catalogue universités (« Germany »), `language` le vocabulaire français (« Allemand »),
 * ce qui permet la redirection ?language=&country= depuis une fiche université.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const get = (key: string) => searchParams.get(key)?.trim() || undefined;

    const items = await LanguageCenterModel.findFiltered({
      language: get("language"),
      country: get("country"),
      city: get("city"),
      level: get("level"),
      courseType: get("course_type") ?? get("courseType"),
      exam: get("exam"),
      onlyPartners: searchParams.get("partners") === "true",
      q: get("q"),
    });

    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List language centers error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
