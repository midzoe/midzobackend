import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { EmbassyModel } from "@/src/models/Embassy";

/**
 * Représentations diplomatiques côté site.
 *
 * - `?destination=France&origin=Togo` → LA mission compétente pour ce couple
 *   (celle installée dans le pays du demandeur, à défaut celle qui le dessert).
 * - `?country=France` → toutes les missions de ce pays.
 *
 * Gate 9.2 / FR37 : seules les missions vérifiées sortent — une adresse fausse
 * enverrait quelqu'un se déplacer pour rien.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");
    const destination = searchParams.get("destination");
    const origin = searchParams.get("origin");

    if (destination && origin) {
      const embassy = await EmbassyModel.findCompetent(destination, origin);
      if (!embassy) {
        return corsJson(
          { success: false, error: "No competent mission found for this route" },
          { status: 404 }
        );
      }
      return corsJson({
        success: true,
        data: embassy,
        isAbroad: !!embassy.hostCountry && embassy.hostCountry !== origin,
      });
    }

    const all = country
      ? await EmbassyModel.findByCountry(country)
      : await EmbassyModel.findAll();
    const items = all.filter(e => e.isValidated);

    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List embassies error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
