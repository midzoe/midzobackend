import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { informClient, parseId, requireAdmin } from "@/lib/admin-guard";

const STATUSES = ["pending", "in_progress", "done", "cancelled"];
const STATUS_LABELS: Record<string, string> = { pending: "à faire", in_progress: "en cours", done: "terminé", cancelled: "annulé" };

/**
 * Le conseiller fait avancer un service du client : statut, commentaire visible par le client,
 * lien vers un document (lettre d'admission, attestation de logement, reçu…).
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const id = parseId((await params).serviceId);
    if (!id) return corsJson({ error: "Invalid id" }, { status: 400 });
    const svc = await prisma.tripService.findUnique({ where: { id }, include: { trip: { select: { userId: true, title: true } } } });
    if (!svc) return corsJson({ error: "Service not found" }, { status: 404 });

    const b = await request.json().catch(() => ({}));
    if (b.status && !STATUSES.includes(b.status)) return corsJson({ error: `status must be ${STATUSES.join("|")}` }, { status: 400 });
    if (b.documentUrl && !/^https?:\/\//i.test(String(b.documentUrl))) {
      return corsJson({ error: "documentUrl must be an http(s) link" }, { status: 400 });
    }

    const updated = await prisma.tripService.update({
      where: { id },
      data: {
        status: b.status,
        label: typeof b.label === "string" && b.label.trim() ? b.label.trim() : undefined,
        note: typeof b.note === "string" ? (b.note.trim() || null) : undefined,
        documentUrl: typeof b.documentUrl === "string" ? (b.documentUrl.trim() || null) : undefined,
      },
    });

    await logAdminAction(guard.auth.userId, "trip.service.update", { type: "trip_service", id, userId: svc.trip.userId, details: b });
    const changes: string[] = [];
    if (b.status && b.status !== svc.status) changes.push(`statut : ${STATUS_LABELS[b.status]}`);
    if (typeof b.note === "string" && b.note.trim() && b.note.trim() !== svc.note) changes.push(`message : « ${b.note.trim()} »`);
    if (typeof b.documentUrl === "string" && b.documentUrl.trim() && b.documentUrl.trim() !== svc.documentUrl) changes.push("un document est disponible");
    if (changes.length) {
      await informClient(svc.trip.userId, `${updated.label} — mise à jour`, `Voyage « ${svc.trip.title} », ${updated.label} : ${changes.join(" ; ")}.`, { trip_id: svc.tripId, service_id: id });
    }
    return corsJson({ success: true, data: updated });
  } catch (error) {
    console.error("Admin update trip service error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const id = parseId((await params).serviceId);
    if (!id) return corsJson({ error: "Invalid id" }, { status: 400 });
    const svc = await prisma.tripService.findUnique({ where: { id }, include: { trip: { select: { userId: true } } } });
    if (!svc) return corsJson({ error: "Service not found" }, { status: 404 });
    await prisma.tripService.delete({ where: { id } });
    await logAdminAction(guard.auth.userId, "trip.service.delete", { type: "trip_service", id, userId: svc.trip.userId, details: { label: svc.label } });
    return corsJson({ success: true });
  } catch (error) {
    console.error("Admin delete trip service error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
