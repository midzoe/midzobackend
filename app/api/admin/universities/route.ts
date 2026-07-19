import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { UniversityModel } from "@/src/models/University";

// Story 5.1 : CRUD admin des universités. Le modèle métier (UniversityModel)
// porte déjà toute la logique ; ces routes ne font qu'ajouter la garde admin.
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const items = await UniversityModel.findAll();
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("Admin list universities error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { name, city, country, website, applicationUrl, specialty, requiredLanguage, requiredLanguageLevel } = body;

    if (!name || !city || !country) {
      return corsJson({ error: "name, city and country are required" }, { status: 400 });
    }

    const data = await UniversityModel.create({
      name,
      city,
      country,
      website,
      applicationUrl,
      specialty,
      requiredLanguage,
      requiredLanguageLevel,
    });

    return corsJson({ success: true, data }, { status: 201 });
  } catch (error: any) {
    if (error instanceof Error && error.message.includes("already exists")) {
      return corsJson({ error: error.message }, { status: 409 });
    }
    console.error("Create university error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
