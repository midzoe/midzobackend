import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { CategoryModel } from "@/src/models/Category";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const b = await request.json();
    const item = await CategoryModel.updateCategory(id, {
      name: b.name,
      description: b.description,
      icon: b.icon,
      isPublic: b.isPublic ?? b.is_public,
      order: b.order === "" || b.order === undefined ? undefined : Number(b.order),
    });
    if (!item) return corsJson({ error: "Not found" }, { status: 404 });
    return corsJson({ success: true, data: item });
  } catch (error) {
    console.error("Update category error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const result = await CategoryModel.deleteCategory(id);
    if (result === "not_found") return corsJson({ error: "Not found" }, { status: 404 });
    if (result === "has_services") {
      return corsJson(
        { error: "Cette catégorie contient encore des services. Supprimez-les d'abord." },
        { status: 409 }
      );
    }
    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
