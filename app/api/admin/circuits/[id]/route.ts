import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { parseId, requireAdmin } from "@/lib/admin-guard";
import { logAdminAction } from "@/lib/audit";
import { circuitInput, serializeCircuits } from "@/lib/circuits";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const id = parseId((await params).id);
    if (!id) return corsJson({ error: "Invalid id" }, { status: 400 });
    const input = circuitInput(await request.json().catch(() => ({})));
    if (input.stops && !input.stops.length) return corsJson({ error: "at least one stop is required" }, { status: 400 });
    const row = await prisma.tourCircuit.update({
      where: { id },
      data: {
        slug: input.slug, title: input.title, summary: input.summary, description: input.description, image: input.image,
        stops: input.stops as any, durationDays: input.durationDays, services: input.services, highlights: input.highlights,
        bestTime: input.bestTime, travelersBase: input.travelersBase, isPublished: input.isPublished, order: input.order,
      },
    });
    await logAdminAction(guard.auth.userId, "circuit.update", { type: "circuit", id, details: { slug: row.slug, published: row.isPublished } });
    const [data] = await serializeCircuits([row]);
    return corsJson({ success: true, data });
  } catch (error: any) {
    if (error?.code === "P2025") return corsJson({ error: "Not found" }, { status: 404 });
    if (error?.code === "P2002") return corsJson({ error: "slug already exists" }, { status: 409 });
    console.error("Admin update circuit error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const id = parseId((await params).id);
    if (!id) return corsJson({ error: "Invalid id" }, { status: 400 });
    await prisma.tourCircuit.delete({ where: { id } });
    await logAdminAction(guard.auth.userId, "circuit.delete", { type: "circuit", id });
    return corsJson({ success: true });
  } catch (error: any) {
    if (error?.code === "P2025") return corsJson({ error: "Not found" }, { status: 404 });
    console.error("Admin delete circuit error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
