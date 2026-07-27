import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";

const SORTS: Record<string, any> = {
  recent: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
  username: { username: "asc" },
  email: { email: "asc" },
};

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
    const skip = (page - 1) * limit;
    // Story 9.3 : segment premium + recherche.
    const segment = searchParams.get("segment");
    const search = (searchParams.get("search") ?? "").trim();
    // Filtres de tri/affinage de la vue Utilisateurs.
    const role = searchParams.get("role") ?? "";
    const verified = searchParams.get("verified") ?? ""; // "1" | "0" | ""
    const sort = SORTS[searchParams.get("sort") ?? "recent"] ?? SORTS.recent;

    const where: any = {
      ...(segment === "premium" ? { isPremium: true } : {}),
      ...(role ? { role } : {}),
      ...(verified ? { emailVerified: verified === "1" } : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { username: { contains: search, mode: "insensitive" } },
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    // Fenêtre « nouveaux inscrits » des 30 derniers jours (KPI global, hors filtres).
    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [users, total, statTotal, statPremium, statAdmins, statVerified, statNew30d, statNewsletter] =
      await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            isPremium: true,
            premiumSince: true,
            emailVerified: true,
            nationality: true,
            countryOfResidence: true,
            newsletterStudy: true,
            newsletterTourism: true,
            createdAt: true,
            updatedAt: true,
            languages: { select: { language: true, level: true } },
            premiumCase: { select: { status: true, assignedTo: true, updatedAt: true } },
            // Activité : ce que le compte a réellement fait sur la plateforme.
            _count: { select: { trips: true, bookings: true, purchases: true, notifications: true } },
            purchases: {
              where: { status: "paid" },
              select: { amountCents: true, currency: true, paidAt: true },
              orderBy: { paidAt: "desc" },
            },
          },
          orderBy: sort,
          skip,
          take: limit,
        }),
        prisma.user.count({ where }),
        prisma.user.count(),
        prisma.user.count({ where: { isPremium: true } }),
        prisma.user.count({ where: { role: { in: ["admin", "superadmin"] } } }),
        prisma.user.count({ where: { emailVerified: true } }),
        prisma.user.count({ where: { createdAt: { gte: since30d } } }),
        prisma.user.count({ where: { OR: [{ newsletterStudy: true }, { newsletterTourism: true }] } }),
      ]);

    // On agrège le CA par utilisateur côté serveur : la table n'a pas à faire ce calcul.
    const shaped = users.map(({ purchases, ...u }) => ({
      ...u,
      spentCents: purchases.reduce((sum, p) => sum + p.amountCents, 0),
      currency: purchases[0]?.currency ?? "EUR",
      lastPurchaseAt: purchases[0]?.paidAt ?? null,
    }));

    return corsJson({
      success: true,
      users: shaped,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      stats: {
        total: statTotal,
        premium: statPremium,
        admins: statAdmins,
        verified: statVerified,
        new30d: statNew30d,
        newsletter: statNewsletter,
      },
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
