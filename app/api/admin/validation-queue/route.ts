import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";

// Story 9.2/9.7 (FR37) : file de validation = tous les brouillons (isValidated=false)
// des entités soumises au gate, quel que soit l'epic. Gardé isAdmin.
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const [studyCountries, tourismCountries, tourismPrograms, countries] = await Promise.all([
      prisma.studyCountry.findMany({ where: { isValidated: false }, orderBy: { updatedAt: "desc" } }),
      prisma.tourismCountry.findMany({ where: { isValidated: false }, orderBy: { updatedAt: "desc" } }),
      prisma.tourismProgram.findMany({ where: { isValidated: false }, orderBy: { updatedAt: "desc" } }),
      prisma.country.findMany({ where: { isValidated: false }, orderBy: { name: "asc" } }),
    ]);

    const items = [
      ...studyCountries.map((r) => ({ entity: "study-country", id: r.id, label: r.name, source: r.source ?? null })),
      ...tourismCountries.map((r) => ({ entity: "tourism-country", id: r.id, label: r.name, source: null })),
      ...tourismPrograms.map((r) => ({ entity: "tourism-program", id: r.id, label: r.title, source: null })),
      ...countries.map((r) => ({ entity: "country", id: r.id, label: r.name, source: null })),
    ];

    return corsJson({
      success: true,
      total: items.length,
      counts: {
        "study-country": studyCountries.length,
        "tourism-country": tourismCountries.length,
        "tourism-program": tourismPrograms.length,
        country: countries.length,
      },
      items,
    });
  } catch (error) {
    console.error("Validation queue error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
