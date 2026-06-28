import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { VisaModel } from "@/src/models/Visa";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (from && to) {
      const visa = await VisaModel.findByRoute(from, to);
      if (!visa) {
        return corsJson(
          { success: false, error: "No visa information found for this route" },
          { status: 404 }
        );
      }
      return corsJson({ success: true, visa });
    }

    const visas = await VisaModel.findAll();
    return corsJson({ success: true, visas });
  } catch (error) {
    console.error("Visa query error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
