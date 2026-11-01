/**
 * Remplit la mémoire de traduction de tout le catalogue (DeepL), sans la limite de temps des
 * fonctions Vercel. Ne retraduit jamais un texte déjà traduit : relançable sans surcoût.
 *
 *   npx tsx scripts/translate-catalog.ts            # lit le catalogue sur le backend en ligne
 *   npx tsx scripts/translate-catalog.ts --dry-run  # compte seulement ce qui reste à traduire
 *
 * Variables (.env local) : DATABASE_URL, DEEPL_API_KEY — la clé DeepL ne va pas sur Vercel.
 * À relancer après des ajouts ou modifications en admin (écran « Traductions » : ce qui reste).
 */
try {
  process.loadEnvFile(".env");
} catch {
  /* variables déjà dans l'environnement */
}

import prisma from "../lib/prisma";
import { catalogTexts, hashText, looksFrench, translateMissing, type SiteLang } from "../lib/translate";

const origin = process.argv.find((a) => a.startsWith("http")) ?? "https://midzobackend.vercel.app";
const dryRun = process.argv.includes("--dry-run");

async function main() {
  const texts = await catalogTexts(origin);
  console.log(`${texts.length} textes traduisibles dans le catalogue (${origin})`);
  for (const lang of ["en", "de", "fr"] as SiteLang[]) {
    const wanted = lang === "fr" ? texts.filter((t) => !looksFrench(t)) : texts;
    const known = await prisma.textTranslation.count({ where: { lang, sourceHash: { in: wanted.map(hashText) } } });
    const chars = wanted.reduce((a, t) => a + t.length, 0);
    console.log(`${lang} : ${wanted.length - known} à traduire sur ${wanted.length} (${chars} caractères au total)`);
    if (dryRun) continue;
    const stats = await translateMissing(texts, lang);
    console.log(`${lang} : ${stats.translated} traduits, ${stats.characters} caractères envoyés à DeepL`);
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
