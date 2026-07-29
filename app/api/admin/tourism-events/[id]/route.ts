import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TourismEventModel } from "@/src/models/TourismEvent";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const eid = parseInt(id);
    if (isNaN(eid)) return corsJson({ error: "Invalid id" }, { status: 400 });
    const body = await request.json();
    // Mise à jour partielle : le titre peut être omis, jamais vidé.
    if (body.title !== undefined && !String(body.title).trim()) {
      return corsJson({ error: "title cannot be empty" }, { status: 400 });
    }

    const item = await TourismEventModel.update(eid, body);
    if (!item) return corsJson({ error: "Not found" }, { status: 404 });
    return corsJson({ success: true, data: item });
  } catch (error) {
    console.error("Update tourism event error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const eid = parseInt(id);
    if (isNaN(eid)) return corsJson({ error: "Invalid id" }, { status: 400 });
    const deleted = await TourismEventModel.delete(eid);
    if (!deleted) return corsJson({ error: "Not found" }, { status: 404 });
    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete tourism event error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
