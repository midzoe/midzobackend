import prisma from "@/lib/prisma";
import { validateQuoteBody } from "@/lib/package-input";
import { PackageModel } from "@/src/models/Package";
import { PricingConfigModel } from "@/src/models/PricingConfig";
import type { QuotePackage, QuoteConfig } from "@/src/models/Quote";

/**
 * Entrée commune aux routes /packages/quote et /packages/recommend : validation + chargement.
 * Factorisé volontairement — deux copies de ces règles (catégories publiques, sous-catégories
 * rattachées à la sélection) divergeraient, et une divergence ici se paierait en euros.
 */

export interface ResolvedQuoteRequest {
  categories: string[];
  subcategoryIds: number[];
  packages: QuotePackage[];
  config: QuoteConfig;
}

/** Erreur d'entrée : `status` porte le code HTTP à renvoyer (400 = appelant, 503 = config absente). */
export class QuoteRequestError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "QuoteRequestError";
  }
}

export async function resolveQuoteRequest(body: any): Promise<ResolvedQuoteRequest> {
  const formatError = validateQuoteBody(body);
  if (formatError) throw new QuoteRequestError(formatError, 400);

  // Dédoublonnage avant tout calcul : un doublon ne doit ni gonfler le prix
  // ni faire basculer la sélection dans une tranche de dégressivité supérieure.
  const categories: string[] = [...new Set<string>(body.categories)];
  const subcategoryIds: number[] = [...new Set<number>(body.subcategory_ids ?? [])];

  // Seules les catégories publiques sont vendables (professional/business sont masquées depuis 1.5).
  const knownCategories = await prisma.category.findMany({
    where: { id: { in: categories }, isPublic: true },
    select: { id: true },
  });
  if (knownCategories.length !== categories.length) {
    const known = new Set(knownCategories.map((c) => c.id));
    const unknown = categories.filter((id) => !known.has(id));
    throw new QuoteRequestError(`Unknown or non-public category ids: ${unknown.join(", ")}`, 400);
  }

  if (subcategoryIds.length > 0) {
    const subcategories = await prisma.subcategory.findMany({
      where: { id: { in: subcategoryIds } },
      select: { id: true, categoryId: true },
    });

    if (subcategories.length !== subcategoryIds.length) {
      const known = new Set(subcategories.map((s) => s.id));
      const unknown = subcategoryIds.filter((id) => !known.has(id));
      throw new QuoteRequestError(`Unknown subcategory ids: ${unknown.join(", ")}`, 400);
    }

    // Une sous-catégorie d'une catégorie non sélectionnée serait facturée sans être vendue.
    const selected = new Set(categories);
    const orphans = subcategories.filter((s) => !selected.has(s.categoryId));
    if (orphans.length > 0) {
      throw new QuoteRequestError(
        `Subcategory ids not in selected categories: ${orphans.map((o) => o.id).join(", ")}`,
        400
      );
    }
  }

  const config = await PricingConfigModel.get();
  // Absente = seed jamais joué : échec explicite plutôt qu'un prix inventé.
  if (!config) throw new QuoteRequestError("Pricing config not initialized", 503);

  const packages = (await PackageModel.findAllPublic()) as unknown as QuotePackage[];

  return { categories, subcategoryIds, packages, config: config as unknown as QuoteConfig };
}
