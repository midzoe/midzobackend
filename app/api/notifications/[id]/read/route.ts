import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { NotificationModel } from "@/src/models/Notification";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const notifId = parseInt(id);
    if (isNaN(notifId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const notification = await NotificationModel.markRead(notifId, parseInt(auth.userId));
    if (!notification) {
      return corsJson({ error: "Notification not found" }, { status: 404 });
    }

    return corsJson({ success: true, notification });
  } catch (error) {
    console.error("Mark read error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PATCH, OPTIONS");
}
