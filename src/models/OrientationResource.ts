import prisma from "../../lib/prisma";

export interface CreateOrientationResourceData {
  title: string;
  type: string;
  category?: string;
  description?: string;
  provider?: string;
  link?: string;
  location?: string;
  imageUrl?: string;
  isValidated?: boolean;
  order?: number;
}

export class OrientationResourceModel {
  // Public : uniquement les ressources validées (gate 9.2), filtrables type/catégorie.
  static async findPublic(filters?: { type?: string; category?: string }) {
    return prisma.orientationResource.findMany({
      where: {
        isValidated: true,
        ...(filters?.type ? { type: filters.type } : {}),
        ...(filters?.category ? { category: { equals: filters.category, mode: "insensitive" } } : {}),
      },
      orderBy: [{ order: "asc" }, { title: "asc" }],
    });
  }

  static async findAll() {
    return prisma.orientationResource.findMany({ orderBy: [{ order: "asc" }, { title: "asc" }] });
  }

  static async findById(id: number) {
    return prisma.orientationResource.findUnique({ where: { id } });
  }

  static async create(data: CreateOrientationResourceData) {
    return prisma.orientationResource.create({
      data: {
        title: data.title,
        type: data.type,
        category: data.category,
        description: data.description,
        provider: data.provider,
        link: data.link,
        location: data.location,
        imageUrl: data.imageUrl,
        isValidated: data.isValidated ?? true,
        order: data.order ?? 0,
      },
    });
  }

  static async update(id: number, data: Partial<CreateOrientationResourceData>) {
    try {
      return await prisma.orientationResource.update({
        where: { id },
        data: {
          title: data.title,
          type: data.type,
          category: data.category,
          description: data.description,
          provider: data.provider,
          link: data.link,
          location: data.location,
          imageUrl: data.imageUrl,
          isValidated: data.isValidated,
          order: data.order,
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.orientationResource.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
