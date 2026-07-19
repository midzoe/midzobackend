import prisma from "../../lib/prisma";

export interface CreateTourismCountryData {
  name: string;
  nameFr?: string;
  region?: string;
  capital?: string;
  flag?: string;
  image?: string;
  description?: string;
  currency?: string;
  language?: string;
  bestTime?: string;
  avgBudgetPerDay?: string;
  topAttractions?: string[];
  visaForAfricans?: string;
  processingTimeVisa?: string;
  directFlightsFrom?: string[];
  tourismAvailable?: boolean;
  isValidated?: boolean;
}

export class TourismCountryModel {
  // Admin : tout, y compris les brouillons.
  static async findAll() {
    return prisma.tourismCountry.findMany({ orderBy: { name: "asc" } });
  }

  // Public (gate 9.2 / FR37) : uniquement les pays validés.
  static async findPublic() {
    return prisma.tourismCountry.findMany({ where: { isValidated: true }, orderBy: { name: "asc" } });
  }

  static async findById(id: number) {
    return prisma.tourismCountry.findUnique({ where: { id } });
  }

  static async findByIdPublic(id: number) {
    const c = await prisma.tourismCountry.findUnique({ where: { id } });
    return c && c.isValidated ? c : null;
  }

  static async create(data: CreateTourismCountryData) {
    return prisma.tourismCountry.create({
      data: {
        name: data.name,
        nameFr: data.nameFr,
        region: data.region,
        capital: data.capital,
        flag: data.flag,
        image: data.image,
        description: data.description,
        currency: data.currency,
        language: data.language,
        bestTime: data.bestTime,
        avgBudgetPerDay: data.avgBudgetPerDay,
        topAttractions: data.topAttractions ?? [],
        visaForAfricans: data.visaForAfricans,
        processingTimeVisa: data.processingTimeVisa,
        directFlightsFrom: data.directFlightsFrom ?? [],
        tourismAvailable: data.tourismAvailable ?? true,
        isValidated: data.isValidated ?? false,
      },
    });
  }

  static async update(id: number, data: Partial<CreateTourismCountryData>) {
    try {
      return await prisma.tourismCountry.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.tourismCountry.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
