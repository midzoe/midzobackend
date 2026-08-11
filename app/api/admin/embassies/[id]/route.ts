import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { EmbassyModel } from "@/src/models/Embassy";
import { embassyPayload } from "@/lib/embassy-input";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const embassyId = parseInt(id);
    if (isNaN(embassyId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const embassy = await EmbassyModel.update(embassyId, embassyPayload(await request.json()));
    if (!embassy) return corsJson({ error: "Embassy not found" }, { status: 404 });

    return corsJson({ success: true, embassy });
  } catch (error) {
    console.error("Update embassy error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const embassyId = parseInt(id);
    if (isNaN(embassyId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const deleted = await EmbassyModel.delete(embassyId);
    if (!deleted) return corsJson({ error: "Embassy not found" }, { status: 404 });

    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete embassy error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
