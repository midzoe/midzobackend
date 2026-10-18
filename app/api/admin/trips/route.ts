import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { requireAdmin, TRIP_INCLUDE, withReadiness } from "@/lib/admin-guard";

/**
 * « Dossiers clients » : tous les voyages et projets, avec le client, filtrables.
 * ?search= (titre, client, email, pays) · ?status= · ?upcoming=1 (départ à venir)
 */
export async function GET(request: NextRequest) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const sp = new URL(request.url).searchParams;
    const search = (sp.get("search") ?? "").trim();
    const status = sp.get("status") ?? "";
    const page = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") ?? "30")));

    const where: any = {
      ...(status ? { status } : {}),
      ...(sp.get("upcoming") === "1" ? { startDate: { gte: new Date() } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { destinations: { some: { OR: [{ country: { contains: search, mode: "insensitive" } }, { city: { contains: search, mode: "insensitive" } }] } } },
              { user: { OR: [
                { email: { contains: search, mode: "insensitive" } },
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
              ] } },
            ],
          }
        : {}),
    };

    const [trips, total] = await prisma.$transaction([
      prisma.trip.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
        include: { ...TRIP_INCLUDE, user: { select: { id: true, email: true, firstName: true, lastName: true, isPremium: true } } },
      }),
      prisma.trip.count({ where }),
    ]);
    return corsJson({ success: true, data: trips.map(withReadiness), total, page, limit });
  } catch (error) {
    console.error("Admin trips list error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
