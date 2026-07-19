import prisma from "../../lib/prisma";

export interface CreateLanguageCenterData {
  name: string;
  country: string;
  city?: string;
  language: string;
  levels?: string;
  link?: string;
  isPartner?: boolean;
}

export class LanguageCenterModel {
  static async findAll() {
    return prisma.languageCenter.findMany({
      orderBy: [{ country: "asc" }, { name: "asc" }],
    });
  }

  // Filtre insensible à la casse sur langue et/ou pays (AC #2, story 5.4).
  static async findFiltered(filters: { language?: string; country?: string }) {
    const where: Record<string, unknown> = {};
    if (filters.language) {
      where.language = { equals: filters.language, mode: "insensitive" };
    }
    if (filters.country) {
      where.country = { equals: filters.country, mode: "insensitive" };
    }
    return prisma.languageCenter.findMany({
      where,
      orderBy: [{ country: "asc" }, { name: "asc" }],
    });
  }

  static async findById(id: number) {
    return prisma.languageCenter.findUnique({ where: { id } });
  }

  static async create(data: CreateLanguageCenterData) {
    return prisma.languageCenter.create({
      data: {
        name: data.name,
        country: data.country,
        city: data.city,
        language: data.language,
        levels: data.levels,
        link: data.link,
        isPartner: data.isPartner ?? false,
      },
    });
  }

  static async update(id: number, data: Partial<CreateLanguageCenterData>) {
    try {
      return await prisma.languageCenter.update({
        where: { id },
        data: {
          name: data.name,
          country: data.country,
          city: data.city,
          language: data.language,
          levels: data.levels,
          link: data.link,
          isPartner: data.isPartner,
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.languageCenter.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
