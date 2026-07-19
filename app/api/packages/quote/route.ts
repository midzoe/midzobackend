import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { resolveQuoteRequest, QuoteRequestError } from "@/lib/quote-request";
import { computeQuote } from "@/src/models/Quote";

/**
 * Devis en direct — volontairement PUBLIC (le prix doit être visible avant l'achat),
 * comme /api/packages et /api/packages/config.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categories, subcategoryIds, packages, config } = await resolveQuoteRequest(body);
    const quote = computeQuote({ categories, subcategoryIds }, packages, config);

    return corsJson({ success: true, quote });
  } catch (error) {
    if (error instanceof QuoteRequestError) {
      return corsJson({ error: error.message }, { status: error.status });
    }
    console.error("Quote error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
