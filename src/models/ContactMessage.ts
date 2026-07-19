import prisma from "../../lib/prisma";

export interface CreateContactMessageData {
  name: string;
  email: string;
  subject?: string;
  category?: string;
  subcategory?: string;
  message: string;
  userId?: number;
  isPremium?: boolean;
}

export class ContactMessageModel {
  static async create(data: CreateContactMessageData) {
    return prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        category: data.category,
        subcategory: data.subcategory,
        message: data.message,
        userId: data.userId,
        isPremium: data.isPremium ?? false,
      },
    });
  }

  static async findAll(opts?: { status?: string; category?: string }) {
    return prisma.contactMessage.findMany({
      where: {
        ...(opts?.status ? { status: opts.status } : {}),
        ...(opts?.category ? { category: opts.category } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(id: number) {
    return prisma.contactMessage.findUnique({ where: { id } });
  }

  static async setStatus(id: number, status: string) {
    try {
      return await prisma.contactMessage.update({ where: { id }, data: { status } });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.contactMessage.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }

  /**
   * Insights admin (story 8.3, FR30) : volume total, répartition par catégorie,
   * top domaines email, séparation client (compte) vs premium vs visiteur.
   */
  static async insights() {
    const [total, byCategoryRaw, all] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.groupBy({ by: ["category"], _count: { _all: true } }),
      prisma.contactMessage.findMany({ select: { email: true, userId: true, isPremium: true } }),
    ]);

    const byCategory = byCategoryRaw
      .map((r) => ({ category: r.category ?? "autre", count: r._count._all }))
      .sort((a, b) => b.count - a.count);

    // Top domaines email (partie après @).
    const domainCounts: Record<string, number> = {};
    for (const m of all) {
      const domain = m.email.split("@")[1]?.toLowerCase();
      if (domain) domainCounts[domain] = (domainCounts[domain] ?? 0) + 1;
    }
    const topDomains = Object.entries(domainCounts)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const premium = all.filter((m) => m.isPremium).length;
    const registered = all.filter((m) => m.userId != null && !m.isPremium).length;
    const visitors = all.filter((m) => m.userId == null).length;

    return {
      total,
      byCategory,
      topDomains,
      audience: { premium, registered, visitors },
    };
  }
}
