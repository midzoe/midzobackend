import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { TourismProgramModel } from "@/src/models/TourismProgram";
import { withLocale } from "@/lib/translate";

// Story 6.1 : programmes tourisme validés, filtrables par sous-catégorie (safari/sport).
async function getHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subcategory = searchParams.get("subcategory") ?? undefined;
    const items = await TourismProgramModel.findPublic(subcategory);
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List tourism programs error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}

export const GET = withLocale(getHandler);
