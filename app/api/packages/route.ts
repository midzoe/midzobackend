import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { PackageModel } from "@/src/models/Package";

/** Catalogue public des packages : volontairement sans authentification (visible avant l'achat). */
export async function GET(_request: NextRequest) {
  try {
    const packages = await PackageModel.findAllPublic();
    return corsJson({ success: true, packages });
  } catch (error) {
    console.error("List packages error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
