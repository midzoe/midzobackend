import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { LanguageCenterModel } from "@/src/models/LanguageCenter";

// Story 5.4 : endpoint public — filtre par langue et/ou pays (insensible à la casse).
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") ?? undefined;
    const country = searchParams.get("country") ?? undefined;

    const items =
      language || country
        ? await LanguageCenterModel.findFiltered({ language, country })
        : await LanguageCenterModel.findAll();

    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List language centers error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
