/**
 * 01/11/2026 — Masque les fiches de démonstration des pages annuaire (vols, sites, restaurants,
 * hébergements touristiques, emplois, formations, prestataires de légalisation / reconnaissance /
 * visa travail) : intitulés en anglais, prix et taux de réussite inventés, présentés comme de vraies
 * offres. `isActive = false` (réversible depuis l'admin) ; seules les fiches listées sont touchées.
 *
 *   node scripts/hide-demo-catalog-2026-11-01.cjs           # aperçu
 *   node scripts/hide-demo-catalog-2026-11-01.cjs --apply   # applique
 */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");

const DEMO = {
  flight: [1, 2, 3, 4, 5, 6],
  touristSite: [1, 2, 3],
  restaurant: [1, 2, 3],
  tourismAccommodation: [1, 2, 3],
  job: [1, 2, 3],
  training: [1, 2, 3, 4, 5, 6],
  serviceProvider: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
};

async function main() {
  for (const [model, ids] of Object.entries(DEMO)) {
    const rows = await prisma[model].findMany({ where: { id: { in: ids } }, select: { id: true, isActive: true } });
    const active = rows.filter((r) => r.isActive).map((r) => r.id);
    console.log(`${model} : ${rows.length}/${ids.length} trouvées, actives : ${active.join(", ") || "aucune"}`);
    if (apply && active.length) {
      const res = await prisma[model].updateMany({ where: { id: { in: active } }, data: { isActive: false } });
      console.log(`  → ${res.count} masquée(s)`);
    }
  }
  if (!apply) console.log("\nAperçu seulement : relancer avec --apply pour masquer.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
