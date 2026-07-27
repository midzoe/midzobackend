import prisma from "../../lib/prisma";

export interface CreateTourismAccommodationData {
  name: string;
  country: string;
  city: string;
  type: string;
  priceRange: string;
  amenities?: string[];
  rating?: number;
  reviews?: number;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export class TourismAccommodationModel {
  static async findAll(
    filters: { country?: string; city?: string; type?: string; priceRange?: string } = {}
  ) {
    return prisma.tourismAccommodation.findMany({
      where: {
        isActive: true,
        country: filters.country ? { equals: filters.country, mode: "insensitive" } : undefined,
        city: filters.city ? { equals: filters.city, mode: "insensitive" } : undefined,
        type: filters.type ? { equals: filters.type, mode: "insensitive" } : undefined,
        priceRange: filters.priceRange ?? undefined,
      },
      orderBy: [{ country: "asc" }, { city: "asc" }, { name: "asc" }],
    });
  }

  static async findAllAdmin() {
    return prisma.tourismAccommodation.findMany({
      orderBy: [{ country: "asc" }, { city: "asc" }, { name: "asc" }],
    });
  }

  static async findById(id: number) {
    return prisma.tourismAccommodation.findUnique({ where: { id } });
  }

  static async create(data: CreateTourismAccommodationData) {
    return prisma.tourismAccommodation.create({
      data: {
        name: data.name,
        country: data.country,
        city: data.city,
        type: data.type,
        priceRange: data.priceRange,
        amenities: data.amenities as any,
        rating: data.rating,
        reviews: data.reviews,
        description: data.description,
        image: data.image,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async update(id: number, data: Partial<CreateTourismAccommodationData>) {
    try {
      return await prisma.tourismAccommodation.update({
        where: { id },
        data: {
          name: data.name,
          country: data.country,
          city: data.city,
          type: data.type,
          priceRange: data.priceRange,
          amenities: data.amenities as any,
          rating: data.rating,
          reviews: data.reviews,
          description: data.description,
          image: data.image,
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
      await prisma.tourismAccommodation.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
