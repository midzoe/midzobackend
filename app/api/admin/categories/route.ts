import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { CategoryModel } from "@/src/models/Category";

// Identifiant de catégorie : slug utilisé tel quel dans les URL (#study) et les
// clés i18n — on interdit donc tout ce qui n'est pas [a-z0-9-].
const ID_PATTERN = /^[a-z0-9-]+$/;

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const items = await CategoryModel.findAllForAdmin();
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("Admin list categories error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const b = await request.json();
    const id = typeof b?.id === "string" ? b.id.trim() : "";
    if (!id || !b?.name) return corsJson({ error: "id and name are required" }, { status: 400 });
    if (!ID_PATTERN.test(id)) {
      return corsJson({ error: "id must match [a-z0-9-]" }, { status: 400 });
    }

    const item = await CategoryModel.createCategory({
      id,
      name: b.name,
      description: b.description,
      icon: b.icon,
      isPublic: b.isPublic ?? b.is_public,
      order: b.order === "" || b.order === undefined ? undefined : Number(b.order),
    });
    return corsJson({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return corsJson({ error: "A category with this id already exists" }, { status: 409 });
    }
    console.error("Create category error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
