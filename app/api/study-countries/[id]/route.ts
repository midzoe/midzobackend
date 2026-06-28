import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { StudyCountryModel } from "@/src/models/StudyCountry";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const countryId = parseInt(id);
    if (isNaN(countryId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const data = await StudyCountryModel.findById(countryId);
    if (!data) return corsJson({ error: "Country not found" }, { status: 404 });

    return corsJson({ success: true, data });
  } catch (error) {
    console.error("Study country error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
