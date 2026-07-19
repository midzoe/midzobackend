import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TripModel } from "@/src/models/Trip";

// Story 7.4 — cocher/décocher (ou renommer) un item de checklist.
export async function PUT(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const { itemId } = await params;
    const iid = parseInt(itemId);
    if (isNaN(iid)) return corsJson({ error: "Invalid id" }, { status: 400 });
    const b = await request.json();
    const item = await TripModel.updateChecklistItem(iid, parseInt(auth.userId), {
      isDone: b.isDone ?? b.is_done, label: b.label,
    });
    if (!item) return corsJson({ error: "Item not found" }, { status: 404 });
    return corsJson({ success: true, data: item });
  } catch (error) {
    console.error("Update checklist item error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, OPTIONS");
}
