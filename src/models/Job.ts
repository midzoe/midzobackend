import prisma from "../../lib/prisma";

export interface CreateJobData {
  title: string;
  company: string;
  country: string;
  city?: string;
  location: string;
  type: string;
  salary?: string;
  experience?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  applyUrl?: string;
  image?: string;
  postedAt?: Date | string;
  isActive?: boolean;
}

export class JobModel {
  static async findAll(
    filters: { country?: string; type?: string; experience?: string; search?: string } = {}
  ) {
    return prisma.job.findMany({
      where: {
        isActive: true,
        country: filters.country ? { equals: filters.country, mode: "insensitive" } : undefined,
        type: filters.type ? { equals: filters.type, mode: "insensitive" } : undefined,
        experience: filters.experience
          ? { equals: filters.experience, mode: "insensitive" }
          : undefined,
        OR: filters.search
          ? [
              { title: { contains: filters.search, mode: "insensitive" } },
              { company: { contains: filters.search, mode: "insensitive" } },
            ]
          : undefined,
      },
      // Les offres les plus fraîches en tête ; celles sans date passent après.
      orderBy: [{ postedAt: { sort: "desc", nulls: "last" } }, { title: "asc" }],
    });
  }

  static async findAllAdmin() {
    return prisma.job.findMany({
      orderBy: [{ postedAt: { sort: "desc", nulls: "last" } }, { title: "asc" }],
    });
  }

  static async findById(id: number) {
    return prisma.job.findUnique({ where: { id } });
  }

  static async create(data: CreateJobData) {
    return prisma.job.create({
      data: {
        title: data.title,
        company: data.company,
        country: data.country,
        city: data.city,
        location: data.location,
        type: data.type,
        salary: data.salary,
        experience: data.experience,
        description: data.description,
        requirements: data.requirements as any,
        benefits: data.benefits as any,
        applyUrl: data.applyUrl,
        image: data.image,
        postedAt: data.postedAt ? new Date(data.postedAt) : new Date(),
        isActive: data.isActive ?? true,
      },
    });
  }

  static async update(id: number, data: Partial<CreateJobData>) {
    try {
      return await prisma.job.update({
        where: { id },
        data: {
          title: data.title,
          company: data.company,
          country: data.country,
          city: data.city,
          location: data.location,
          type: data.type,
          salary: data.salary,
          experience: data.experience,
          description: data.description,
          requirements: data.requirements as any,
          benefits: data.benefits as any,
          applyUrl: data.applyUrl,
          image: data.image,
          postedAt: data.postedAt ? new Date(data.postedAt) : undefined,
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
      await prisma.job.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
