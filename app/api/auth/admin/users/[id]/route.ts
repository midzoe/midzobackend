import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { UserModel } from "@/src/models/User";

const VALID_ROLES = ["user", "admin", "superadmin"];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const targetId = parseInt(id);
    if (isNaN(targetId)) return corsJson({ error: "Invalid user id" }, { status: 400 });

    const body = await request.json();
    const { email, password, role } = body;

    if (role && !VALID_ROLES.includes(role)) {
      return corsJson({ error: "Invalid role" }, { status: 400 });
    }

    // Only superadmin can promote to superadmin
    if (role === "superadmin" && auth.role !== "superadmin") {
      return corsJson({ error: "Forbidden" }, { status: 403 });
    }

    const updatedUser = await UserModel.adminUpdate(targetId, { email, password, role });
    if (!updatedUser) return corsJson({ error: "User not found" }, { status: 404 });

    return corsJson({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Admin user update error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PATCH, OPTIONS");
}
