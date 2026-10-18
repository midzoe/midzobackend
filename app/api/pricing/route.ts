import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { PricedServiceModel } from "@/src/models/PricedService";
import { PackageModel } from "@/src/models/Package";
import { AppSettingModel } from "@/src/models/AppSetting";

/**
 * Grille tarifaire publique : prix unitaire des services, paliers (Study / Tourism / Mix /
 * consultation) avec leur couverture, et options de paiement. Le calcul (à la carte vs
 * package, remise de paiement) se fait côté site à partir de ces seules données : changer
 * un prix en admin suffit, sans redéploiement.
 */
const INSTALLMENTS = [1, 3, 6, 12];

export async function GET(_request: NextRequest) {
  try {
    const [services, packages] = await Promise.all([
      PricedServiceModel.findActive(),
      PackageModel.findShowcase(),
    ]);
    const paymentOptions = [];
    for (const n of INSTALLMENTS) {
      paymentOptions.push({
        installments: n,
        discount_pct: await AppSettingModel.getInt(`payment.discount_pct.${n}`, 0, 0, 50),
      });
    }

    return corsJson({
      success: true,
      currency: "EUR",
      services: services.map((s) => ({
        code: s.code,
        family: s.family,
        name: s.name,
        complexity: s.complexity,
        price_cents: s.priceCents,
        currency: s.currency,
        order: s.order,
      })),
      packages,
      payment_options: paymentOptions,
    });
  } catch (error) {
    console.error("Pricing error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
