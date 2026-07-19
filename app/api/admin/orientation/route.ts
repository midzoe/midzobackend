import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { OrientationResourceModel } from "@/src/models/OrientationResource";

const VALID_TYPES = ["guide", "book", "company", "certification"];

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const items = await OrientationResourceModel.findAll();
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("Admin list orientation error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const b = await request.json();
    if (!b?.title || !b?.type) return corsJson({ error: "title and type are required" }, { status: 400 });
    if (!VALID_TYPES.includes(b.type)) {
      return corsJson({ error: `type must be one of: ${VALID_TYPES.join(", ")}` }, { status: 400 });
    }

    const item = await OrientationResourceModel.create({
      title: b.title,
      type: b.type,
      category: b.category,
      description: b.description,
      provider: b.provider,
      link: b.link,
      location: b.location,
      imageUrl: b.image_url ?? b.imageUrl,
      isValidated: b.is_validated ?? b.isValidated,
      order: b.order != null ? Number(b.order) : undefined,
    });
    return corsJson({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Create orientation error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
