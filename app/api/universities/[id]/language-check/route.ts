import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { UniversityModel } from "@/src/models/University";
import { meetsLevel } from "@/lib/cefr";
import prisma from "@/lib/prisma";

// Story 5.3 : compare l'exigence de langue d'une université au profil de l'étudiant
// authentifié (ses UserLanguage) et indique s'il l'atteint.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const decoded = authenticateRequest(request);
    if (!decoded) return corsJson({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const universityId = parseInt(id);
    if (isNaN(universityId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const university = await UniversityModel.findById(universityId);
    if (!university) return corsJson({ error: "University not found" }, { status: 404 });

    // Pas d'exigence de langue → rien à atteindre.
    if (!university.requiredLanguage || university.requiredLanguage.trim().length === 0) {
      return corsJson({ success: true, required: null, userLanguage: null, met: true });
    }

    const required = {
      language: university.requiredLanguage,
      level: university.requiredLanguageLevel ?? null,
    };

    // Langue de l'utilisateur pour cette langue (match insensible à la casse).
    const userLang = await prisma.userLanguage.findFirst({
      where: {
        userId: parseInt(decoded.userId),
        language: { equals: university.requiredLanguage, mode: "insensitive" },
      },
      select: { language: true, level: true },
    });

    const met = meetsLevel(userLang?.level, university.requiredLanguageLevel);

    return corsJson({ success: true, required, userLanguage: userLang ?? null, met });
  } catch (error) {
    console.error("University language-check error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
