import prisma from "../../lib/prisma";

export interface CreateTourismEventData {
  title: string;
  description?: string;
  country?: string;
  city?: string;
  location?: string;
  startDate?: Date | string;
  status?: string;
  link?: string;
  imageUrl?: string;
  isPublished?: boolean;
}

export class TourismEventModel {
  // Public : événements publiés (publiés ou à venir), triés par date.
  static async findPublic() {
    return prisma.tourismEvent.findMany({
      where: { isPublished: true },
      orderBy: [{ startDate: "asc" }, { title: "asc" }],
    });
  }

  static async findAll() {
    return prisma.tourismEvent.findMany({ orderBy: [{ startDate: "asc" }, { title: "asc" }] });
  }

  static async findById(id: number) {
    return prisma.tourismEvent.findUnique({ where: { id } });
  }

  static async create(data: CreateTourismEventData) {
    return prisma.tourismEvent.create({
      data: {
        title: data.title,
        description: data.description,
        country: data.country,
        city: data.city,
        location: data.location,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        status: data.status ?? "upcoming",
        link: data.link,
        imageUrl: data.imageUrl,
        isPublished: data.isPublished ?? false,
      },
    });
  }

  static async update(id: number, data: Partial<CreateTourismEventData>) {
    try {
      return await prisma.tourismEvent.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          country: data.country,
          city: data.city,
          location: data.location,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          status: data.status,
          link: data.link,
          imageUrl: data.imageUrl,
          isPublished: data.isPublished,
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.tourismEvent.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
