import { PACKAGE_FAMILIES, BILLING_PERIODS, type PackageData } from "@/src/models/Package";

/**
 * Validation des entrées des routes admin packages.
 * Vit hors des route files : Next n'autorise que les handlers HTTP en export d'une route.
 */

/** Un montant est un entier de centimes >= 0 : un Float ou un négatif est un bug d'appelant, pas une donnée. */
export function invalidCents(value: unknown): boolean {
  return !Number.isInteger(value) || (value as number) < 0;
}

function invalidPct(value: unknown): boolean {
  return !Number.isInteger(value) || (value as number) < 0 || (value as number) > 100;
}

export function validatePackageBody(body: any, { partial = false } = {}): string | null {
  if (!partial || body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length === 0) return "name is required";
  }
  if (body.base_price_cents !== undefined && invalidCents(body.base_price_cents)) {
    return "base_price_cents must be an integer >= 0 (cents)";
  }
  if (
    body.price_per_subcategory_cents !== undefined &&
    body.price_per_subcategory_cents !== null &&
    invalidCents(body.price_per_subcategory_cents)
  ) {
    return "price_per_subcategory_cents must be an integer >= 0 (cents) or null";
  }
  if (body.categories !== undefined) {
    if (!Array.isArray(body.categories) || body.categories.some((c: unknown) => typeof c !== "string")) {
      return "categories must be an array of category ids";
    }
  }
  if (body.order !== undefined && !Number.isInteger(body.order)) return "order must be an integer";

  // --- Grille commerciale (vitrine) ---
  const family = body.family;
  if (family !== undefined && family !== null && family !== "") {
    if (!(PACKAGE_FAMILIES as readonly string[]).includes(family)) {
      return `family must be one of ${PACKAGE_FAMILIES.join(", ")} (or null)`;
    }
  }
  const priceFrom = body.price_from_cents ?? body.priceFromCents;
  if (priceFrom !== undefined && invalidCents(priceFrom)) {
    return "price_from_cents must be an integer >= 0 (cents)";
  }
  const billing = body.billing_period ?? body.billingPeriod;
  if (billing !== undefined && !(BILLING_PERIODS as readonly string[]).includes(billing)) {
    return `billing_period must be one of ${BILLING_PERIODS.join(", ")}`;
  }
  if (body.features !== undefined) {
    if (!Array.isArray(body.features) || body.features.some((f: unknown) => typeof f !== "string")) {
      return "features must be an array of strings";
    }
  }
  if (body.currency !== undefined && (typeof body.currency !== "string" || body.currency.length !== 3)) {
    return "currency must be a 3-letter code";
  }
  return null;
}

/** "" (champ vidé dans un formulaire) et null valent EFFACEMENT ; undefined = ne pas toucher. */
function optionalText(...candidates: unknown[]): string | null | undefined {
  const value = candidates.find((c) => c !== undefined);
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

export function toPackageData(body: any): PackageData {
  // Accepte snake_case (API historique) et camelCase (écran admin générique 9.6).
  return {
    name: body.name,
    description: body.description,
    basePriceCents: body.base_price_cents ?? body.basePriceCents,
    // `??` serait faux ici : `null` est une VALEUR (= « pas de prix propre, repli sur la
    // config globale »), pas une absence. Avec `??`, vider le champ dans l'admin retombait
    // sur `undefined` et Prisma ne touchait à rien — l'override devenait ineffaçable.
    pricePerSubcategoryCents:
      body.price_per_subcategory_cents !== undefined
        ? body.price_per_subcategory_cents
        : body.pricePerSubcategoryCents,
    isFullPackage: body.is_full_package ?? body.isFullPackage,
    isCustom: body.is_custom ?? body.isCustom,
    isActive: body.is_active ?? body.isActive,
    order: body.order,
    categories: body.categories,
    // Vitrine. Une famille vidée (« — Aucune — » dans l'admin) rebascule le package
    // côté moteur de devis : c'est un choix explicite de l'admin, pas un oubli.
    family: optionalText(body.family),
    slug: optionalText(body.slug),
    tagline: optionalText(body.tagline),
    serviceLabel: optionalText(body.service_label, body.serviceLabel),
    priceFromCents: body.price_from_cents ?? body.priceFromCents,
    billingPeriod: body.billing_period ?? body.billingPeriod,
    currency: body.currency,
    features: body.features,
    badge: optionalText(body.badge),
    isHighlighted: body.is_highlighted ?? body.isHighlighted,
  };
}

/** Validation de forme du devis (l'existence des catégories/sous-catégories se vérifie en base, côté route). */
export function validateQuoteBody(body: any): string | null {
  if (!Array.isArray(body?.categories) || body.categories.length === 0) {
    return "categories must be a non-empty array of category ids";
  }
  if (body.categories.some((c: unknown) => typeof c !== "string" || c.trim().length === 0)) {
    return "categories must be an array of category ids";
  }
  if (body.subcategory_ids !== undefined) {
    if (!Array.isArray(body.subcategory_ids) || body.subcategory_ids.some((id: unknown) => !Number.isInteger(id))) {
      return "subcategory_ids must be an array of integers";
    }
  }
  return null;
}

export function validatePricingConfigBody(body: any): string | null {
  const cents = ["price_per_subcategory_cents"];
  for (const key of cents) {
    if (body[key] !== undefined && invalidCents(body[key])) {
      return `${key} must be an integer >= 0 (cents)`;
    }
  }
  const percentages = ["discount_two_categories_pct", "discount_three_plus_categories_pct"];
  for (const key of percentages) {
    if (body[key] !== undefined && invalidPct(body[key])) {
      return `${key} must be an integer between 0 and 100`;
    }
  }
  if (body.currency !== undefined && (typeof body.currency !== "string" || body.currency.length !== 3)) {
    return "currency must be a 3-letter code";
  }
  return null;
}

export function toPricingConfigData(body: any) {
  return {
    pricePerSubcategoryCents: body.price_per_subcategory_cents,
    discountTwoCategoriesPct: body.discount_two_categories_pct,
    discountThreePlusCategoriesPct: body.discount_three_plus_categories_pct,
    currency: body.currency,
  };
}
