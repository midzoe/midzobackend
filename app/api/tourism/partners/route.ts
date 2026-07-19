import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { PartnerModel } from "@/src/models/Partner";

// Story 6.3 : partenaires actifs, filtrables par catégorie.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const items = await PartnerModel.findPublic(category);
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List partners error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
