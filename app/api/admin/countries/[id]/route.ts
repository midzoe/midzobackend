import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const countryId = parseInt(id);
    if (isNaN(countryId)) return corsJson({ error: "Invalid id" }, { status: 400 });

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

    try {
      const country = await prisma.country.update({
        where: { id: countryId },
        data: {
          name,
          code,
          heroImage: hero_image,
          motto,
          history,
          culturalImage: cultural_image,
          modernLife: modern_life,
          modernImage: modern_image,
          studyAvailable: study_available,
          tourismAvailable: tourism_available,
          visaInfoAvailable: visa_info_available,
          isValidated: is_validated,
        },
      });
      return corsJson({ success: true, country });
    } catch (error: any) {
      if (error.code === "P2025") return corsJson({ error: "Country not found" }, { status: 404 });
      throw error;
    }
  } catch (error) {
    console.error("Update country error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, OPTIONS");
}
