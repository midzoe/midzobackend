import prisma from "../../lib/prisma";

export interface CreateTouristSiteData {
  name: string;
  country: string;
  city?: string;
  location: string;
  category: string;
  description?: string;
  rating?: number;
  reviews?: number;
  price?: string;
  features?: string[];
  image?: string;
  isActive?: boolean;
}

export class TouristSiteModel {
  static async findAll(filters: { country?: string; category?: string } = {}) {
    return prisma.touristSite.findMany({
      where: {
        isActive: true,
        country: filters.country ? { equals: filters.country, mode: "insensitive" } : undefined,
        category: filters.category ? { equals: filters.category, mode: "insensitive" } : undefined,
      },
      orderBy: [{ country: "asc" }, { name: "asc" }],
    });
  }

  static async findAllAdmin() {
    return prisma.touristSite.findMany({ orderBy: [{ country: "asc" }, { name: "asc" }] });
  }

  static async findById(id: number) {
    return prisma.touristSite.findUnique({ where: { id } });
  }

  static async create(data: CreateTouristSiteData) {
    return prisma.touristSite.create({
      data: {
        name: data.name,
        country: data.country,
        city: data.city,
        location: data.location,
        category: data.category,
        description: data.description,
        rating: data.rating,
        reviews: data.reviews,
        price: data.price,
        features: data.features as any,
        image: data.image,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async update(id: number, data: Partial<CreateTouristSiteData>) {
    try {
      return await prisma.touristSite.update({
        where: { id },
        data: {
          name: data.name,
          country: data.country,
          city: data.city,
          location: data.location,
          category: data.category,
          description: data.description,
          rating: data.rating,
          reviews: data.reviews,
          price: data.price,
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
      await prisma.touristSite.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
