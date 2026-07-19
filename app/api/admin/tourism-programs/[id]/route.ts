import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TourismProgramModel } from "@/src/models/TourismProgram";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const pid = parseInt(id);
    if (isNaN(pid)) return corsJson({ error: "Invalid id" }, { status: 400 });
    const b = await request.json();
    const item = await TourismProgramModel.update(pid, {
      title: b.title, subcategory: b.subcategory, country: b.country, city: b.city,
      description: b.description, itinerary: b.itinerary, transport: b.transport,
      price: b.price != null ? Number(b.price) : undefined, currency: b.currency,
      images: b.images, isValidated: b.isValidated,
    });
    if (!item) return corsJson({ error: "Not found" }, { status: 404 });
    return corsJson({ success: true, data: item });
  } catch (error) {
    console.error("Update tourism program error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const pid = parseInt(id);
    if (isNaN(pid)) return corsJson({ error: "Invalid id" }, { status: 400 });
    const deleted = await TourismProgramModel.delete(pid);
    if (!deleted) return corsJson({ error: "Not found" }, { status: 404 });
    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete tourism program error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
