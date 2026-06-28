import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { UserModel } from "@/src/models/User";
import prisma from "@/lib/prisma";

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
    const { email, password, role, is_premium } = body;

    if (role && !VALID_ROLES.includes(role)) {
      return corsJson({ error: "Invalid role" }, { status: 400 });
    }
    if (role === "superadmin" && auth.role !== "superadmin") {
      return corsJson({ error: "Forbidden" }, { status: 403 });
    }

    let user;
    if (is_premium !== undefined) {
      // handle premium separately
      await prisma.user.update({
        where: { id: targetId },
        data: {
          isPremium: is_premium,
          premiumSince: is_premium ? new Date() : null,
        },
      });
    }
    user = await UserModel.adminUpdate(targetId, { email, password, role });
    if (!user) return corsJson({ error: "User not found" }, { status: 404 });

    return corsJson({ success: true, user });
  } catch (error) {
    console.error("Admin user patch error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const targetId = parseInt(id);
    if (isNaN(targetId)) return corsJson({ error: "Invalid user id" }, { status: 400 });

    // Prevent self-deletion
    if (String(targetId) === auth.userId) {
      return corsJson({ error: "Cannot delete your own account" }, { status: 400 });
    }

    try {
      await prisma.user.delete({ where: { id: targetId } });
      return corsJson({ success: true });
    } catch (error: any) {
      if (error.code === "P2025") return corsJson({ error: "User not found" }, { status: 404 });
      throw error;
    }
  } catch (error) {
    console.error("Admin user delete error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PATCH, DELETE, OPTIONS");
}
