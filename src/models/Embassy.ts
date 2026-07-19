import prisma from "../../lib/prisma";

export interface CreateEmbassyData {
  country: string;
  name: string;
  location?: string;
  link?: string;
  email?: string;
  phone?: string;
}

export class EmbassyModel {
  static async findAll() {
    return prisma.embassy.findMany({
      orderBy: [{ country: "asc" }, { name: "asc" }],
    });
  }

  static async findByCountry(country: string) {
    return prisma.embassy.findMany({
      where: { country },
      orderBy: { name: "asc" },
    });
  }

  static async findById(id: number) {
    return prisma.embassy.findUnique({ where: { id } });
  }

  static async create(data: CreateEmbassyData) {
    return prisma.embassy.create({
      data: {
        country: data.country,
        name: data.name,
        location: data.location,
        link: data.link,
        email: data.email,
        phone: data.phone,
      },
    });
  }

  static async update(id: number, data: Partial<CreateEmbassyData>) {
    try {
      return await prisma.embassy.update({
        where: { id },
        data: {
          country: data.country,
          name: data.name,
          location: data.location,
          link: data.link,
          email: data.email,
          phone: data.phone,
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.embassy.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
