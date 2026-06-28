import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { StudyCountryModel } from "@/src/models/StudyCountry";

export async function GET(_: NextRequest) {
  try {
    const data = await StudyCountryModel.findAll();
    return corsJson({ success: true, data });
  } catch (error) {
    console.error("Study countries error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
