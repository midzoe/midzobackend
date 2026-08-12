import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { PackageModel, PACKAGE_FAMILIES } from "@/src/models/Package";

/**
 * Grille commerciale publique (flyer « MIDZOE PACKAGES ») : les paliers Study / Tourism /
 * Mix + la consultation. Sans authentification — c'est la page de prix, elle se lit avant
 * toute création de compte.
 *
 * Renvoie aussi le regroupement par famille : la page l'affiche colonne par colonne, et
 * refaire ce tri côté client dupliquerait l'ordre curaté saisi en admin.
 */
export async function GET(_request: NextRequest) {
  try {
    const packages = await PackageModel.findShowcase();

    const families = PACKAGE_FAMILIES.map((family) => ({
      family,
      packages: packages.filter((p) => p.family === family),
    })).filter((group) => group.packages.length > 0);

    return corsJson({ success: true, packages, families });
  } catch (error) {
    console.error("Showcase packages error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
