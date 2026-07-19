import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { requirePremiumTripReadiness } from "@/lib/premium-guard";

/**
 * Démarrage d'un trip premium — story 3.6.
 *
 * ⚠️ Cette story livre la GARDE, pas la fonctionnalité trip. La création réelle d'un trip
 * (destinations, vols, dates…) relève d'un épic ultérieur (espace voyage) ; cet endpoint
 * n'y touche pas et ne persiste rien. Il enforce la complétude du profil premium (FR9)
 * et répond « prêt » — l'épic trips étoffera ce handler pour créer le trip après le guard.
 */
export async function POST(request: NextRequest) {
  try {
    const readiness = await requirePremiumTripReadiness(request);
    if (!readiness.ok) {
      return corsJson(
        { error: readiness.error, ...(readiness.missing ? { missing: readiness.missing } : {}) },
        { status: readiness.status }
      );
    }

    // Profil premium complet : le trip peut démarrer. (Création réelle → épic trips.)
    return corsJson({ success: true, ready: true });
  } catch (error) {
    console.error("Premium trip start error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
