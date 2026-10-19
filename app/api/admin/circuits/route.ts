import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { logAdminAction } from "@/lib/audit";
import { circuitInput, serializeCircuits } from "@/lib/circuits";

export async function GET(request: NextRequest) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const rows = await prisma.tourCircuit.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
    return corsJson({ success: true, data: await serializeCircuits(rows) });
  } catch (error) {
    console.error("Admin circuits error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const input = circuitInput(await request.json().catch(() => ({})));
    if (!input.slug || !input.title || !input.stops?.length || !input.durationDays || input.durationDays < 1) {
      return corsJson({ error: "slug, title, stops and duration_days are required" }, { status: 400 });
    }
    const exists = await prisma.tourCircuit.findUnique({ where: { slug: input.slug } });
    if (exists) return corsJson({ error: "slug already exists" }, { status: 409 });
    const row = await prisma.tourCircuit.create({
      data: {
        slug: input.slug, title: input.title, summary: input.summary, description: input.description, image: input.image ?? null,
        stops: input.stops as any, durationDays: input.durationDays, services: input.services ?? [], highlights: input.highlights ?? [],
        bestTime: input.bestTime, travelersBase: input.travelersBase ?? 2, isPublished: input.isPublished ?? false, order: input.order ?? 0,
      },
    });
    await logAdminAction(guard.auth.userId, "circuit.create", { type: "circuit", id: row.id, details: { slug: row.slug } });
    const [data] = await serializeCircuits([row]);
    return corsJson({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Admin create circuit error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
