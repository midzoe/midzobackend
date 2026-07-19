import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { CategoryModel } from "@/src/models/Category";

// Story 8.2 (FR29) : arbre des sujets = catégories publiques → sous-catégories, + « Autre ».
// Le front s'en sert pour pré-sélectionner le bon filtre à l'envoi du message (8.6).
export async function GET(_request: NextRequest) {
  try {
    const categories = await CategoryModel.findAll();

    const subjects = (categories as any[]).map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon ?? null,
      subcategories: (c.subcategories ?? []).map((s: any) => ({
        id: s.id,
        name: s.name,
        isOther: s.isOther ?? false,
      })),
    }));

    // Filet « Autre » global pour les demandes hors taxonomie.
    subjects.push({ id: "other", name: "Autre", icon: null, subcategories: [] });

    return corsJson({ success: true, subjects });
  } catch (error) {
    console.error("Contact subjects error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
