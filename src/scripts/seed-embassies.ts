/**
 * Catalogue des représentations diplomatiques (story 4.8).
 *
 * Objectif : répondre à « je suis au Togo et je veux aller en France → à quelle
 * ambassade dois-je m'adresser, où est-elle, et comment y aller ? », sachant que
 * la réponse pour le Sénégal n'est PAS la même que pour le Togo.
 *
 * Principe de prudence : on n'enregistre une mission que là où son existence est
 * établie. Pour les couples non couverts, la fiche visa garde son champ « Où
 * déposer » et le site affiche une invitation à vérifier — une mauvaise adresse
 * ferait faire un déplacement inutile, ce qui est pire que pas d'adresse.
 *
 * Toutes les missions sont créées NON VÉRIFIÉES (`isValidated: false`) : elles
 * n'apparaissent sur le site qu'une fois relues en admin.
 *
 * Lancer : npx tsx src/scripts/seed-embassies.ts
 */
import prisma from "../../lib/prisma";
import { buildMapsUrl } from "../../lib/embassy-input";

/** Pays d'accueil possibles : nom en base → ville de la mission, libellé FR, code ISO2. */
const HOSTS: Record<string, { city: string; fr: string; iso2: string }> = {
  Togo: { city: "Lomé", fr: "au Togo", iso2: "tg" },
  Benin: { city: "Cotonou", fr: "au Bénin", iso2: "bj" },
  "Côte d'Ivoire": { city: "Abidjan", fr: "en Côte d'Ivoire", iso2: "ci" },
  Senegal: { city: "Dakar", fr: "au Sénégal", iso2: "sn" },
  Guinea: { city: "Conakry", fr: "en Guinée", iso2: "gn" },
  Mali: { city: "Bamako", fr: "au Mali", iso2: "ml" },
  "Burkina Faso": { city: "Ouagadougou", fr: "au Burkina Faso", iso2: "bf" },
  Niger: { city: "Niamey", fr: "au Niger", iso2: "ne" },
  Cameroon: { city: "Yaoundé", fr: "au Cameroun", iso2: "cm" },
  Chad: { city: "N'Djamena", fr: "au Tchad", iso2: "td" },
  Gabon: { city: "Libreville", fr: "au Gabon", iso2: "ga" },
  "Republic of the Congo": { city: "Brazzaville", fr: "au Congo", iso2: "cg" },
  "DR Congo": { city: "Kinshasa", fr: "en République démocratique du Congo", iso2: "cd" },
  Nigeria: { city: "Abuja", fr: "au Nigeria", iso2: "ng" },
  Ghana: { city: "Accra", fr: "au Ghana", iso2: "gh" },
  Kenya: { city: "Nairobi", fr: "au Kenya", iso2: "ke" },
  Morocco: { city: "Rabat", fr: "au Maroc", iso2: "ma" },
  Tunisia: { city: "Tunis", fr: "en Tunisie", iso2: "tn" },
  Egypt: { city: "Le Caire", fr: "en Égypte", iso2: "eg" },
  "South Africa": { city: "Pretoria", fr: "en Afrique du Sud", iso2: "za" },
};

/** Pays représenté : complément du nom (« Ambassade **de France** »). */
const REPRESENTED: Record<string, string> = {
  France: "de France",
  Germany: "d'Allemagne",
  Belgium: "de Belgique",
  Netherlands: "des Pays-Bas",
  Italy: "d'Italie",
  Spain: "d'Espagne",
  Portugal: "du Portugal",
  Luxembourg: "du Luxembourg",
  Switzerland: "de Suisse",
  Sweden: "de Suède",
  "United Kingdom": "du Royaume-Uni",
  "United States": "des États-Unis",
  Canada: "du Canada",
  China: "de Chine",
};

/** Dans les pays du Commonwealth, une mission britannique ou canadienne est un haut-commissariat. */
const COMMONWEALTH = new Set(["Ghana", "Nigeria", "Kenya", "South Africa"]);

/** Sous-domaine des missions allemandes (auswaertiges-amt : <ville>.diplo.de). */
const DIPLO_DE: Record<string, string> = {
  Togo: "lome", Benin: "cotonou", "Côte d'Ivoire": "abidjan", Senegal: "dakar",
  Guinea: "conakry", Mali: "bamako", "Burkina Faso": "ouagadougou", Niger: "niamey",
  Cameroon: "jaunde", Chad: "ndjamena", Gabon: "libreville", "DR Congo": "kinshasa",
  Nigeria: "abuja", Ghana: "accra", Kenya: "nairobi", Morocco: "rabat",
  Tunisia: "tunis", Egypt: "kairo", "South Africa": "pretoria",
};

/** Nom du pays dans les URL gov.uk/world/<pays>. */
const GOV_UK: Record<string, string> = {
  Togo: "togo", Benin: "benin", "Côte d'Ivoire": "cote-divoire", Senegal: "senegal",
  Guinea: "guinea", Mali: "mali", "Burkina Faso": "burkina-faso", Niger: "niger",
  Cameroon: "cameroon", Chad: "chad", Gabon: "gabon", "DR Congo": "democratic-republic-of-congo",
  Nigeria: "nigeria", Ghana: "ghana", Kenya: "kenya", Morocco: "morocco",
  Tunisia: "tunisia", Egypt: "egypt", "South Africa": "south-africa",
};

/** Un poste : pays d'accueil + éventuels pays desservis en plus. */
type Post = { host: string; covers?: string[] };

/**
 * Réseau retenu par pays de destination. Volontairement conservateur : seules les
 * missions dont l'existence est établie figurent ici. Les couples manquants sont
 * listés en fin d'exécution pour être complétés à la main en admin.
 */
const NETWORK: Record<string, Post[]> = {
  // Réseau le plus dense d'Afrique : une mission dans chacun des 20 pays.
  France: Object.keys(HOSTS).map(host => ({ host })),

  // Idem pour les États-Unis.
  "United States": Object.keys(HOSTS).map(host => ({ host })),

  // La Chine dispose également d'une ambassade dans chacun de ces pays.
  China: Object.keys(HOSTS).map(host => ({ host })),

  // Allemagne : partout sauf au Congo-Brazzaville, où la mission compétente n'a
  // pas été établie avec certitude — laissé à compléter plutôt que deviné.
  Germany: Object.keys(HOSTS)
    .filter(h => h !== "Republic of the Congo")
    .map(host => ({ host })),

  "United Kingdom": [
    { host: "Ghana", covers: ["Togo"] }, // le haut-commissariat d'Accra couvre le Togo
    { host: "Nigeria" }, { host: "Côte d'Ivoire" }, { host: "Senegal" },
    { host: "Cameroon" }, { host: "DR Congo" }, { host: "Kenya" },
    { host: "Morocco" }, { host: "Tunisia" }, { host: "Egypt" }, { host: "South Africa" },
  ],

  Canada: [
    { host: "Ghana" }, { host: "Nigeria" }, { host: "Côte d'Ivoire" }, { host: "Senegal" },
    { host: "Mali" }, { host: "Burkina Faso" }, { host: "Cameroon" }, { host: "DR Congo" },
    { host: "Kenya" }, { host: "Morocco" }, { host: "Tunisia" }, { host: "Egypt" },
    { host: "South Africa" },
  ],

  Belgium: [
    { host: "Senegal" }, { host: "Côte d'Ivoire" }, { host: "Benin" }, { host: "Cameroon" },
    { host: "DR Congo" }, { host: "Nigeria" }, { host: "Kenya" }, { host: "Morocco" },
    { host: "Tunisia" }, { host: "Egypt" }, { host: "South Africa" },
  ],

  Switzerland: [
    { host: "Senegal" }, { host: "Côte d'Ivoire" }, { host: "Cameroon" }, { host: "DR Congo" },
    { host: "Nigeria" }, { host: "Kenya" }, { host: "Morocco" }, { host: "Tunisia" },
    { host: "Egypt" }, { host: "South Africa" },
  ],

  Italy: [
    { host: "Senegal" }, { host: "Côte d'Ivoire" }, { host: "Ghana" }, { host: "Nigeria" },
    { host: "Cameroon" }, { host: "DR Congo" }, { host: "Kenya" }, { host: "Morocco" },
    { host: "Tunisia" }, { host: "Egypt" }, { host: "South Africa" },
  ],

  Spain: [
    { host: "Senegal" }, { host: "Côte d'Ivoire" }, { host: "Mali" }, { host: "Ghana" },
    { host: "Nigeria" }, { host: "Cameroon" }, { host: "Kenya" }, { host: "Morocco" },
    { host: "Tunisia" }, { host: "Egypt" }, { host: "South Africa" },
  ],

  Netherlands: [
    { host: "Senegal" }, { host: "Côte d'Ivoire" }, { host: "Ghana" }, { host: "Nigeria" },
    { host: "Kenya" }, { host: "Morocco" }, { host: "Tunisia" }, { host: "Egypt" },
    { host: "South Africa" },
  ],

  Portugal: [
    { host: "Senegal" }, { host: "Nigeria" }, { host: "Morocco" }, { host: "Tunisia" },
    { host: "Egypt" }, { host: "South Africa" },
  ],

  Sweden: [
    { host: "Mali" }, { host: "Nigeria" }, { host: "Kenya" }, { host: "Morocco" },
    { host: "Tunisia" }, { host: "Egypt" },
  ],

  // Réseau minimal en Afrique. Pour les visas Schengen, le Luxembourg est très
  // souvent représenté par la Belgique — c'est déjà dit dans la fiche visa.
  Luxembourg: [{ host: "Senegal" }],
};

function missionType(represented: string, host: string) {
  const isCommonwealthMission =
    (represented === "United Kingdom" || represented === "Canada") && COMMONWEALTH.has(host);
  return isCommonwealthMission ? "Haut-commissariat" : "Ambassade";
}

/** Site officiel, uniquement là où le réseau suit un schéma d'URL public et stable. */
function officialLink(represented: string, host: string): string | null {
  const h = HOSTS[host];
  switch (represented) {
    case "France":
      return `https://${h.iso2}.ambafrance.org`;
    case "United States":
      return `https://${h.iso2}.usembassy.gov`;
    case "Germany":
      return DIPLO_DE[host] ? `https://${DIPLO_DE[host]}.diplo.de` : null;
    case "United Kingdom":
      return GOV_UK[host] ? `https://www.gov.uk/world/${GOV_UK[host]}` : null;
    case "China":
      // Les demandes passent par les centres de visa chinois (CVASC).
      return "https://www.visaforchina.cn";
    default:
      return null;
  }
}

async function main() {
  // Les 12 enregistrements de la story 4.1 étaient des remplissages : chacun situé
  // dans sa PROPRE capitale (« Ambassade de France — Paris »), donc inutilisable
  // pour un demandeur africain. On les reconnaît à l'absence de pays d'accueil.
  const legacy = await prisma.embassy.deleteMany({ where: { hostCountry: null } });
  if (legacy.count) console.log(`Remplissages supprimés : ${legacy.count}`);

  let created = 0;
  let skipped = 0;

  for (const [represented, posts] of Object.entries(NETWORK)) {
    for (const post of posts) {
      const host = HOSTS[post.host];
      if (!host) {
        console.warn(`pays d'accueil inconnu : ${post.host}`);
        continue;
      }

      const type = missionType(represented, post.host);
      const name = `${type} ${REPRESENTED[represented]} ${host.fr}`;

      const existing = await prisma.embassy.findFirst({
        where: { country: represented, hostCountry: post.host },
        select: { id: true },
      });
      if (existing) {
        skipped++;
        continue;
      }

      await prisma.embassy.create({
        data: {
          country: represented,
          hostCountry: post.host,
          name,
          type,
          city: host.city,
          location: `${host.city}, ${post.host}`,
          link: officialLink(represented, post.host),
          // Recherche cartographique plutôt qu'un point inventé : sans adresse
          // exacte vérifiée, la recherche mène au bon endroit.
          mapsUrl: buildMapsUrl(name, host.city, post.host),
          coveredCountries: post.covers ?? [],
          isValidated: false,
        },
      });
      created++;
    }
  }

  // Couples (origine → destination) encore sans mission compétente : à compléter
  // à la main en admin, la fiche visa gardant son champ « Où déposer ».
  const all = await prisma.embassy.findMany();
  const gaps: string[] = [];
  for (const destination of Object.keys(NETWORK)) {
    for (const origin of Object.keys(HOSTS)) {
      if (origin === destination) continue;
      const covered = all.some(
        e =>
          e.country === destination &&
          (e.hostCountry === origin || e.coveredCountries.includes(origin))
      );
      if (!covered) gaps.push(`${origin} → ${destination}`);
    }
  }

  console.log(`Missions créées  : ${created}`);
  console.log(`Déjà présentes   : ${skipped}`);
  console.log(`Total en base    : ${await prisma.embassy.count()}`);
  console.log(`Couples couverts : ${Object.keys(NETWORK).length * Object.keys(HOSTS).length - gaps.length} / ${Object.keys(NETWORK).length * Object.keys(HOSTS).length}`);
  if (gaps.length) {
    console.log(`\nÀ compléter à la main (${gaps.length}) :`);
    const byDest: Record<string, string[]> = {};
    gaps.forEach(g => {
      const [o, d] = g.split(" → ");
      (byDest[d] = byDest[d] || []).push(o);
    });
    Object.entries(byDest).forEach(([d, os]) => console.log(`  ${d} : ${os.join(", ")}`));
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
