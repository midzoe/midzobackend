import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { validatePricingConfigBody, toPricingConfigData } from "@/lib/package-input";
import { PricingConfigModel } from "@/src/models/PricingConfig";

/**
 * Saisie des tarifs par l'admin. Les montants sont seedés à 0 (aucun prix inventé) :
 * cet endpoint est le seul moyen de les renseigner tant que les écrans admin (Epic 9) n'existent pas.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const config = await PricingConfigModel.get();
    if (!config) return corsJson({ error: "Pricing config not initialized" }, { status: 503 });

    return corsJson({ success: true, config });
  } catch (error) {
    console.error("Admin get pricing config error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const error = validatePricingConfigBody(body);
    if (error) return corsJson({ error }, { status: 400 });

    const config = await PricingConfigModel.update(toPricingConfigData(body));
    return corsJson({ success: true, config });
  } catch (error) {
    console.error("Admin update pricing config error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, PUT, OPTIONS");
}
