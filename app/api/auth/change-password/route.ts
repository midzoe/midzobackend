import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { UserModel } from "@/src/models/User";

// Story 9.5 (FR40) : changement de mot de passe self-service (ancien mdp vérifié).
export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });

    const b = await request.json();
    const oldPassword = b?.old_password ?? b?.oldPassword;
    const newPassword = b?.new_password ?? b?.newPassword;
    if (!oldPassword || !newPassword) {
      return corsJson({ error: "old_password and new_password are required" }, { status: 400 });
    }
    if (String(newPassword).length < 6) {
      return corsJson({ error: "new password must be at least 6 characters" }, { status: 400 });
    }

    const result = await UserModel.changePassword(parseInt(auth.userId), oldPassword, newPassword);
    if (!result.success) {
      const status = result.error === "invalid current password" ? 400 : 404;
      return corsJson({ error: result.error }, { status });
    }
    return corsJson({ success: true, message: "Password updated" });
  } catch (error) {
    console.error("Change password error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
