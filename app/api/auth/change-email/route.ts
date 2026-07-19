import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { UserModel } from "@/src/models/User";
import { sendVerificationEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Story 9.5 (FR40) : changement d'email self-service → re-vérification requise.
export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });

    const b = await request.json();
    const newEmail = typeof b?.email === "string" ? b.email.trim() : "";
    const password = b?.password;
    if (!newEmail || !EMAIL_RE.test(newEmail)) return corsJson({ error: "valid email is required" }, { status: 400 });
    if (!password) return corsJson({ error: "password is required" }, { status: 400 });

    const result = await UserModel.changeEmail(parseInt(auth.userId), newEmail, password);
    if (!result.success) {
      const status =
        result.error === "invalid password" ? 400 :
        result.error === "email already in use" ? 409 : 404;
      return corsJson({ error: result.error }, { status });
    }

    // Envoi du code best-effort (log sans SMTP).
    try {
      if (result.code) await sendVerificationEmail(newEmail, result.code);
    } catch (e) {
      console.error("change-email verification send failed:", e);
    }

    return corsJson({ success: true, message: "Email updated — please verify the new address", requiresVerification: true });
  } catch (error) {
    console.error("Change email error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
