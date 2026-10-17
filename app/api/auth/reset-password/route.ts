import { NextRequest } from "next/server";
import { UserModel } from "@/src/models/User";
import { corsJson, corsOptions } from "@/lib/cors";

// Mot de passe oublié — étape 2 : code reçu par email + nouveau mot de passe.
export async function POST(request: NextRequest) {
  try {
    const { email, code, password } = await request.json();
    if (!email || !code || !password) {
      return corsJson({ success: false, error: "email, code and password are required" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 6) {
      return corsJson({ success: false, error: "password must be at least 6 characters" }, { status: 400 });
    }

    const result = await UserModel.resetPassword(String(email), String(code).trim(), password);
    if (!result.success) return corsJson({ success: false, error: result.error }, { status: 400 });

    return corsJson({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return corsJson({ success: false, error: "internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
