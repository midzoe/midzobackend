import prisma from "../../lib/prisma";

const SINGLETON_ID = 1;

export interface UpdatePricingConfigData {
  pricePerSubcategoryCents?: number;
  discountTwoCategoriesPct?: number;
  discountThreePlusCategoriesPct?: number;
  currency?: string;
}

function formatConfig(c: any) {
  return {
    price_per_subcategory_cents: c.pricePerSubcategoryCents,
    discount_two_categories_pct: c.discountTwoCategoriesPct,
    discount_three_plus_categories_pct: c.discountThreePlusCategoriesPct,
    currency: c.currency,
    updated_at: c.updatedAt,
  };
}

/**
 * Config tarifaire globale (singleton). Source unique des montants du devis (story 3.2) :
 * aucun montant ne doit être codé en dur ailleurs.
 */
export class PricingConfigModel {
  /** Renvoie la config, ou `null` si le seed n'a jamais tourné (pas de valeur par défaut en dur). */
  static async get() {
    const config = await prisma.pricingConfig.findUnique({ where: { id: SINGLETON_ID } });
    return config ? formatConfig(config) : null;
  }

  static async update(data: UpdatePricingConfigData) {
    const config = await prisma.pricingConfig.upsert({
      where: { id: SINGLETON_ID },
      update: data,
      create: { id: SINGLETON_ID, ...data },
    });
    return formatConfig(config);
  }
}
