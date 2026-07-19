import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { OrientationResourceModel } from "@/src/models/OrientationResource";

const VALID_TYPES = ["guide", "book", "company", "certification"];

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const b = await request.json();
    if (b?.type && !VALID_TYPES.includes(b.type)) {
      return corsJson({ error: `type must be one of: ${VALID_TYPES.join(", ")}` }, { status: 400 });
    }

    const updated = await OrientationResourceModel.update(Number(id), {
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
    if (!updated) return corsJson({ error: "Not found" }, { status: 404 });
    return corsJson({ success: true, data: updated });
  } catch (error) {
    console.error("Update orientation error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const ok = await OrientationResourceModel.delete(Number(id));
    if (!ok) return corsJson({ error: "Not found" }, { status: 404 });
    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete orientation error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
