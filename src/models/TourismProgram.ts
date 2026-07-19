import prisma from "../../lib/prisma";

export interface CreateTourismProgramData {
  title: string;
  subcategory: string;
  country: string;
  city?: string;
  description?: string;
  itinerary?: string;
  transport?: string;
  price?: number;
  currency?: string;
  images?: unknown;
  isValidated?: boolean;
}

export class TourismProgramModel {
  // Public : seuls les programmes validés, filtrables par sous-catégorie (safari/sport).
  static async findPublic(subcategory?: string) {
    return prisma.tourismProgram.findMany({
      where: {
        isValidated: true,
        ...(subcategory ? { subcategory: { equals: subcategory, mode: "insensitive" } } : {}),
      },
      orderBy: [{ subcategory: "asc" }, { title: "asc" }],
    });
  }

  static async findAll() {
    return prisma.tourismProgram.findMany({ orderBy: [{ subcategory: "asc" }, { title: "asc" }] });
  }

  static async findById(id: number) {
    return prisma.tourismProgram.findUnique({ where: { id } });
  }

  static async create(data: CreateTourismProgramData) {
    return prisma.tourismProgram.create({
      data: {
        title: data.title,
        subcategory: data.subcategory,
        country: data.country,
        city: data.city,
        description: data.description,
        itinerary: data.itinerary,
        transport: data.transport,
        price: data.price,
        currency: data.currency ?? "EUR",
        images: data.images as any,
        isValidated: data.isValidated ?? false,
      },
    });
  }

  static async update(id: number, data: Partial<CreateTourismProgramData>) {
    try {
      return await prisma.tourismProgram.update({
        where: { id },
        data: {
          title: data.title,
          subcategory: data.subcategory,
          country: data.country,
          city: data.city,
          description: data.description,
          itinerary: data.itinerary,
          transport: data.transport,
          price: data.price,
          currency: data.currency,
          images: data.images as any,
          isValidated: data.isValidated,
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.tourismProgram.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
