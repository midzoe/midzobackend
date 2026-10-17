import { NextRequest } from "next/server";
import { UserModel } from "@/src/models/User";
import { sendPasswordResetEmail } from "@/lib/email";
import { corsJson, corsOptions } from "@/lib/cors";

// Mot de passe oublié — étape 1 : envoi d'un code par email.
// Réponse identique que le compte existe ou non (pas d'énumération des emails).
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return corsJson({ success: false, error: "valid email is required" }, { status: 400 });
    }

    const reset = await UserModel.createPasswordResetCode(email);
    if (reset) {
      try {
        await sendPasswordResetEmail(reset.email, reset.code);
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
      }
    }

    return corsJson({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return corsJson({ success: false, error: "internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
