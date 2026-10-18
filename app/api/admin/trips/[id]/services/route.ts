import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { informClient, parseId, requireAdmin } from "@/lib/admin-guard";

/** Ajouter un service à préparer au voyage d'un client (visa, logement, vol…). */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const tripId = parseId((await params).id);
    if (!tripId) return corsJson({ error: "Invalid id" }, { status: 400 });
    const trip = await prisma.trip.findUnique({ where: { id: tripId }, select: { userId: true, title: true } });
    if (!trip) return corsJson({ error: "Trip not found" }, { status: 404 });

    const b = await request.json().catch(() => ({}));
    const label = typeof b?.label === "string" ? b.label.trim() : "";
    if (!label || !b?.type) return corsJson({ error: "type and label are required" }, { status: 400 });

    const service = await prisma.tripService.create({
      data: {
        tripId,
        type: String(b.type),
        label,
        status: b.status ?? "pending",
        note: typeof b.note === "string" && b.note.trim() ? b.note.trim() : null,
        documentUrl: typeof b.documentUrl === "string" && b.documentUrl.trim() ? b.documentUrl.trim() : null,
      },
    });
    await logAdminAction(guard.auth.userId, "trip.service.add", { type: "trip_service", id: service.id, userId: trip.userId, details: { tripId, label } });
    await informClient(trip.userId, "Nouveau service ajouté à votre voyage", `Votre conseiller a ajouté « ${label} » au voyage « ${trip.title} ».`, { trip_id: tripId });
    return corsJson({ success: true, data: service }, { status: 201 });
  } catch (error) {
    console.error("Admin add trip service error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
