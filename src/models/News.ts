import prisma from "../../lib/prisma";

export interface CreateNewsData {
  title: string;
  titleFr?: string;
  body?: string;
  description?: string;
  descriptionFr?: string;
  category?: string;
  imageUrl?: string;
  link?: string;
  publishedAt?: Date;
  isPublished?: boolean;
  translations?: Record<string, unknown>;
}

function formatNews(n: any) {
  return {
    id: n.id,
    title: n.title,
    title_fr: n.titleFr ?? null,
    body: n.body ?? null,
    description: n.description ?? null,
    description_fr: n.descriptionFr ?? null,
    category: n.category ?? null,
    image: n.imageUrl ?? null,
    link: n.link ?? null,
    published_at: n.publishedAt,
    is_published: n.isPublished,
    translations: n.translations ?? null,
    created_at: n.createdAt,
    updated_at: n.updatedAt,
  };
}

export class NewsModel {
  static async findAll(page = 1, limit = 20, onlyPublished = false) {
    const skip = (page - 1) * limit;
    const where = onlyPublished ? { isPublished: true } : {};
    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);
    return { items: items.map(formatNews), total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async findById(id: number) {
    const n = await prisma.news.findUnique({ where: { id } });
    return n ? formatNews(n) : null;
  }

  static async create(data: CreateNewsData) {
    const n = await prisma.news.create({
      data: {
        title: data.title,
        titleFr: data.titleFr,
        body: data.body,
        description: data.description,
        descriptionFr: data.descriptionFr,
        category: data.category,
        imageUrl: data.imageUrl,
        link: data.link,
        publishedAt: data.publishedAt ?? new Date(),
        isPublished: data.isPublished ?? false,
        translations: data.translations as any,
      },
    });
    return formatNews(n);
  }

  static async update(id: number, data: Partial<CreateNewsData>) {
    try {
      const n = await prisma.news.update({
        where: { id },
        data: {
          title: data.title,
          titleFr: data.titleFr,
          body: data.body,
          description: data.description,
          descriptionFr: data.descriptionFr,
          category: data.category,
          imageUrl: data.imageUrl,
          link: data.link,
          publishedAt: data.publishedAt,
          isPublished: data.isPublished,
          translations: data.translations as any,
        },
      });
      return formatNews(n);
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
