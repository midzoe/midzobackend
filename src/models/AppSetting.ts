import prisma from "../../lib/prisma";

/**
 * Réglages éditoriaux (story 6.8) : clé/valeur en texte, modifiables depuis l'admin
 * sans redéploiement. Les valeurs par défaut vivent ici pour qu'un réglage jamais
 * enregistré se comporte comme un réglage posé.
 */
export const SETTING_DEFAULTS: Record<string, string> = {
  // Nombre d'événements attendus par pays de tourisme et par an.
  "tourism.events_required_per_country_per_year": "3",
};

export class AppSettingModel {
  /** Tous les réglages connus, défauts compris. */
  static async findAll() {
    const rows = await prisma.appSetting.findMany();
    const stored = Object.fromEntries(rows.map(r => [r.key, r.value]));
    return { ...SETTING_DEFAULTS, ...stored };
  }

  static async get(key: string) {
    const row = await prisma.appSetting.findUnique({ where: { key } });
    return row?.value ?? SETTING_DEFAULTS[key] ?? null;
  }

  /** Entier borné : un quota négatif ou absurde ne doit pas casser l'écran de plan. */
  static async getInt(key: string, fallback: number, min = 0, max = 100) {
    const raw = await this.get(key);
    const n = parseInt(String(raw ?? ""), 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(Math.max(n, min), max);
  }

  static async set(key: string, value: string) {
    return prisma.appSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
