import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { FlightModel } from "@/src/models/Flight";

// Vols du catalogue. `audience=student` sert l'espace études, sinon tout le catalogue public.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const items = await FlightModel.findAll({
      audience: searchParams.get("audience") ?? undefined,
      fromCountry: searchParams.get("from") ?? undefined,
      toCountry: searchParams.get("to") ?? undefined,
      type: searchParams.get("type") ?? undefined,
    });

    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List flights error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
