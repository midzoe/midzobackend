/**
 * Moteur de devis (story 3.2).
 *
 * Règles produit (décisions de Thierno, 2026-07-17) — ne pas « améliorer » :
 *  - La sélection correspond EXACTEMENT aux catégories d'un package actif
 *      → base = prix de ce package, et AUCUNE remise dégressive (elle est déjà incluse
 *        dans le tarif du duo/full : l'ajouter reviendrait à brader l'offre).
 *  - Sinon → package PERSONNALISÉ : base = somme des bases des packages mono des catégories
 *        choisies, et la dégressivité s'applique (2 catégories, puis 3+). C'est son seul
 *        mécanisme d'avantage multi-catégories.
 *
 * `computeQuote` est volontairement PURE (aucun accès base) : les cas de bord sont nombreux
 * et doivent pouvoir être vérifiés exhaustivement en mémoire.
 */

/** Package tel que formaté par PackageModel (snake_case, montants en centimes). */
export interface QuotePackage {
  id: number;
  name: string;
  base_price_cents: number;
  price_per_subcategory_cents: number | null;
  is_custom: boolean;
  /** Cible d'upsell de la recommandation (story 3.3). */
  is_full_package: boolean;
  categories: string[];
}

export interface QuoteConfig {
  price_per_subcategory_cents: number;
  discount_two_categories_pct: number;
  discount_three_plus_categories_pct: number;
  currency: string;
}

export interface QuoteInput {
  categories: string[];
  subcategoryIds: number[];
}

export interface Quote {
  is_custom: boolean;
  package: { id: number; name: string } | null;
  categories: string[];
  subcategory_count: number;
  base_price_cents: number;
  subcategories_price_cents: number;
  subtotal_cents: number;
  discount_pct: number;
  discount_cents: number;
  total_cents: number;
  currency: string;
}

export interface Upsell {
  package: { id: number; name: string };
  quote: Quote;
  added_categories: string[];
  /** Signé : négatif = l'offre élargie coûte MOINS cher que la sélection. */
  delta_cents: number;
}

export interface Recommendation {
  quote: Quote;
  upsell: Upsell | null;
}

const sameSet = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const set = new Set(b);
  return a.every((item) => set.has(item));
};

/** Remise dégressive du chemin personnalisé : rien à 1 catégorie, pct2 à 2, pct3+ au-delà. */
function discountPctFor(categoryCount: number, config: QuoteConfig): number {
  if (categoryCount >= 3) return config.discount_three_plus_categories_pct;
  if (categoryCount === 2) return config.discount_two_categories_pct;
  return 0;
}

export function computeQuote(input: QuoteInput, packages: QuotePackage[], config: QuoteConfig): Quote {
  // Dédoublonnage AVANT tout calcul : un doublon ne doit ni gonfler le prix
  // ni faire basculer la sélection dans une tranche de dégressivité supérieure.
  const categories = [...new Set(input.categories)];
  const subcategoryCount = new Set(input.subcategoryIds).size;

  const matched = packages.find((p) => sameSet(p.categories, categories)) ?? null;

  if (matched) {
    const unit = matched.price_per_subcategory_cents ?? config.price_per_subcategory_cents;
    const base = matched.base_price_cents;
    const subcategoriesPrice = subcategoryCount * unit;
    const subtotal = base + subcategoriesPrice;

    return {
      is_custom: matched.is_custom,
      package: { id: matched.id, name: matched.name },
      categories,
      subcategory_count: subcategoryCount,
      base_price_cents: base,
      subcategories_price_cents: subcategoriesPrice,
      subtotal_cents: subtotal,
      // Chemin prédéfini : la dégressivité vit déjà dans le prix du package.
      discount_pct: 0,
      discount_cents: 0,
      total_cents: subtotal,
      currency: config.currency,
    };
  }

  // Chemin personnalisé : base = somme des bases mono des catégories choisies.
  const base = categories.reduce((sum, categoryId) => {
    const mono = packages.find((p) => sameSet(p.categories, [categoryId]));
    return sum + (mono?.base_price_cents ?? 0);
  }, 0);

  const subcategoriesPrice = subcategoryCount * config.price_per_subcategory_cents;
  const subtotal = base + subcategoriesPrice;
  const discountPct = discountPctFor(categories.length, config);
  // Arrondi en centimes entiers : jamais de flottant en sortie du moteur.
  const discountCents = Math.round((subtotal * discountPct) / 100);

  return {
    is_custom: true,
    package: null,
    categories,
    subcategory_count: subcategoryCount,
    base_price_cents: base,
    subcategories_price_cents: subcategoriesPrice,
    subtotal_cents: subtotal,
    discount_pct: discountPct,
    discount_cents: discountCents,
    total_cents: subtotal - discountCents,
    currency: config.currency,
  };
}

/**
 * Recommandation (story 3.3) : offre retenue + upsell vers le « full package top » + delta.
 *
 * Ne recalcule RIEN par elle-même : elle appelle `computeQuote` deux fois. Toute logique de prix
 * dupliquée ici finirait par diverger du moteur.
 *
 * Décision produit (Thierno, 2026-07-17) : aucun package duo n'existe — une sélection de 2 catégories
 * est donc légitimement recommandée en « personnalisé » (avec remise dégressive).
 */
export function computeRecommendation(
  input: QuoteInput,
  packages: QuotePackage[],
  config: QuoteConfig
): Recommendation {
  const quote = computeQuote(input, packages, config);
  const categories = quote.categories; // déjà dédoublonnées par computeQuote

  const full = packages.find((p) => p.is_full_package) ?? null;

  // Rien à proposer : pas de full package en base, ou le client l'a déjà.
  if (!full || (quote.package && quote.package.id === full.id)) {
    return { quote, upsell: null };
  }

  // La sélection contient une catégorie hors du full package : « monter » en gamme lui en retirerait.
  const fullCategories = new Set(full.categories);
  if (categories.some((categoryId) => !fullCategories.has(categoryId))) {
    return { quote, upsell: null };
  }

  // Mêmes sous-catégories : on n'invente pas de besoin que le client n'a pas exprimé.
  const upsellQuote = computeQuote(
    { categories: full.categories, subcategoryIds: input.subcategoryIds },
    packages,
    config
  );

  return {
    quote,
    upsell: {
      package: { id: full.id, name: full.name },
      quote: upsellQuote,
      added_categories: full.categories.filter((categoryId) => !categories.includes(categoryId)),
      // Signé, jamais Math.abs : un delta négatif (le full est moins cher) est une info commerciale.
      delta_cents: upsellQuote.total_cents - quote.total_cents,
    },
  };
}
