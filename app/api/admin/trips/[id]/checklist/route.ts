import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { parseId, requireAdmin } from "@/lib/admin-guard";

/** Ajouter un élément à la checklist de départ du client (passeport, vaccins, assurance…). */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const tripId = parseId((await params).id);
    if (!tripId) return corsJson({ error: "Invalid id" }, { status: 400 });
    const trip = await prisma.trip.findUnique({ where: { id: tripId }, select: { userId: true } });
    if (!trip) return corsJson({ error: "Trip not found" }, { status: 404 });
    const b = await request.json().catch(() => ({}));
    const label = typeof b?.label === "string" ? b.label.trim() : "";
    if (!label) return corsJson({ error: "label is required" }, { status: 400 });
    const count = await prisma.tripChecklistItem.count({ where: { tripId } });
    const item = await prisma.tripChecklistItem.create({ data: { tripId, label, category: b.category ?? null, order: count } });
    await logAdminAction(guard.auth.userId, "trip.checklist.add", { type: "trip_checklist", id: item.id, userId: trip.userId, details: { label } });
    return corsJson({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Admin add checklist error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
