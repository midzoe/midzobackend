import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";

// Story 9.2 (FR37) : valide (ou dé-valide) un brouillon → bascule isValidated.
// Un seul endpoint pour toutes les entités gatées ; consommé par l'UI 9.7.
const ENTITIES: Record<string, (id: number, v: boolean) => Promise<unknown>> = {
  "study-country": (id, v) => prisma.studyCountry.update({ where: { id }, data: { isValidated: v } }),
  "tourism-country": (id, v) => prisma.tourismCountry.update({ where: { id }, data: { isValidated: v } }),
  "tourism-program": (id, v) => prisma.tourismProgram.update({ where: { id }, data: { isValidated: v } }),
  country: (id, v) => prisma.country.update({ where: { id }, data: { isValidated: v } }),
};

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const b = await request.json();
    const entity = b?.entity;
    const id = Number(b?.id);
    const isValidated = b?.isValidated === undefined ? true : Boolean(b.isValidated);

    if (!entity || !ENTITIES[entity]) {
      return corsJson({ error: `entity must be one of ${Object.keys(ENTITIES).join(", ")}` }, { status: 400 });
    }
    if (!Number.isInteger(id)) {
      return corsJson({ error: "valid id is required" }, { status: 400 });
    }

    try {
      const updated = await ENTITIES[entity](id, isValidated);
      return corsJson({ success: true, data: updated });
    } catch (e: any) {
      if (e.code === "P2025") return corsJson({ error: "Not found" }, { status: 404 });
      throw e;
    }
  } catch (error) {
    console.error("Validate error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
