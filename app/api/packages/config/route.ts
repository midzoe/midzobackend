import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { PricingConfigModel } from "@/src/models/PricingConfig";

/** Config tarifaire publique : source unique des montants pour le devis en direct (story 3.2). */
export async function GET(_request: NextRequest) {
  try {
    const config = await PricingConfigModel.get();
    // Absente = le seed n'a pas tourné. On le dit franchement plutôt que de renvoyer des montants inventés.
    if (!config) return corsJson({ error: "Pricing config not initialized" }, { status: 503 });

    return corsJson({ success: true, config });
  } catch (error) {
    console.error("Pricing config error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
