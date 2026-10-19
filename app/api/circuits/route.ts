import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { serializeCircuits } from "@/lib/circuits";

/** Circuits types publiés (?country= filtre sur une étape). */
export async function GET(request: NextRequest) {
  try {
    const country = new URL(request.url).searchParams.get("country");
    const rows = await prisma.tourCircuit.findMany({ where: { isPublished: true }, orderBy: [{ order: "asc" }, { id: "asc" }] });
    const data = await serializeCircuits(rows);
    return corsJson({ success: true, data: country ? data.filter((c) => c.stops.some((s) => s.country === country)) : data });
  } catch (error) {
    console.error("Circuits error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
