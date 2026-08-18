import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { CategoryModel } from "@/src/models/Category";
import { parseServicePayload, VALID_DELIVERY_MODES } from "@/lib/service-payload";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const categoryId = new URL(request.url).searchParams.get("categoryId") || undefined;
    const items = await CategoryModel.findAllServicesForAdmin(categoryId);
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("Admin list services error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const b = await request.json();
    if (!b?.name || !b?.categoryId) {
      return corsJson({ error: "name and categoryId are required" }, { status: 400 });
    }
    const data = parseServicePayload(b);
    if (data.deliveryMode !== undefined && !VALID_DELIVERY_MODES.includes(data.deliveryMode)) {
      return corsJson(
        { error: `deliveryMode must be one of: ${VALID_DELIVERY_MODES.join(", ")}` },
        { status: 400 }
      );
    }

    const category = await CategoryModel.findById(b.categoryId);
    if (!category) return corsJson({ error: "Unknown categoryId" }, { status: 400 });

    const item = await CategoryModel.createService({ ...data, name: b.name, categoryId: b.categoryId });
    return corsJson({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return corsJson({ error: "Ce service existe déjà dans cette catégorie" }, { status: 409 });
    }
    console.error("Create service error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
