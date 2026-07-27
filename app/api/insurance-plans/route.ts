import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { InsurancePlanModel } from "@/src/models/InsurancePlan";

// Assurances. `audience` sépare les trois pages (général / étudiant / voyage),
// `coverage_type` filtre sur une garantie précise.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const items = await InsurancePlanModel.findAll({
      audience: searchParams.get("audience") ?? undefined,
      country: searchParams.get("country") ?? undefined,
      coverageType: searchParams.get("coverage_type") ?? undefined,
    });

    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List insurance plans error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
