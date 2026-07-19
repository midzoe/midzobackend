import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { UniversityModel } from "@/src/models/University";

// Story 5.1 : mise à jour / suppression d'une université (admin uniquement).
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const universityId = parseInt(id);
    if (isNaN(universityId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const body = await request.json();
    const data = await UniversityModel.update(universityId, {
      name: body.name,
      city: body.city,
      country: body.country,
      website: body.website,
      applicationUrl: body.applicationUrl,
      specialty: body.specialty,
      requiredLanguage: body.requiredLanguage,
      requiredLanguageLevel: body.requiredLanguageLevel,
    });

    if (!data) return corsJson({ error: "University not found" }, { status: 404 });
    return corsJson({ success: true, data });
  } catch (error: any) {
    if (error instanceof Error && error.message.includes("already exists")) {
      return corsJson({ error: error.message }, { status: 409 });
    }
    console.error("Update university error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const universityId = parseInt(id);
    if (isNaN(universityId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const deleted = await UniversityModel.delete(universityId);
    if (!deleted) return corsJson({ error: "University not found" }, { status: 404 });

    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete university error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
