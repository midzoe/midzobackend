import { NextRequest } from "next/server";
import { authenticateRequest, getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { NotificationModel, NotificationType } from "@/src/models/Notification";

const VALID_TYPES: NotificationType[] = ["visa_alert", "newsletter", "trip_reminder"];

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });

    const notifications = await NotificationModel.findByUser(parseInt(auth.userId));
    return corsJson({ success: true, notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin can create for any user; regular user can create for themselves
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { user_id, type, title, message, data } = body;

    if (!type || !VALID_TYPES.includes(type)) {
      return corsJson(
        { error: `type must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }
    if (!title || !message) {
      return corsJson({ error: "title and message are required" }, { status: 400 });
    }

    // Admin can target any user; otherwise target self
    const targetUserId =
      isAdmin(auth.role) && user_id ? parseInt(user_id) : parseInt(auth.userId);

    const notification = await NotificationModel.create({
      userId: targetUserId,
      type,
      title,
      message,
      data,
    });

    return corsJson({ success: true, notification }, { status: 201 });
  } catch (error) {
    console.error("Create notification error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
