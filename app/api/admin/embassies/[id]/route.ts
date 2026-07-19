import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { EmbassyModel } from "@/src/models/Embassy";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const embassyId = parseInt(id);
    if (isNaN(embassyId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const body = await request.json();
    const { country, name, location, link, email, phone } = body;

    const embassy = await EmbassyModel.update(embassyId, {
      country,
      name,
      location,
      link,
      email,
      phone,
    });

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
