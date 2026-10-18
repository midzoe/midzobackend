import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { informClient, parseId, requireAdmin, TRIP_INCLUDE, withReadiness } from "@/lib/admin-guard";

/** Voyages et projets d'un client (vue conseiller). */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const userId = parseId((await params).id);
    if (!userId) return corsJson({ error: "Invalid user id" }, { status: 400 });

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
      include: TRIP_INCLUDE,
    });
    return corsJson({ success: true, data: trips.map(withReadiness) });
  } catch (error) {
    console.error("Admin user trips error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Le conseiller crée un voyage pour le client : titre, dates, étapes (pays / ville / dates)
 * et services à préparer. Le client le retrouve dans son espace et en est prévenu.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const userId = parseId((await params).id);
    if (!userId) return corsJson({ error: "Invalid user id" }, { status: 400 });
    const client = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!client) return corsJson({ error: "User not found" }, { status: 404 });

    const b = await request.json().catch(() => ({}));
    const title = typeof b?.title === "string" ? b.title.trim() : "";
    if (!title) return corsJson({ error: "title is required" }, { status: 400 });
    const start = b.startDate ?? b.start_date;
    const end = b.endDate ?? b.end_date;
    if (start && end && new Date(end).getTime() < new Date(start).getTime()) {
      return corsJson({ error: "endDate must be on or after startDate" }, { status: 400 });
    }
    const destinations = Array.isArray(b.destinations) ? b.destinations.filter((d: any) => d?.country) : [];
    const services = Array.isArray(b.services) ? b.services.filter((s: any) => s?.type && s?.label) : [];

    const trip = await prisma.trip.create({
      data: {
        userId,
        title,
        status: b.status ?? "upcoming",
        startDate: start ? new Date(start) : undefined,
        endDate: end ? new Date(end) : undefined,
        createdByAdminId: Number(guard.auth.userId),
        destinations: destinations.length
          ? {
              create: destinations.map((d: any, i: number) => ({
                country: String(d.country),
                city: d.city ? String(d.city) : undefined,
                arrivalDate: d.arrivalDate ? new Date(d.arrivalDate) : undefined,
                departureDate: d.departureDate ? new Date(d.departureDate) : undefined,
                order: i,
              })),
            }
          : undefined,
        services: services.length
          ? { create: services.map((s: any) => ({ type: String(s.type), label: String(s.label), status: s.status ?? "pending", note: s.note ?? undefined })) }
          : undefined,
      },
      include: TRIP_INCLUDE,
    });

    await logAdminAction(guard.auth.userId, "trip.create", { type: "trip", id: trip.id, userId, details: { title } });
    await informClient(userId, "Nouveau voyage préparé par votre conseiller", `Votre conseiller a préparé le voyage « ${title} » dans votre espace : étapes, dates et services à suivre.`, { trip_id: trip.id });
    return corsJson({ success: true, data: withReadiness(trip) }, { status: 201 });
  } catch (error) {
    console.error("Admin create trip error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
