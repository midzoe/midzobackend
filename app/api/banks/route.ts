import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { BankModel } from "@/src/models/Bank";

// Banques et comptes associés (la page les affiche en onglets, d'où les comptes inclus).
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const items = await BankModel.findAll({
      country: searchParams.get("country") ?? undefined,
    });

    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("List banks error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
