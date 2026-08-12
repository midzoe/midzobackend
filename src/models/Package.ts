import prisma from "../../lib/prisma";

export interface PackageData {
  name: string;
  description?: string;
  basePriceCents?: number;
  pricePerSubcategoryCents?: number | null;
  isFullPackage?: boolean;
  isCustom?: boolean;
  isActive?: boolean;
  order?: number;
  categories?: string[];
  // Grille commerciale (vitrine). `family` null = package du moteur de devis.
  family?: string | null;
  slug?: string | null;
  tagline?: string | null;
  serviceLabel?: string | null;
  priceFromCents?: number;
  billingPeriod?: string;
  currency?: string;
  features?: string[];
  badge?: string | null;
  isHighlighted?: boolean;
}

/** Familles de la grille commerciale — ordre d'affichage de la vitrine. */
export const PACKAGE_FAMILIES = ["study", "tourism", "mix", "consultation"] as const;
export const BILLING_PERIODS = ["once", "month"] as const;

/** Erreur métier exploitable par les routes (→ 400 plutôt qu'un 500 opaque). */
export class InvalidCategoriesError extends Error {
  constructor(public readonly unknownIds: string[]) {
    super(`Unknown category ids: ${unknownIds.join(", ")}`);
    this.name = "InvalidCategoriesError";
  }
}

function formatPackage(p: any) {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? null,
    base_price_cents: p.basePriceCents,
    // null => repli sur PricingConfig.pricePerSubcategoryCents (résolu par le moteur de devis, story 3.2)
    price_per_subcategory_cents: p.pricePerSubcategoryCents ?? null,
    is_full_package: p.isFullPackage,
    is_custom: p.isCustom,
    is_active: p.isActive,
    order: p.order,
    categories: (p.categories ?? []).map((c: any) => c.categoryId),
    // Vitrine : null sur les packages du moteur de devis, renseigné sur les paliers.
    family: p.family ?? null,
    slug: p.slug ?? null,
    tagline: p.tagline ?? null,
    service_label: p.serviceLabel ?? null,
    price_from_cents: p.priceFromCents ?? 0,
    billing_period: p.billingPeriod ?? "once",
    currency: p.currency ?? "EUR",
    features: p.features ?? [],
    badge: p.badge ?? null,
    is_highlighted: p.isHighlighted ?? false,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

const INCLUDE_CATEGORIES = { categories: { select: { categoryId: true } } };

async function assertCategoriesExist(categoryIds: string[]) {
  if (categoryIds.length === 0) return;
  const found = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true },
  });
  const known = new Set(found.map((c) => c.id));
  const unknown = categoryIds.filter((id) => !known.has(id));
  if (unknown.length > 0) throw new InvalidCategoriesError(unknown);
}

export class PackageModel {
  /** Catalogue public : uniquement les packages actifs, dans l'ordre curaté. */
  static async findAllPublic() {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: INCLUDE_CATEGORIES,
    });
    return packages.map(formatPackage);
  }

  /**
   * Paliers de la grille commerciale (vitrine publique), actifs uniquement.
   * `family != null` est le seul critère : un package du moteur de devis n'a rien
   * à faire dans une grille de prix d'appel, et inversement.
   */
  static async findShowcase() {
    const packages = await prisma.package.findMany({
      where: { isActive: true, family: { not: null } },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: INCLUDE_CATEGORIES,
    });
    return packages.map(formatPackage);
  }

  /**
   * Packages servant au CALCUL du devis (stories 3.2/3.3) : uniquement ceux du moteur.
   * Sans ce filtre, un palier de la vitrine (catégories vides, prix d'appel) entrerait
   * dans le moteur de recommandation et pourrait fausser un montant facturé.
   */
  static async findQuotable() {
    const packages = await prisma.package.findMany({
      where: { isActive: true, family: null },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: INCLUDE_CATEGORIES,
    });
    return packages.map(formatPackage);
  }

  /** Vue admin : tout, y compris les packages désactivés. */
  static async findAllAdmin() {
    const packages = await prisma.package.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: INCLUDE_CATEGORIES,
    });
    return packages.map(formatPackage);
  }

  static async findById(id: number) {
    const p = await prisma.package.findUnique({ where: { id }, include: INCLUDE_CATEGORIES });
    return p ? formatPackage(p) : null;
  }

  static async create(data: PackageData) {
    const categories = data.categories ?? [];
    await assertCategoriesExist(categories);

    // Package et catégories écrits ensemble : un package sans ses catégories serait un état invalide.
    const created = await prisma.$transaction(async (tx) => {
      const pkg = await tx.package.create({
        data: {
          name: data.name,
          description: data.description,
          basePriceCents: data.basePriceCents ?? 0,
          pricePerSubcategoryCents: data.pricePerSubcategoryCents ?? null,
          isFullPackage: data.isFullPackage ?? false,
          isCustom: data.isCustom ?? false,
          isActive: data.isActive ?? true,
          order: data.order ?? 0,
          family: data.family ?? null,
          slug: data.slug ?? null,
          tagline: data.tagline ?? null,
          serviceLabel: data.serviceLabel ?? null,
          priceFromCents: data.priceFromCents ?? 0,
          billingPeriod: data.billingPeriod ?? "once",
          currency: data.currency ?? "EUR",
          features: data.features ?? [],
          badge: data.badge ?? null,
          isHighlighted: data.isHighlighted ?? false,
        },
      });

      if (categories.length > 0) {
        await tx.packageCategory.createMany({
          data: categories.map((categoryId) => ({ packageId: pkg.id, categoryId })),
        });
      }

      return tx.package.findUnique({ where: { id: pkg.id }, include: INCLUDE_CATEGORIES });
    });

    return formatPackage(created);
  }

  static async update(id: number, data: PackageData) {
    if (data.categories) await assertCategoriesExist(data.categories);

    try {
      const updated = await prisma.$transaction(async (tx) => {
        await tx.package.update({
          where: { id },
          data: {
            name: data.name,
            description: data.description,
            basePriceCents: data.basePriceCents,
            pricePerSubcategoryCents: data.pricePerSubcategoryCents,
            isFullPackage: data.isFullPackage,
            isCustom: data.isCustom,
            isActive: data.isActive,
            order: data.order,
            // `undefined` = champ absent du PATCH => Prisma n'y touche pas.
            family: data.family,
            slug: data.slug,
            tagline: data.tagline,
            serviceLabel: data.serviceLabel,
            priceFromCents: data.priceFromCents,
            billingPeriod: data.billingPeriod,
            currency: data.currency,
            features: data.features,
            badge: data.badge,
            isHighlighted: data.isHighlighted,
          },
        });

        // Remplacement complet des catégories (pattern des langues dans UserModel.update).
        if (data.categories) {
          await tx.packageCategory.deleteMany({ where: { packageId: id } });
          if (data.categories.length > 0) {
            await tx.packageCategory.createMany({
              data: data.categories.map((categoryId) => ({ packageId: id, categoryId })),
            });
          }
        }

        return tx.package.findUnique({ where: { id }, include: INCLUDE_CATEGORIES });
      });

      return formatPackage(updated);
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.package.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
