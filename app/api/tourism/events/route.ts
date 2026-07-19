import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { TourismEventModel } from "@/src/models/TourismEvent";

// Story 6.2 : événements tourisme publiés (publiés / à venir).
export async function GET(_request: NextRequest) {
  try {
    const items = await TourismEventModel.findPublic();
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List tourism events error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
