import prisma from "../../lib/prisma";

export interface CreateInsurancePlanData {
  provider: string;
  country: string;
  audience?: string;
  coverageTypes?: string[];
  benefits?: string[];
  insuranceTypes?: string[];
  monthlyPremium?: string;
  coverage?: string;
  rating?: number;
  reviews?: number;
  image?: string;
  description?: string;
  isActive?: boolean;
}

export interface InsurancePlanFilters {
  audience?: string;
  country?: string;
  /** Filtre « contient » sur le tableau JSON coverageTypes, appliqué en mémoire. */
  coverageType?: string;
}

export class InsurancePlanModel {
  static async findAll(filters: InsurancePlanFilters = {}) {
    const plans = await prisma.insurancePlan.findMany({
      where: {
        isActive: true,
        audience: filters.audience ? { equals: filters.audience, mode: "insensitive" } : undefined,
        country: filters.country ? { equals: filters.country, mode: "insensitive" } : undefined,
      },
      orderBy: [{ country: "asc" }, { provider: "asc" }],
    });

    // Postgres sait filtrer un JSONB, mais pas avec la casse souple attendue ici :
    // le filtre par type de couverture reste donc côté serveur applicatif.
    if (!filters.coverageType) return plans;
    const needle = filters.coverageType.toLowerCase();
    return plans.filter((plan) => {
      const types = Array.isArray(plan.coverageTypes) ? (plan.coverageTypes as string[]) : [];
      return types.some((t) => String(t).toLowerCase() === needle);
    });
  }

  static async findAllAdmin() {
    return prisma.insurancePlan.findMany({ orderBy: [{ audience: "asc" }, { provider: "asc" }] });
  }

  static async findById(id: number) {
    return prisma.insurancePlan.findUnique({ where: { id } });
  }

  static async create(data: CreateInsurancePlanData) {
    return prisma.insurancePlan.create({
      data: {
        provider: data.provider,
        country: data.country,
        audience: data.audience ?? "general",
        coverageTypes: data.coverageTypes as any,
        benefits: data.benefits as any,
        insuranceTypes: data.insuranceTypes as any,
        monthlyPremium: data.monthlyPremium,
        coverage: data.coverage,
        rating: data.rating,
        reviews: data.reviews,
        image: data.image,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async update(id: number, data: Partial<CreateInsurancePlanData>) {
    try {
      return await prisma.insurancePlan.update({
        where: { id },
        data: {
          provider: data.provider,
          country: data.country,
          audience: data.audience,
          coverageTypes: data.coverageTypes as any,
          benefits: data.benefits as any,
          insuranceTypes: data.insuranceTypes as any,
          monthlyPremium: data.monthlyPremium,
          coverage: data.coverage,
          rating: data.rating,
          reviews: data.reviews,
          image: data.image,
          description: data.description,
          isActive: data.isActive,
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.insurancePlan.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
