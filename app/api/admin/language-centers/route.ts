import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { LanguageCenterModel } from "@/src/models/LanguageCenter";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const items = await LanguageCenterModel.findAll();
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("Admin list language centers error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { name, country, city, language, levels, link, isPartner } = body;

    if (!name || !country || !language) {
      return corsJson(
        { error: "name, country and language are required" },
        { status: 400 }
      );
    }

    const center = await LanguageCenterModel.create({
      name,
      country,
      city,
      language,
      levels,
      link,
      isPartner,
    });

    return corsJson({ success: true, center }, { status: 201 });
  } catch (error) {
    console.error("Create language center error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
