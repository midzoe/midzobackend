import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { parseId, requireAdmin } from "@/lib/admin-guard";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const id = parseId((await params).itemId);
    if (!id) return corsJson({ error: "Invalid id" }, { status: 400 });
    const item = await prisma.tripChecklistItem.findUnique({ where: { id }, include: { trip: { select: { userId: true } } } });
    if (!item) return corsJson({ error: "Item not found" }, { status: 404 });
    const b = await request.json().catch(() => ({}));
    const updated = await prisma.tripChecklistItem.update({
      where: { id },
      data: {
        isDone: typeof b.isDone === "boolean" ? b.isDone : undefined,
        label: typeof b.label === "string" && b.label.trim() ? b.label.trim() : undefined,
      },
    });
    await logAdminAction(guard.auth.userId, "trip.checklist.update", { type: "trip_checklist", id, userId: item.trip.userId, details: b });
    return corsJson({ success: true, data: updated });
  } catch (error) {
    console.error("Admin update checklist error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const id = parseId((await params).itemId);
    if (!id) return corsJson({ error: "Invalid id" }, { status: 400 });
    const item = await prisma.tripChecklistItem.findUnique({ where: { id }, include: { trip: { select: { userId: true } } } });
    if (!item) return corsJson({ error: "Item not found" }, { status: 404 });
    await prisma.tripChecklistItem.delete({ where: { id } });
    await logAdminAction(guard.auth.userId, "trip.checklist.delete", { type: "trip_checklist", id, userId: item.trip.userId, details: { label: item.label } });
    return corsJson({ success: true });
  } catch (error) {
    console.error("Admin delete checklist error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
