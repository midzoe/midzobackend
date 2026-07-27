import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { ServiceProviderModel } from "@/src/models/ServiceProvider";

// Prestataires de démarches. `type` = work_visa | legalization | recognition
// selon la page qui appelle (visa travail, légalisation, reconnaissance de diplôme).
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const items = await ServiceProviderModel.findAll({
      serviceType: searchParams.get("type") ?? undefined,
      country: searchParams.get("country") ?? undefined,
    });

    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List service providers error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
