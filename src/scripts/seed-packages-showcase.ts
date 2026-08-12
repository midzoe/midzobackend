import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Grille commerciale MIDZOE (flyer « MIDZOE PACKAGES — Study. Travel. Experience more. »).
 *
 * Ce script pose les 14 offres de la plaquette : 5 paliers Study, 5 paliers Tourism,
 * 3 formules Mix et la consultation personnalisée. Il alimente la page publique
 * `/packages` et l'écran `/admin/packages`.
 *
 * ⚠️ Ce qui vient de la plaquette et n'est PAS inventé ici : les noms des paliers, le
 * nombre de services, les prix d'appel et les avantages listés. Toute évolution de tarif
 * se fait ensuite depuis l'admin — ce fichier n'est qu'un point de départ.
 *
 * ⚠️ `family` non nul distingue ces paliers des packages du MOTEUR DE DEVIS
 * (Study / Tourism / Orientation / Full Package Top, seed.ts) : ces derniers gardent
 * `family = null`, portent des catégories et ne s'affichent jamais dans la vitrine.
 * Aucun palier n'a de catégorie ni de `basePriceCents` : leur prix est un prix d'appel,
 * pas un montant calculé.
 *
 * Idempotent : upsert sur `slug`.
 */

type Tier = {
  slug: string;
  name: string;
  family: 'study' | 'tourism' | 'mix' | 'consultation';
  /** Libellé du nombre de services, tel qu'imprimé sur la plaquette. */
  serviceLabel: string;
  tagline: string;
  description: string;
  /** Prix d'appel en CENTIMES (« à partir de » sur la plaquette). */
  priceFromCents: number;
  billingPeriod: 'once' | 'month';
  features: string[];
  order: number;
};

const tiers: Tier[] = [
  // ─── Study — construisez votre avenir ──────────────────────────────────────
  {
    slug: 'study-starter',
    name: 'Starter',
    family: 'study',
    serviceLabel: '1 service',
    tagline: 'Un premier pas accompagné',
    description: 'Le service d’études de votre choix, traité de bout en bout.',
    priceFromCents: 15000,
    billingPeriod: 'once',
    features: ['1 service au choix'],
    order: 1,
  },
  {
    slug: 'study-comfort',
    name: 'Comfort',
    family: 'study',
    serviceLabel: '2 services',
    tagline: 'Deux démarches menées ensemble',
    description: 'Deux services d’études au choix, coordonnés entre eux.',
    priceFromCents: 28000,
    billingPeriod: 'once',
    features: ['2 services au choix', 'Conseil personnalisé'],
    order: 2,
  },
  {
    slug: 'study-premium',
    name: 'Premium',
    family: 'study',
    serviceLabel: '3 à 4 services',
    tagline: 'L’essentiel de votre dossier',
    description: 'Trois à quatre services d’études, avec suivi de vos candidatures.',
    priceFromCents: 52000,
    billingPeriod: 'once',
    features: ['Tous les services inclus', 'Accompagnement personnalisé', 'Suivi des candidatures'],
    order: 3,
  },
  {
    slug: 'study-complete',
    name: 'Complete',
    family: 'study',
    serviceLabel: '5 services',
    tagline: 'Les 5 services inclus',
    description: 'L’intégralité du parcours études : diplômes, université, langue, logement, visa.',
    priceFromCents: 69000,
    billingPeriod: 'once',
    features: ['Tous les services inclus', 'Assistance VIP', 'Sérénité totale'],
    order: 4,
  },
  {
    slug: 'study-all-inclusive',
    name: 'All-Inclusive',
    family: 'study',
    serviceLabel: 'Premium+',
    tagline: 'Tout est inclus, et davantage',
    description: 'Le parcours complet avec priorité de traitement sur toutes vos démarches.',
    priceFromCents: 89000,
    billingPeriod: 'once',
    features: ['Tous les services inclus', 'Assistance VIP', 'Traitement prioritaire', 'Sérénité totale'],
    order: 5,
  },

  // ─── Tourism — explorez, profitez, souvenez-vous ───────────────────────────
  {
    slug: 'tourism-escape',
    name: 'Escape',
    family: 'tourism',
    serviceLabel: '1 service',
    tagline: 'Une escapade sans souci',
    description: 'Le service voyage de votre choix, organisé pour vous.',
    priceFromCents: 12000,
    billingPeriod: 'once',
    features: ['1 service au choix'],
    order: 11,
  },
  {
    slug: 'tourism-relax',
    name: 'Relax',
    family: 'tourism',
    serviceLabel: '2 services',
    tagline: 'Deux services, zéro logistique',
    description: 'Deux services voyage au choix, réservés et coordonnés par nos équipes.',
    priceFromCents: 22000,
    billingPeriod: 'once',
    features: ['2 services au choix', 'Conseil personnalisé'],
    order: 12,
  },
  {
    slug: 'tourism-explorer',
    name: 'Explorer',
    family: 'tourism',
    serviceLabel: '3 à 4 services',
    tagline: 'Un séjour pensé pour vous',
    description: 'Trois à quatre services voyage, avec un itinéraire optimisé.',
    priceFromCents: 39000,
    billingPeriod: 'once',
    features: ['Tous les services inclus', 'Accompagnement personnalisé', 'Expérience optimisée'],
    order: 13,
  },
  {
    slug: 'tourism-adventurer',
    name: 'Adventurer',
    family: 'tourism',
    serviceLabel: '5 services',
    tagline: 'Les 5 services inclus',
    description: 'Le séjour complet : hébergement, vols, itinéraires, guide local et langue.',
    priceFromCents: 59000,
    billingPeriod: 'once',
    features: ['Tous les services inclus', 'Guide dédié', 'Voyage sans contrainte'],
    order: 14,
  },
  {
    slug: 'tourism-ultimate',
    name: 'Ultimate',
    family: 'tourism',
    serviceLabel: 'Premium+',
    tagline: 'Tout est inclus, et davantage',
    description: 'Le séjour complet, enrichi d’expériences exclusives et d’une assistance VIP.',
    priceFromCents: 79000,
    billingPeriod: 'once',
    features: ['Tous les services inclus', 'Assistance VIP', 'Expériences exclusives', 'Sérénité totale'],
    order: 15,
  },

  // ─── Mix — études & tourisme combinés (facturation mensuelle) ──────────────
  {
    slug: 'mix-essential',
    name: 'Mix Essential',
    family: 'mix',
    serviceLabel: '2 à 3 services études + 2 services tourisme',
    tagline: 'Le meilleur des deux mondes',
    description: 'Les services essentiels des deux catégories, dans un parcours unique.',
    priceFromCents: 69000,
    billingPeriod: 'month',
    features: ['Services essentiels des deux catégories', 'Parcours bien organisé', 'Assistance personnalisée'],
    order: 21,
  },
  {
    slug: 'mix-premium',
    name: 'Mix Premium',
    family: 'mix',
    serviceLabel: '4 services études + 3 services tourisme',
    tagline: 'Études et voyages, sans compromis',
    description: 'Les services avancés des deux catégories, avec des expériences exclusives.',
    priceFromCents: 99000,
    billingPeriod: 'month',
    features: ['Services avancés des deux catégories', 'Itinéraires et expériences exclusifs', 'Assistance VIP 24/7'],
    order: 22,
  },
  {
    slug: 'mix-xxl',
    name: 'Mix XXL',
    family: 'mix',
    serviceLabel: 'Tous les services études + tous les services tourisme',
    tagline: 'Le parcours complet, de A à Z',
    description: 'L’intégralité des services études et tourisme, avec un concierge personnel.',
    priceFromCents: 149000,
    billingPeriod: 'month',
    features: ['Expérience complète sans stress', 'Assistance VIP de A à Z', 'Concierge personnel'],
    order: 23,
  },

  // ─── Consultation personnalisée ────────────────────────────────────────────
  {
    slug: 'consultation',
    name: 'Consultation personnalisée',
    family: 'consultation',
    serviceLabel: 'Rendez-vous conseil',
    tagline: 'Vous hésitez entre plusieurs packages ?',
    description:
      'Un rendez-vous avec nos experts pour identifier le package adapté à votre projet et à votre budget.',
    priceFromCents: 2500,
    billingPeriod: 'once',
    features: [
      'Analyse de votre projet avec un expert',
      '5 % de remise sur le package choisi après la consultation',
      'Frais de 25 € non remboursables si aucun package n’est retenu',
    ],
    order: 31,
  },
];

async function main() {
  let created = 0;
  let updated = 0;

  for (const tier of tiers) {
    const data = {
      name: tier.name,
      description: tier.description,
      family: tier.family,
      slug: tier.slug,
      tagline: tier.tagline,
      serviceLabel: tier.serviceLabel,
      priceFromCents: tier.priceFromCents,
      billingPeriod: tier.billingPeriod,
      currency: 'EUR',
      features: tier.features,
      isActive: true,
      order: tier.order,
      // Un palier de vitrine n'entre jamais dans le moteur de devis : ni catégories,
      // ni prix de base, ni drapeau « full package ».
      basePriceCents: 0,
      isFullPackage: false,
      isCustom: false,
    };

    const existing = await prisma.package.findUnique({ where: { slug: tier.slug } });
    if (existing) {
      await prisma.package.update({ where: { id: existing.id }, data });
      updated++;
    } else {
      await prisma.package.create({ data });
      created++;
    }
  }

  const byFamily = await prisma.package.groupBy({
    by: ['family'],
    _count: { _all: true },
    orderBy: { family: 'asc' },
  });

  console.log(`✅ Packages vitrine — ${created} créés, ${updated} mis à jour.`);
  byFamily.forEach(r =>
    console.log(`   ${(r.family ?? '(moteur de devis)').padEnd(22)} ${r._count._all}`)
  );
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
