import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { TourismCountryModel } from "@/src/models/TourismCountry";

export async function GET(_: NextRequest) {
  try {
    const data = await TourismCountryModel.findAll();
    return corsJson({ success: true, data });
  } catch (error) {
    console.error("Tourism countries error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
