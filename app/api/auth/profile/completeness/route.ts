import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { UserModel } from "@/src/models/User";

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });

    const completeness = await UserModel.getProfileCompleteness(parseInt(auth.userId));
    if (!completeness) return corsJson({ error: "User not found" }, { status: 404 });

    return corsJson({ success: true, ...completeness });
  } catch (error) {
    console.error("Profile completeness error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
