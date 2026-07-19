import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TourismProgramModel } from "@/src/models/TourismProgram";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const items = await TourismProgramModel.findAll();
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("Admin list tourism programs error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const b = await request.json();
    if (!b?.title || !b?.subcategory || !b?.country) {
      return corsJson({ error: "title, subcategory and country are required" }, { status: 400 });
    }
    const item = await TourismProgramModel.create({
      title: b.title, subcategory: b.subcategory, country: b.country, city: b.city,
      description: b.description, itinerary: b.itinerary, transport: b.transport,
      price: b.price != null ? Number(b.price) : undefined, currency: b.currency,
      images: b.images, isValidated: b.isValidated,
    });
    return corsJson({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Create tourism program error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
