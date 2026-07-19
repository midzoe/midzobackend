import prisma from "../../lib/prisma";

export interface CreatePartnerData {
  name: string;
  category?: string;
  url: string;
  logoUrl?: string;
  description?: string;
  isActive?: boolean;
}

export class PartnerModel {
  // Public : partenaires actifs, filtrables par catégorie.
  static async findPublic(category?: string) {
    return prisma.partner.findMany({
      where: {
        isActive: true,
        ...(category ? { category: { equals: category, mode: "insensitive" } } : {}),
      },
      orderBy: { name: "asc" },
    });
  }

  static async findAll() {
    return prisma.partner.findMany({ orderBy: { name: "asc" } });
  }

  static async findById(id: number) {
    return prisma.partner.findUnique({ where: { id } });
  }

  // Story 6.3 : incrémente le compteur de clics (redirection trackée).
  static async trackClick(id: number) {
    try {
      return await prisma.partner.update({
        where: { id },
        data: { clickCount: { increment: 1 } },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async create(data: CreatePartnerData) {
    return prisma.partner.create({
      data: {
        name: data.name,
        category: data.category,
        url: data.url,
        logoUrl: data.logoUrl,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async update(id: number, data: Partial<CreatePartnerData>) {
    try {
      return await prisma.partner.update({
        where: { id },
        data: {
          name: data.name,
          category: data.category,
          url: data.url,
          logoUrl: data.logoUrl,
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
      await prisma.partner.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
