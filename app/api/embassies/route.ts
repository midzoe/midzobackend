import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { EmbassyModel } from "@/src/models/Embassy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");

    const items = country
      ? await EmbassyModel.findByCountry(country)
      : await EmbassyModel.findAll();

    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List embassies error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
