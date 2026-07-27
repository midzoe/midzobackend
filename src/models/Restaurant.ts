import prisma from "../../lib/prisma";

export interface CreateRestaurantData {
  name: string;
  country: string;
  city?: string;
  location: string;
  cuisine: string;
  priceRange: string;
  rating?: number;
  reviews?: number;
  features?: string[];
  image?: string;
  isActive?: boolean;
}

export class RestaurantModel {
  static async findAll(
    filters: { country?: string; cuisine?: string; priceRange?: string } = {}
  ) {
    return prisma.restaurant.findMany({
      where: {
        isActive: true,
        country: filters.country ? { equals: filters.country, mode: "insensitive" } : undefined,
        cuisine: filters.cuisine ? { equals: filters.cuisine, mode: "insensitive" } : undefined,
        priceRange: filters.priceRange ?? undefined,
      },
      orderBy: [{ country: "asc" }, { name: "asc" }],
    });
  }

  static async findAllAdmin() {
    return prisma.restaurant.findMany({ orderBy: [{ country: "asc" }, { name: "asc" }] });
  }

  static async findById(id: number) {
    return prisma.restaurant.findUnique({ where: { id } });
  }

  static async create(data: CreateRestaurantData) {
    return prisma.restaurant.create({
      data: {
        name: data.name,
        country: data.country,
        city: data.city,
        location: data.location,
        cuisine: data.cuisine,
        priceRange: data.priceRange,
        rating: data.rating,
        reviews: data.reviews,
        features: data.features as any,
        image: data.image,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async update(id: number, data: Partial<CreateRestaurantData>) {
    try {
      return await prisma.restaurant.update({
        where: { id },
        data: {
          name: data.name,
          country: data.country,
          city: data.city,
          location: data.location,
          cuisine: data.cuisine,
          priceRange: data.priceRange,
          rating: data.rating,
          reviews: data.reviews,
          features: data.features as any,
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
      await prisma.restaurant.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
