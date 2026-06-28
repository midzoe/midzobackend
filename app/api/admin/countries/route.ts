import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50")));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.country.findMany({ skip, take: limit, orderBy: { name: "asc" } }),
      prisma.country.count(),
    ]);

    return corsJson({ success: true, data: items, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Admin list countries error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const {
      name,
      code,
      hero_image,
      motto,
      history,
      cultural_image,
      modern_life,
      modern_image,
      study_available,
      tourism_available,
      visa_info_available,
      is_validated,
    } = body;

    if (!name) return corsJson({ error: "name is required" }, { status: 400 });

    const country = await prisma.country.create({
      data: {
        name,
        code,
        heroImage: hero_image,
        motto,
        history,
        culturalImage: cultural_image,
        modernLife: modern_life,
        modernImage: modern_image,
        studyAvailable: study_available ?? false,
        tourismAvailable: tourism_available ?? false,
        visaInfoAvailable: visa_info_available ?? false,
        isValidated: is_validated ?? false,
      },
    });

    return corsJson({ success: true, country }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return corsJson({ error: "Country already exists" }, { status: 409 });
    }
    console.error("Create country error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
