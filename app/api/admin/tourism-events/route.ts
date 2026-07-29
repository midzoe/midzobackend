import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TourismEventModel } from "@/src/models/TourismEvent";

/** Liste admin : brouillons compris, filtrable par pays / année / sous-catégorie. */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") ?? "");

    const items = await TourismEventModel.findAll({
      country: searchParams.get("country")?.trim() || undefined,
      year: Number.isFinite(year) ? year : undefined,
      subcategory: searchParams.get("subcategory")?.trim() || undefined,
      status: searchParams.get("status")?.trim() || undefined,
    });
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("Admin list tourism events error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    if (!body?.title?.trim()) return corsJson({ error: "title is required" }, { status: 400 });

    const item = await TourismEventModel.create(body);
    return corsJson({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Create tourism event error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
