import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { AppSettingModel, SETTING_DEFAULTS } from "@/src/models/AppSetting";

/**
 * Story 6.8 : réglages éditoriaux (clé/valeur), réservés à l'admin.
 * Premier usage : le nombre d'événements attendus par pays de tourisme et par an.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const data = await AppSettingModel.findAll();
    return corsJson({ success: true, data });
  } catch (error) {
    console.error("Admin get settings error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

/** Corps : { key, value } ou { "clé": "valeur", … } pour plusieurs réglages d'un coup. */
export async function PUT(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const entries: [string, string][] =
      typeof body?.key === "string"
        ? [[body.key, String(body.value ?? "")]]
        : Object.entries(body ?? {}).map(([k, v]) => [k, String(v ?? "")]);

    if (entries.length === 0) return corsJson({ error: "no setting provided" }, { status: 400 });

    // Liste blanche : un réglage inconnu est un bug côté appelant, pas une clé à créer.
    const unknown = entries.filter(([k]) => !(k in SETTING_DEFAULTS)).map(([k]) => k);
    if (unknown.length) {
      return corsJson({ error: `unknown setting(s): ${unknown.join(", ")}` }, { status: 400 });
    }

    for (const [key, value] of entries) await AppSettingModel.set(key, value);

    const data = await AppSettingModel.findAll();
    return corsJson({ success: true, data });
  } catch (error) {
    console.error("Admin update settings error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, PUT, OPTIONS");
}
