import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { ContactMessageModel } from "@/src/models/ContactMessage";

const VALID_STATUS = ["new", "read", "archived"];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const b = await request.json();
    if (!b?.status || !VALID_STATUS.includes(b.status)) {
      return corsJson({ error: "status must be new|read|archived" }, { status: 400 });
    }
    const updated = await ContactMessageModel.setStatus(Number(id), b.status);
    if (!updated) return corsJson({ error: "Not found" }, { status: 404 });
    return corsJson({ success: true, data: updated });
  } catch (error) {
    console.error("Update contact message error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const ok = await ContactMessageModel.delete(Number(id));
    if (!ok) return corsJson({ error: "Not found" }, { status: 404 });
    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete contact message error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PATCH, DELETE, OPTIONS");
}
