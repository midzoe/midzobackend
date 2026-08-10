import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { VisaModel } from "@/src/models/Visa";

/**
 * Fiches visa côté site. Gate 9.2 / FR37 : seules les fiches validées sortent —
 * une fiche en cours de rédaction ne doit pas orienter un dossier réel.
 * `type` cible un type de visa précis (« Étudiant », « Tourisme »…) ; sans lui,
 * la fiche « Étudiant » est renvoyée à défaut la première disponible.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const visaType = searchParams.get("type");

    if (from && to) {
      const visa = await VisaModel.findByRoutePublic(from, to, visaType);
      if (!visa) {
        return corsJson(
          { success: false, error: "No visa information found for this route" },
          { status: 404 }
        );
      }
      return corsJson({ success: true, visa });
    }

    const visas = await VisaModel.findAllPublic();
    return corsJson({ success: true, visas });
  } catch (error) {
    console.error("Visa query error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
