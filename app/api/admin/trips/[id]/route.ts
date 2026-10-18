import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { informClient, parseId, requireAdmin, TRIP_INCLUDE, withReadiness } from "@/lib/admin-guard";

const STATUSES = ["planning", "upcoming", "ongoing", "completed"];

/** Modifier le voyage d'un client : titre, statut, dates, étapes (remplacées en bloc si fournies). */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const id = parseId((await params).id);
    if (!id) return corsJson({ error: "Invalid id" }, { status: 400 });
    const existing = await prisma.trip.findUnique({ where: { id } });
    if (!existing) return corsJson({ error: "Trip not found" }, { status: 404 });

    const b = await request.json().catch(() => ({}));
    if (b.status && !STATUSES.includes(b.status)) return corsJson({ error: `status must be ${STATUSES.join("|")}` }, { status: 400 });
    const start = b.startDate ?? b.start_date;
    const end = b.endDate ?? b.end_date;
    const startD = start ? new Date(start) : existing.startDate;
    const endD = end ? new Date(end) : existing.endDate;
    if (startD && endD && endD.getTime() < startD.getTime()) {
      return corsJson({ error: "endDate must be on or after startDate" }, { status: 400 });
    }

    const destinations = Array.isArray(b.destinations) ? b.destinations.filter((d: any) => d?.country) : null;
    const trip = await prisma.$transaction(async (tx) => {
      if (destinations) {
        await tx.tripDestination.deleteMany({ where: { tripId: id } });
        if (destinations.length) {
          await tx.tripDestination.createMany({
            data: destinations.map((d: any, i: number) => ({ tripId: id, country: String(d.country), city: d.city ? String(d.city) : null, order: i })),
          });
        }
      }
      return tx.trip.update({
        where: { id },
        data: {
          title: typeof b.title === "string" && b.title.trim() ? b.title.trim() : undefined,
          status: b.status,
          startDate: start ? new Date(start) : undefined,
          endDate: end ? new Date(end) : undefined,
        },
        include: TRIP_INCLUDE,
      });
    });

    await logAdminAction(guard.auth.userId, "trip.update", { type: "trip", id, userId: existing.userId, details: b });
    if (b.status && b.status !== existing.status) {
      const label = { planning: "en préparation", upcoming: "à venir", ongoing: "en cours", completed: "terminé" }[b.status as string];
      await informClient(existing.userId, "Votre voyage a été mis à jour", `Le voyage « ${trip.title} » est maintenant ${label}.`, { trip_id: id });
    }
    return corsJson({ success: true, data: withReadiness(trip) });
  } catch (error) {
    console.error("Admin update trip error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const id = parseId((await params).id);
    if (!id) return corsJson({ error: "Invalid id" }, { status: 400 });
    const existing = await prisma.trip.findUnique({ where: { id }, select: { userId: true, title: true } });
    if (!existing) return corsJson({ error: "Trip not found" }, { status: 404 });
    await prisma.trip.delete({ where: { id } });
    await logAdminAction(guard.auth.userId, "trip.delete", { type: "trip", id, userId: existing.userId, details: { title: existing.title } });
    return corsJson({ success: true });
  } catch (error) {
    console.error("Admin delete trip error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
