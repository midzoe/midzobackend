import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { authenticateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { OrientationResourceModel } from "@/src/models/OrientationResource";

// Story 10.1/10.2 (FR34/FR35) : ressources d'orientation, filtrables type/catégorie.
// Le champ `location` (lieu de formation) n'est renvoyé qu'aux premium (FR35).
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || undefined;
    const category = searchParams.get("category") || undefined;

    // Premium ? (token optionnel)
    let isPremium = false;
    const decoded = authenticateRequest(request);
    if (decoded) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(decoded.userId) },
        select: { isPremium: true },
      });
      isPremium = !!user?.isPremium;
    }

    const items = await OrientationResourceModel.findPublic({ type, category });
    const data = items.map((r) => {
      const { location, ...rest } = r as any;
      // FR35 : le lieu n'est exposé qu'aux premium.
      return isPremium ? { ...rest, location } : rest;
    });

    return corsJson({ success: true, data, premium: isPremium });
  } catch (error) {
    console.error("Orientation error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
