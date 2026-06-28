import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { VisaModel } from "@/src/models/Visa";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nationality = searchParams.get("nationality");
    const destination = searchParams.get("destination");

    if (!nationality || !destination) {
      return corsJson(
        { error: "nationality and destination query params are required" },
        { status: 400 }
      );
    }

    const visaInfo = await VisaModel.findByRoute(nationality, destination);

    const result: {
      visa_required: boolean | null;
      travel_advisory: string | null;
      estimated_cost: number | null;
      documents_needed: string[];
      warnings: string[];
    } = {
      visa_required: visaInfo?.visaRequired ?? null,
      travel_advisory: visaInfo?.notes ?? null,
      estimated_cost: visaInfo?.cost ?? null,
      documents_needed: (visaInfo?.documentsRequired as string[]) ?? [],
      warnings: [],
    };

    if (visaInfo?.visaRequired) {
      result.warnings.push("Visa required — apply before departure.");
    }
    if (visaInfo?.processingTime) {
      result.warnings.push(`Estimated processing time: ${visaInfo.processingTime}`);
    }
    if (!visaInfo) {
      result.warnings.push("No visa data available for this route.");
    }

    return corsJson({ success: true, nationality, destination, ...result });
  } catch (error) {
    console.error("Travel check error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
