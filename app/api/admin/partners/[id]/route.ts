import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { PartnerModel } from "@/src/models/Partner";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const pid = parseInt(id);
    if (isNaN(pid)) return corsJson({ error: "Invalid id" }, { status: 400 });
    const b = await request.json();
    const item = await PartnerModel.update(pid, {
      name: b.name, category: b.category, url: b.url,
      logoUrl: b.logo_url ?? b.logoUrl, description: b.description, isActive: b.is_active ?? b.isActive,
    });
    if (!item) return corsJson({ error: "Not found" }, { status: 404 });
    return corsJson({ success: true, data: item });
  } catch (error) {
    console.error("Update partner error:", error);
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
    const deleted = await PartnerModel.delete(pid);
    if (!deleted) return corsJson({ error: "Not found" }, { status: 404 });
    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete partner error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
