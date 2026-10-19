import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { serializeCircuits } from "@/lib/circuits";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const row = await prisma.tourCircuit.findUnique({ where: { slug } });
    if (!row || !row.isPublished) return corsJson({ error: "Not found" }, { status: 404 });
    const [data] = await serializeCircuits([row]);
    return corsJson({ success: true, data });
  } catch (error) {
    console.error("Circuit error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
