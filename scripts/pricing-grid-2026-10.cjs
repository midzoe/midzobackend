/**
 * Grille tarifaire MIDZOE (tableaux « Packages & Pricing », 18/10/2026).
 * Strictement additif : upserts par `code` / `slug` ; les anciens paliers de la plaquette
 * sont désactivés (is_active = false), jamais supprimés.
 *
 *   node scripts/pricing-grid-2026-10.cjs
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const eur = n => Math.round(n * 100);

const SERVICES = [
  ['S1', 'study', 'Recherche et réservation de vol', 'Basic', 40],
  ['S2', 'study', 'Recherche de centre de langue', 'Basic', 60],
  ['S3', 'study', 'Aide à l’ouverture de compte bancaire', 'Standard', 90],
  ['S4', 'study', 'Inscription à un cours de langue', 'Standard', 100],
  ['S5', 'study', 'Recherche de logement', 'Standard', 120],
  ['S6', 'study', 'Légalisation de documents / Apostille', 'Advanced', 150],
  ['S7', 'study', 'Accueil à l’aéroport + transfert vers le logement', 'Advanced / On-site', 150],
  ['S8', 'study', 'Reconnaissance du diplôme', 'Advanced', 180],
  ['S9', 'study', 'Recherche d’université / de programme', 'Advanced', 180],
  ['S10', 'study', 'Candidature et inscription à l’université', 'Complex', 250],
  ['S11', 'study', 'Assistance à la demande de visa', 'Complex', 250],
  ['T1', 'tourism', 'Guide de la destination / de la ville', 'Basic', 40],
  ['T2', 'tourism', 'Recommandations de restaurants', 'Basic', 40],
  ['T3', 'tourism', 'Recherche et réservation de vol', 'Basic', 40],
  ['T4', 'tourism', 'Recherche d’événements', 'Basic', 50],
  ['T5', 'tourism', 'Initiation à la langue locale', 'Standard', 70],
  ['T6', 'tourism', 'Recherche d’hébergement', 'Standard', 90],
  ['T7', 'tourism', 'Organisation des loisirs et activités', 'Standard', 90],
  ['T8', 'tourism', 'Itinéraire de voyage personnalisé', 'Advanced', 120],
  ['T9', 'tourism', 'Organisation d’un guide local', 'Advanced', 120],
  ['T10', 'tourism', 'Accueil à l’aéroport + transfert vers l’hébergement', 'Advanced / On-site', 150],
];

// [slug, family, name, min, max, valeur plafond €, prix €, libellé services, économie max €, ordre]
const TIERS = [
  ['study-start', 'study', 'Study Start', 1, 2, 200, 180, '1 à 2 services', 20, 1],
  ['study-essential', 'study', 'Study Essential', 2, 4, 400, 350, '2 à 4 services', 50, 2],
  ['study-plus', 'study', 'Study Plus', 4, 6, 650, 550, '4 à 6 services', 100, 3],
  ['study-premium', 'study', 'Study Premium', 6, 9, 1000, 820, '6 à 9 services', 180, 4],
  ['study-full', 'study', 'Study FULL', null, 11, null, 1290, 'Les 11 services', 280, 5],
  ['tourism-start', 'tourism', 'Tourism Start', 1, 2, 150, 130, '1 à 2 services', 20, 11],
  ['tourism-essential', 'tourism', 'Tourism Essential', 2, 4, 300, 250, '2 à 4 services', 50, 12],
  ['tourism-plus', 'tourism', 'Tourism Plus', 4, 7, 500, 410, '4 à 7 services', 90, 13],
  ['tourism-full', 'tourism', 'Tourism FULL', null, 10, null, 670, 'Les 10 services', 140, 14],
  ['mix-start', 'mix', 'Mix Start', null, null, 400, 340, 'Études + tourisme', 60, 21],
  ['mix-essential', 'mix', 'Mix Essential', null, null, 750, 620, 'Études + tourisme', 130, 22],
  ['mix-premium', 'mix', 'Mix Premium', null, null, 1400, 1090, 'Études + tourisme', 310, 23],
  ['mix-xxl', 'mix', 'Mix XXL — Complete', null, null, null, 1690, 'Tous les services études + tourisme', 690, 24],
];

const RETIRED = [
  'study-starter', 'study-comfort', 'study-complete', 'study-all-inclusive',
  'tourism-escape', 'tourism-relax', 'tourism-explorer', 'tourism-adventurer', 'tourism-ultimate',
];

function features([, family, , min, max, cap, , , save]) {
  const list = [];
  if (cap) list.push(`Services jusqu’à ${cap} € de valeur`);
  else if (family === 'mix') list.push('Tous les services études et tourisme (2 380 € de valeur)');
  else list.push(`Tous les services ${family === 'study' ? 'études' : 'tourisme'} inclus`);
  if (min || max) list.push(min && max ? `De ${min} à ${max} services` : `Jusqu’à ${max} services`);
  if (family === 'mix') list.push('Au moins un service études et un service tourisme');
  list.push(`Vous économisez jusqu’à ${save} €`);
  return list;
}

(async () => {
  for (const [code, family, name, complexity, price] of SERVICES) {
    const order = Number(code.slice(1));
    const data = { family, name, complexity, priceCents: eur(price), currency: 'EUR', order, isActive: true };
    await prisma.pricedService.upsert({ where: { code }, update: data, create: { code, ...data } });
  }
  console.log(`services tarifés : ${SERVICES.length}`);

  for (const t of TIERS) {
    const [slug, family, name, min, max, cap, price, label, save, order] = t;
    const data = {
      name, family, slug, order,
      tagline: cap ? `Valeur jusqu’à ${cap} € — économie jusqu’à ${save} €` : `Économie jusqu’à ${save} €`,
      serviceLabel: label,
      priceFromCents: eur(price),
      billingPeriod: 'once',
      currency: 'EUR',
      features: features(t),
      minServices: min,
      maxServices: max,
      valueCapCents: cap === null ? null : eur(cap),
      isActive: true,
    };
    await prisma.package.upsert({ where: { slug }, update: data, create: data });
  }
  console.log(`paliers : ${TIERS.length}`);

  const retired = await prisma.package.updateMany({ where: { slug: { in: RETIRED } }, data: { isActive: false } });
  console.log(`anciens paliers désactivés : ${retired.count}`);
})()
  .catch(e => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
