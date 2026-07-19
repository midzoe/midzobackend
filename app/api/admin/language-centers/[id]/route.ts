import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { LanguageCenterModel } from "@/src/models/LanguageCenter";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const centerId = parseInt(id);
    if (isNaN(centerId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const body = await request.json();
    const { name, country, city, language, levels, link, isPartner } = body;

    const center = await LanguageCenterModel.update(centerId, {
      name,
      country,
      city,
      language,
      levels,
      link,
      isPartner,
    });

    if (!center) return corsJson({ error: "Language center not found" }, { status: 404 });

    return corsJson({ success: true, center });
  } catch (error) {
    console.error("Update language center error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const centerId = parseInt(id);
    if (isNaN(centerId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const deleted = await LanguageCenterModel.delete(centerId);
    if (!deleted) return corsJson({ error: "Language center not found" }, { status: 404 });

    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete language center error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
