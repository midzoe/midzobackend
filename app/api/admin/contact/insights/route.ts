import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { ContactMessageModel } from "@/src/models/ContactMessage";

// Story 8.3 (FR30) : insights des messages de contact (volume, catégories, top domaines,
// séparation client vs premium). Gardé isAdmin.
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const data = await ContactMessageModel.insights();
    return corsJson({ success: true, data });
  } catch (error) {
    console.error("Contact insights error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
