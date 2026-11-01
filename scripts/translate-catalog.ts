/**
 * Remplit la mémoire de traduction de tout le catalogue (DeepL), sans la limite de temps des
 * fonctions Vercel. Ne retraduit jamais un texte déjà traduit ni une traduction corrigée à la
 * main : relançable sans surcoût. Les langues viennent de lib/languages.ts.
 *
 *   npx tsx scripts/translate-catalog.ts                    # traduit ce qui manque
 *   npx tsx scripts/translate-catalog.ts --dry-run          # compte seulement ce qui reste
 *   npx tsx scripts/translate-catalog.ts --retry-identical  # retraduit depuis le français les
 *       textes français que DeepL avait rendus tels quels (langue détectée à tort)
 *   npx tsx scripts/translate-catalog.ts --prune            # supprime les traductions de textes
 *       qui ne sont plus dans le catalogue (fiche modifiée ou supprimée), sauf corrections manuelles
 *
 * Variables (.env local) : DATABASE_URL, DEEPL_API_KEY. Par défaut, le catalogue est lu sur le
 * backend en ligne ; une autre adresse peut être passée en argument (http://localhost:3002).
 */
try {
  process.loadEnvFile(".env");
} catch {
  /* variables déjà dans l'environnement */
}

import prisma from "../lib/prisma";
import { SOURCE_LANG, TARGET_LANGS } from "../lib/languages";
import { catalogTexts, hashText, looksFrench, translateMissing, wantedFor } from "../lib/translate";

const origin = process.argv.find((a) => a.startsWith("http")) ?? "https://midzobackend.vercel.app";
const dryRun = process.argv.includes("--dry-run");
const retryIdentical = process.argv.includes("--retry-identical");
const prune = process.argv.includes("--prune");

async function main() {
  const texts = await catalogTexts(origin);
  console.log(`${texts.length} textes traduisibles dans le catalogue (${origin})`);

  if (prune && !dryRun) {
    const current = new Set(texts.map(hashText));
    const rows = await prisma.textTranslation.findMany({ where: { manual: false }, select: { id: true, sourceHash: true } });
    const stale = rows.filter((r) => !current.has(r.sourceHash)).map((r) => r.id);
    await prisma.textTranslation.deleteMany({ where: { id: { in: stale } } });
    console.log(`${stale.length} traductions de textes disparus du catalogue supprimées`);
  }

  if (retryIdentical && !dryRun) {
    // Traductions identiques à un texte d'allure française : supprimées puis refaites ci-dessous.
    const rows = await prisma.textTranslation.findMany({
      where: { lang: { in: TARGET_LANGS }, manual: false },
      select: { id: true, source: true, text: true },
    });
    const ids = rows.filter((r) => r.text === r.source && looksFrench(r.source)).map((r) => r.id);
    await prisma.textTranslation.deleteMany({ where: { id: { in: ids } } });
    console.log(`${ids.length} traductions identiques à la source, à refaire depuis le français`);
  }

  for (const lang of [...TARGET_LANGS, SOURCE_LANG]) {
    const wanted = wantedFor(texts, lang);
    const known = await prisma.textTranslation.count({ where: { lang, sourceHash: { in: wanted.map(hashText) } } });
    const chars = wanted.reduce((a, t) => a + t.length, 0);
    console.log(`${lang} : ${wanted.length - known} à traduire sur ${wanted.length} (${chars} caractères au total)`);
    if (dryRun) continue;
    const stats = await translateMissing(texts, lang, { via: "script" });
    console.log(`${lang} : ${stats.translated} traduits, ${stats.characters} caractères envoyés à DeepL`);
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
