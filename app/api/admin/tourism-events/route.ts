import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TourismEventModel } from "@/src/models/TourismEvent";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const items = await TourismEventModel.findAll();
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
    const b = await request.json();
    if (!b?.title) return corsJson({ error: "title is required" }, { status: 400 });
    const item = await TourismEventModel.create({
      title: b.title, description: b.description, country: b.country, city: b.city,
      location: b.location, startDate: b.start_date ?? b.startDate, status: b.status,
      link: b.link, imageUrl: b.image_url ?? b.imageUrl, isPublished: b.is_published ?? b.isPublished,
    });
    return corsJson({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Create tourism event error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
