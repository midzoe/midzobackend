import prisma from "../../lib/prisma";

export interface CreateNewsData {
  title: string;
  body?: string;
  category?: string;
  imageUrl?: string;
  publishedAt?: Date;
  translations?: Record<string, { title?: string; body?: string }>;
}

export class NewsModel {
  static async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.news.findMany({
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.news.count(),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async findById(id: number) {
    return prisma.news.findUnique({ where: { id } });
  }

  static async create(data: CreateNewsData) {
    return prisma.news.create({
      data: {
        title: data.title,
        body: data.body,
        category: data.category,
        imageUrl: data.imageUrl,
        publishedAt: data.publishedAt ?? new Date(),
        translations: data.translations as any,
      },
    });
  }

  static async update(id: number, data: Partial<CreateNewsData>) {
    try {
      return await prisma.news.update({
        where: { id },
        data: {
          title: data.title,
          body: data.body,
          category: data.category,
          imageUrl: data.imageUrl,
          publishedAt: data.publishedAt,
          translations: data.translations as any,
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.news.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
