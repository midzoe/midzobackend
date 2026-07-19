import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { PartnerModel } from "@/src/models/Partner";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const items = await PartnerModel.findAll();
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("Admin list partners error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const b = await request.json();
    if (!b?.name || !b?.url) return corsJson({ error: "name and url are required" }, { status: 400 });
    const item = await PartnerModel.create({
      name: b.name, category: b.category, url: b.url,
      logoUrl: b.logo_url ?? b.logoUrl, description: b.description, isActive: b.is_active ?? b.isActive,
    });
    return corsJson({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Create partner error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
