import prisma from "../../lib/prisma";

export interface CreateBlogData {
  title: string;
  slug?: string;
  body?: string;
  excerpt?: string;
  category?: string;
  author?: string;
  imageUrl?: string;
  publishedAt?: Date;
  isPublished?: boolean;
  translations?: Record<string, unknown>;
}

function formatBlog(b: any) {
  return {
    id: b.id,
    title: b.title,
    slug: b.slug ?? null,
    body: b.body ?? null,
    excerpt: b.excerpt ?? null,
    category: b.category ?? null,
    author: b.author ?? null,
    image: b.imageUrl ?? null,
    published_at: b.publishedAt,
    is_published: b.isPublished,
    translations: b.translations ?? null,
    created_at: b.createdAt,
    updated_at: b.updatedAt,
  };
}

export class BlogModel {
  static async findAll(page = 1, limit = 20, onlyPublished = false) {
    const skip = (page - 1) * limit;
    const where = onlyPublished ? { isPublished: true } : {};
    const [items, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ]);
    return { items: items.map(formatBlog), total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async findById(id: number) {
    const b = await prisma.blog.findUnique({ where: { id } });
    return b ? formatBlog(b) : null;
  }

  static async findBySlug(slug: string) {
    const b = await prisma.blog.findUnique({ where: { slug } });
    return b ? formatBlog(b) : null;
  }

  static async create(data: CreateBlogData) {
    const b = await prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        body: data.body,
        excerpt: data.excerpt,
        category: data.category,
        author: data.author,
        imageUrl: data.imageUrl,
        publishedAt: data.publishedAt ?? new Date(),
        isPublished: data.isPublished ?? false,
        translations: data.translations as any,
      },
    });
    return formatBlog(b);
  }

  static async update(id: number, data: Partial<CreateBlogData>) {
    try {
      const b = await prisma.blog.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          body: data.body,
          excerpt: data.excerpt,
          category: data.category,
          author: data.author,
          imageUrl: data.imageUrl,
          publishedAt: data.publishedAt,
          isPublished: data.isPublished,
          translations: data.translations as any,
        },
      });
      return formatBlog(b);
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
