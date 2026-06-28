import prisma from "../../lib/prisma";

export interface CreateAccommodationData {
  name: string;
  country: string;
  city: string;
  type: string;
  pricePerMonth: number;
  currency?: string;
  contact?: string;
  description?: string;
  images?: string[];
}

const VALID_TYPES = ["studio", "shared", "residence", "homestay"];

export class AccommodationModel {
  static async findAll(filters: {
    country?: string;
    city?: string;
    type?: string;
    maxPrice?: number;
  }) {
    return prisma.accommodation.findMany({
      where: {
        country: filters.country ? { equals: filters.country, mode: "insensitive" } : undefined,
        city: filters.city ? { equals: filters.city, mode: "insensitive" } : undefined,
        type: filters.type && VALID_TYPES.includes(filters.type) ? filters.type : undefined,
        pricePerMonth: filters.maxPrice ? { lte: filters.maxPrice } : undefined,
      },
      orderBy: { pricePerMonth: "asc" },
    });
  }

  static async findById(id: number) {
    return prisma.accommodation.findUnique({ where: { id } });
  }

  static async create(data: CreateAccommodationData) {
    return prisma.accommodation.create({
      data: {
        name: data.name,
        country: data.country,
        city: data.city,
        type: data.type,
        pricePerMonth: data.pricePerMonth,
        currency: data.currency ?? "EUR",
        contact: data.contact,
        description: data.description,
        images: data.images as any,
      },
    });
  }

  static async update(id: number, data: Partial<CreateAccommodationData>) {
    try {
      return await prisma.accommodation.update({
        where: { id },
        data: {
          name: data.name,
          country: data.country,
          city: data.city,
          type: data.type,
          pricePerMonth: data.pricePerMonth,
          currency: data.currency,
          contact: data.contact,
          description: data.description,
          images: data.images as any,
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.accommodation.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
