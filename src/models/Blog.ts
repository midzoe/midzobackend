import prisma from "../../lib/prisma";

export interface CreateBlogData {
  title: string;
  body?: string;
  category?: string;
  imageUrl?: string;
  publishedAt?: Date;
  translations?: Record<string, { title?: string; body?: string }>;
}

export class BlogModel {
  static async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.blog.findMany({
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blog.count(),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async findById(id: number) {
    return prisma.blog.findUnique({ where: { id } });
  }

  static async create(data: CreateBlogData) {
    return prisma.blog.create({
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

  static async update(id: number, data: Partial<CreateBlogData>) {
    try {
      return await prisma.blog.update({
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
      await prisma.blog.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
