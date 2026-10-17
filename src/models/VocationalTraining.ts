import prisma from "../../lib/prisma";

// Offres de formation professionnelle en alternance (Ausbildung) — parcours Study.
export interface VocationalTrainingData {
  occupation: string;
  domain: string;
  employer: string;
  employerType?: string;
  country: string;
  city: string;
  durationMonths?: number;
  languageLevel?: string;
  salary?: string;
  startDates?: string[];
  requirements?: string[];
  documents?: string[];
  description?: string;
  applicationUrl?: string;
  isValidated?: boolean;
}

export class VocationalTrainingModel {
  /** Liste publique : seules les offres validées sont servies. */
  static async findAll(filters: { country?: string; city?: string; domain?: string } = {}) {
    return prisma.vocationalTraining.findMany({
      where: {
        isValidated: true,
        country: filters.country ? { equals: filters.country, mode: "insensitive" } : undefined,
        city: filters.city ? { contains: filters.city, mode: "insensitive" } : undefined,
        domain: filters.domain ? { equals: filters.domain, mode: "insensitive" } : undefined,
      },
      orderBy: [{ country: "asc" }, { city: "asc" }, { employer: "asc" }],
    });
  }

  static async findAllAdmin() {
    return prisma.vocationalTraining.findMany({ orderBy: [{ country: "asc" }, { city: "asc" }, { employer: "asc" }] });
  }

  static async create(data: VocationalTrainingData) {
    return prisma.vocationalTraining.create({
      data: {
        ...data,
        startDates: data.startDates ?? [],
        requirements: data.requirements ?? [],
        documents: data.documents ?? [],
      },
    });
  }

  static async update(id: number, data: Partial<VocationalTrainingData>) {
    try {
      return await prisma.vocationalTraining.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.vocationalTraining.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
