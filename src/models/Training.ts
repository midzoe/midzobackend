import prisma from "../../lib/prisma";

export interface CreateTrainingData {
  provider: string;
  country: string;
  city?: string;
  course: string;
  duration?: string;
  price?: string;
  certification?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  features?: string[];
  image?: string;
  description?: string;
  link?: string;
  isActive?: boolean;
}

export class TrainingModel {
  static async findAll(
    filters: { country?: string; category?: string; duration?: string; search?: string } = {}
  ) {
    return prisma.training.findMany({
      where: {
        isActive: true,
        country: filters.country ? { equals: filters.country, mode: "insensitive" } : undefined,
        category: filters.category ? { equals: filters.category, mode: "insensitive" } : undefined,
        duration: filters.duration ? { equals: filters.duration, mode: "insensitive" } : undefined,
        OR: filters.search
          ? [
              { course: { contains: filters.search, mode: "insensitive" } },
              { provider: { contains: filters.search, mode: "insensitive" } },
            ]
          : undefined,
      },
      orderBy: [{ country: "asc" }, { provider: "asc" }],
    });
  }

  static async findAllAdmin() {
    return prisma.training.findMany({ orderBy: [{ country: "asc" }, { provider: "asc" }] });
  }

  static async findById(id: number) {
    return prisma.training.findUnique({ where: { id } });
  }

  static async create(data: CreateTrainingData) {
    return prisma.training.create({
      data: {
        provider: data.provider,
        country: data.country,
        city: data.city,
        course: data.course,
        duration: data.duration,
        price: data.price,
        certification: data.certification,
        category: data.category,
        rating: data.rating,
        reviews: data.reviews,
        features: data.features as any,
        image: data.image,
        description: data.description,
        link: data.link,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async update(id: number, data: Partial<CreateTrainingData>) {
    try {
      return await prisma.training.update({
        where: { id },
        data: {
          provider: data.provider,
          country: data.country,
          city: data.city,
          course: data.course,
          duration: data.duration,
          price: data.price,
          certification: data.certification,
          category: data.category,
          rating: data.rating,
          reviews: data.reviews,
          features: data.features as any,
          image: data.image,
          description: data.description,
          link: data.link,
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
      await prisma.training.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
