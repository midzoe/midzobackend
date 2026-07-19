import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { resolveQuoteRequest, QuoteRequestError } from "@/lib/quote-request";
import { computeRecommendation } from "@/src/models/Quote";

/**
 * Recommandation de package — publique, comme le devis (le client doit pouvoir comparer avant d'adhérer).
 * Mêmes règles de validation que /api/packages/quote (module partagé).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categories, subcategoryIds, packages, config } = await resolveQuoteRequest(body);
    const recommendation = computeRecommendation({ categories, subcategoryIds }, packages, config);

    return corsJson({ success: true, recommendation });
  } catch (error) {
    if (error instanceof QuoteRequestError) {
      return corsJson({ error: error.message }, { status: error.status });
    }
    console.error("Recommend error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
