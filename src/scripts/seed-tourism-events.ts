import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Propositions d'événements tourisme pour le plan annuel (story 6.8).
 *
 * L'objectif par défaut est de 3 événements par pays de tourisme et par an : ce seed
 * pose 3 propositions pour chacun des 10 pays du catalogue, de sous-catégories
 * différentes quand c'est possible, pour que l'écran admin serve à **arbitrer** plutôt
 * qu'à démarrer d'une page blanche.
 *
 * ⚠️ Tout entre en **brouillon** (`isPublished: false`, `status: 'proposed'`) et
 * `datesConfirmed: false` : les fenêtres de dates sont celles des éditions habituelles,
 * pas un calendrier officiel 2026. Elles se confirment une par une depuis l'admin.
 * ⚠️ Aucun prix, aucune capacité, aucun contenu de forfait n'est posé : c'est l'offre
 * commerciale de Midzo, elle ne s'invente pas ici.
 */

const YEAR = 2026;

type Proposal = {
  title: string;
  country: string;
  city?: string;
  subcategory: string;
  start: string; // AAAA-MM-JJ, fenêtre habituelle
  end?: string;
  description: string;
  highlights: string[];
  audience?: string;
  link?: string;
  notes: string;
};

const proposals: Proposal[] = [
  /* ── MAROC ─────────────────────────────────────────────────────────────── */
  {
    title: 'Festival Gnaoua et Musiques du Monde',
    country: 'Morocco', city: 'Essaouira', subcategory: 'Musique',
    start: `${YEAR}-06-25`, end: `${YEAR}-06-28`,
    description: "Quatre jours de transe gnaoua et de fusion avec le jazz et les musiques du monde, sur les scènes ouvertes de la médina classée.",
    highlights: ['Concerts gratuits en plein air', 'Médina classée à l’UNESCO', 'Fin juin, hors saison chaude'],
    audience: 'Jeunes actifs',
    notes: 'Se tient traditionnellement fin juin. Dates 2026 à confirmer auprès de l’organisateur.',
  },
  {
    title: 'Marathon des Sables',
    country: 'Morocco', city: 'Ouarzazate', subcategory: 'Sport',
    start: `${YEAR}-04-10`, end: `${YEAR}-04-20`,
    description: "L'ultra-trail de référence dans le Sahara marocain : six étapes en autosuffisance sur environ 250 km.",
    highlights: ['Course mythique', 'Public international', 'Inscriptions très en amont'],
    audience: 'Groupes',
    link: 'https://www.marathondessables.com',
    notes: 'Édition habituellement en avril. Inscriptions ouvertes un an à l’avance : à caler tôt.',
  },
  {
    title: 'Mawazine — Rythmes du Monde',
    country: 'Morocco', city: 'Rabat', subcategory: 'Festival',
    start: `${YEAR}-06-19`, end: `${YEAR}-06-27`,
    description: "L'un des plus grands festivals de musique d'Afrique, avec des têtes d'affiche internationales et une large programmation gratuite.",
    highlights: ['Affiches internationales', 'Scènes gratuites', 'Capitale accessible en vol direct'],
    audience: 'Grand public',
    notes: 'Fenêtre habituelle : fin juin. Dates 2026 à confirmer.',
  },

  /* ── AFRIQUE DU SUD ────────────────────────────────────────────────────── */
  {
    title: 'Cape Town International Jazz Festival',
    country: 'South Africa', city: 'Le Cap', subcategory: 'Musique',
    start: `${YEAR}-03-27`, end: `${YEAR}-03-28`,
    description: "Le plus grand festival de jazz d'Afrique australe, deux soirées avec des artistes africains et internationaux.",
    highlights: ['Fin d’été austral', 'Ville facile à combiner avec la route des vins'],
    audience: 'Grand public',
    link: 'https://www.capetownjazzfest.com',
    notes: 'Se tient habituellement fin mars. Dates 2026 à confirmer.',
  },
  {
    title: 'Comrades Marathon',
    country: 'South Africa', city: 'Durban', subcategory: 'Sport',
    start: `${YEAR}-06-14`,
    description: "L'ultramarathon le plus ancien du monde, environ 90 km entre Durban et Pietermaritzburg.",
    highlights: ['Course historique', 'Forte communauté de coureurs africains'],
    audience: 'Groupes',
    link: 'https://www.comrades.com',
    notes: 'Fenêtre habituelle : juin. Le sens de la course alterne chaque année.',
  },
  {
    title: 'Safari de saison sèche — Parc Kruger',
    country: 'South Africa', city: 'Mpumalanga', subcategory: 'Safari',
    start: `${YEAR}-06-01`, end: `${YEAR}-09-30`,
    description: "La meilleure fenêtre d'observation au Kruger : végétation basse et animaux concentrés autour des points d'eau.",
    highlights: ['Big Five', 'Saison sèche = observation facile', 'Combinable avec Le Cap'],
    audience: 'Familles',
    notes: 'Saison, pas événement daté : à vendre comme fenêtre de départ. Aucune date à confirmer.',
  },

  /* ── KENYA ─────────────────────────────────────────────────────────────── */
  {
    title: 'Grande migration — Maasai Mara',
    country: 'Kenya', city: 'Maasai Mara', subcategory: 'Safari',
    start: `${YEAR}-07-15`, end: `${YEAR}-10-15`,
    description: "La traversée de la Mara par les gnous et les zèbres : le spectacle animalier le plus recherché du continent.",
    highlights: ['Traversées de rivière', 'Fenêtre juillet-octobre', 'Demande très forte, réserver tôt'],
    audience: 'Grand public',
    notes: 'Saison naturelle : la fenêtre varie avec les pluies. Aucune date officielle à attendre.',
  },
  {
    title: 'Lewa Safari Marathon',
    country: 'Kenya', city: 'Lewa', subcategory: 'Sport',
    start: `${YEAR}-06-27`,
    description: "Un marathon couru au milieu de la faune sauvage dans une réserve privée, au profit de la conservation.",
    highlights: ['Course unique au monde', 'Cause de conservation', 'Places limitées'],
    audience: 'Groupes',
    notes: 'Se tient habituellement fin juin. Dates 2026 à confirmer auprès de la Lewa Wildlife Conservancy.',
  },
  {
    title: 'Lamu Cultural Festival',
    country: 'Kenya', city: 'Lamu', subcategory: 'Culture',
    start: `${YEAR}-11-19`, end: `${YEAR}-11-22`,
    description: "Fête swahilie sur l'île de Lamu : courses de boutres, poésie, danses et artisanat dans une vieille ville classée.",
    highlights: ['Vieille ville classée à l’UNESCO', 'Culture swahilie vivante'],
    audience: 'Grand public',
    notes: 'Fenêtre habituelle : novembre. Dates 2026 à confirmer.',
  },

  /* ── BOTSWANA ──────────────────────────────────────────────────────────── */
  {
    title: 'Delta de l’Okavango — saison des crues',
    country: 'Botswana', city: 'Maun', subcategory: 'Safari',
    start: `${YEAR}-06-01`, end: `${YEAR}-09-30`,
    description: "Le delta en eau : safaris en mokoro entre les canaux, faune concentrée, lodges à taille humaine.",
    highlights: ['Safari en pirogue mokoro', 'Delta classé à l’UNESCO', 'Tourisme haut de gamme, faible densité'],
    audience: 'Groupes',
    notes: 'Saison, pas événement daté. Le pic de crue varie d’une année à l’autre.',
  },
  {
    title: 'Safari éléphants — Parc de Chobe',
    country: 'Botswana', city: 'Kasane', subcategory: 'Nature',
    start: `${YEAR}-07-01`, end: `${YEAR}-10-31`,
    description: "La plus forte concentration d'éléphants d'Afrique, observée depuis la rivière Chobe en fin de journée.",
    highlights: ['Safari en bateau', 'Combinable avec les chutes Victoria', 'Saison sèche'],
    audience: 'Familles',
    notes: 'Saison sèche. Aucune date officielle ; à vendre comme fenêtre de départ.',
  },
  {
    title: 'Kuru Dance Festival',
    country: 'Botswana', city: 'D’Kar', subcategory: 'Culture',
    start: `${YEAR}-08-21`, end: `${YEAR}-08-23`,
    description: "Rassemblement des communautés san : danses, chants et artisanat, l'un des rares événements culturels du Kalahari.",
    highlights: ['Culture san', 'Événement rare et confidentiel'],
    audience: 'Grand public',
    notes: 'Fenêtre habituelle : août. Événement à petite échelle, à confirmer auprès du Kuru Art Project.',
  },

  /* ── RWANDA ────────────────────────────────────────────────────────────── */
  {
    title: 'Kwita Izina — baptême des gorilles',
    country: 'Rwanda', city: 'Kinigi', subcategory: 'Nature',
    start: `${YEAR}-09-04`,
    description: "La cérémonie nationale de baptême des bébés gorilles de montagne, vitrine de la conservation rwandaise.",
    highlights: ['Cérémonie officielle', 'À combiner avec le trekking gorilles', 'Forte visibilité médiatique'],
    audience: 'Grand public',
    link: 'https://www.visitrwanda.com',
    notes: 'Se tient habituellement début septembre. Dates 2026 à confirmer auprès du Rwanda Development Board.',
  },
  {
    title: 'Tour du Rwanda',
    country: 'Rwanda', city: 'Kigali', subcategory: 'Sport',
    start: `${YEAR}-02-22`, end: `${YEAR}-03-01`,
    description: "La grande course cycliste africaine, huit étapes dans le pays des mille collines.",
    highlights: ['Course UCI', 'Public nombreux le long des routes', 'Kigali très accessible'],
    audience: 'Grand public',
    notes: 'Fenêtre habituelle : fin février. Dates 2026 à confirmer auprès de la fédération.',
  },
  {
    title: 'Trekking gorilles — Parc des Volcans',
    country: 'Rwanda', city: 'Musanze', subcategory: 'Nature',
    start: `${YEAR}-06-01`, end: `${YEAR}-09-15`,
    description: "La saison sèche, période la plus sûre pour approcher les familles de gorilles de montagne.",
    highlights: ['Permis contingentés', 'Sentiers praticables en saison sèche', 'Expérience premium'],
    audience: 'Groupes',
    notes: 'Saison, pas événement. Les permis sont contingentés : réserver très en amont.',
  },

  /* ── FRANCE ────────────────────────────────────────────────────────────── */
  {
    title: 'Roland-Garros',
    country: 'France', city: 'Paris', subcategory: 'Sport',
    start: `${YEAR}-05-24`, end: `${YEAR}-06-07`,
    description: "Le Grand Chelem sur terre battue, deux semaines de tennis au cœur de Paris.",
    highlights: ['Billetterie par tirage au sort', 'Paris au printemps'],
    audience: 'Grand public',
    link: 'https://www.rolandgarros.com',
    notes: 'Quinzaine habituelle : fin mai à début juin. La billetterie ouvre plusieurs mois avant.',
  },
  {
    title: 'Tour de France',
    country: 'France', subcategory: 'Sport',
    start: `${YEAR}-07-04`, end: `${YEAR}-07-26`,
    description: "Trois semaines de course, accessibles gratuitement au bord des routes : un événement à construire autour d'une étape.",
    highlights: ['Accès gratuit au bord de route', 'Étapes de montagne spectaculaires'],
    audience: 'Familles',
    link: 'https://www.letour.fr',
    notes: 'Le parcours 2026 conditionne le choix de l’étape : arbitrer une fois le tracé publié (octobre).',
  },
  {
    title: 'Festival de Cannes',
    country: 'France', city: 'Cannes', subcategory: 'Culture',
    start: `${YEAR}-05-12`, end: `${YEAR}-05-23`,
    description: "Le festival de cinéma le plus médiatisé au monde, avec projections publiques sur la plage et Côte d'Azur en toile de fond.",
    highlights: ['Projections gratuites Cinéma de la Plage', 'Hébergement à réserver très tôt'],
    audience: 'Jeunes actifs',
    link: 'https://www.festival-cannes.com',
    notes: 'Quinzaine habituelle : mi-mai. Hébergement saturé, à bloquer dès l’automne.',
  },

  /* ── PORTUGAL ──────────────────────────────────────────────────────────── */
  {
    title: 'NOS Alive',
    country: 'Portugal', city: 'Lisbonne', subcategory: 'Musique',
    start: `${YEAR}-07-09`, end: `${YEAR}-07-11`,
    description: "Le grand festival rock et pop de Lisbonne, en bord de Tage, avec des têtes d'affiche internationales.",
    highlights: ['Affiche internationale', 'Lisbonne en juillet', 'Public jeune'],
    audience: 'Jeunes actifs',
    link: 'https://nosalive.com',
    notes: 'Fenêtre habituelle : deuxième semaine de juillet. Dates 2026 à confirmer.',
  },
  {
    title: 'São João do Porto',
    country: 'Portugal', city: 'Porto', subcategory: 'Festival',
    start: `${YEAR}-06-23`, end: `${YEAR}-06-24`,
    description: "La nuit de la Saint-Jean à Porto : toute la ville dans la rue, feux d'artifice sur le Douro et sardines grillées.",
    highlights: ['Date fixe chaque année', 'Fête populaire gratuite', 'Vols directs abordables'],
    audience: 'Jeunes actifs',
    notes: 'Date fixe (nuit du 23 au 24 juin) : la confirmer d’un clic une fois vérifiée.',
  },
  {
    title: 'Web Summit',
    country: 'Portugal', city: 'Lisbonne', subcategory: 'Business',
    start: `${YEAR}-11-09`, end: `${YEAR}-11-12`,
    description: "Le plus grand rendez-vous tech d'Europe : cible naturelle pour un forfait entreprises et jeunes diplômés.",
    highlights: ['Public professionnel', 'Forte demande hôtelière', 'Réseautage international'],
    audience: 'Entreprises',
    link: 'https://websummit.com',
    notes: 'Fenêtre habituelle : novembre. Dates 2026 à confirmer sur le site officiel.',
  },

  /* ── TURQUIE ───────────────────────────────────────────────────────────── */
  {
    title: 'Marathon d’Istanbul',
    country: 'Turkey', city: 'Istanbul', subcategory: 'Sport',
    start: `${YEAR}-11-08`,
    description: "Le seul marathon au monde qui traverse deux continents, du pont du Bosphore à la vieille ville.",
    highlights: ['Course intercontinentale', 'Ville très accessible', 'Novembre, climat doux'],
    audience: 'Groupes',
    notes: 'Fenêtre habituelle : début novembre. Dates 2026 à confirmer.',
  },
  {
    title: 'Vols en montgolfière — Cappadoce',
    country: 'Turkey', city: 'Göreme', subcategory: 'Nature',
    start: `${YEAR}-04-01`, end: `${YEAR}-10-31`,
    description: "Les cheminées de fées vues au lever du soleil : l'image la plus vendeuse de la Turquie.",
    highlights: ['Fort pouvoir d’attraction visuel', 'Saison longue', 'Vols annulables selon la météo'],
    audience: 'Familles',
    notes: 'Saison, pas événement. Prévoir deux nuits sur place : les vols sont souvent reportés pour cause de vent.',
  },
  {
    title: 'Festival international du film d’Antalya',
    country: 'Turkey', city: 'Antalya', subcategory: 'Culture',
    start: `${YEAR}-10-10`, end: `${YEAR}-10-17`,
    description: "Le plus ancien festival de cinéma turc, en octobre, quand la côte méditerranéenne est encore chaude.",
    highlights: ['Arrière-saison balnéaire', 'Combinable avec un séjour plage'],
    audience: 'Grand public',
    notes: 'Fenêtre habituelle : octobre. Dates 2026 à confirmer.',
  },

  /* ── ÉMIRATS ARABES UNIS ───────────────────────────────────────────────── */
  {
    title: 'Grand Prix d’Abu Dhabi — Formule 1',
    country: 'United Arab Emirates', city: 'Abu Dhabi', subcategory: 'Sport',
    start: `${YEAR}-12-04`, end: `${YEAR}-12-06`,
    description: "La finale du championnat sur le circuit de Yas Marina, course en nocturne suivie de concerts.",
    highlights: ['Course + concerts inclus', 'Vols directs depuis l’Afrique de l’Ouest', 'Billetterie chère, à réserver tôt'],
    audience: 'Jeunes actifs',
    link: 'https://www.formula1.com',
    notes: 'Traditionnellement la dernière manche, début décembre. Calendrier F1 2026 à vérifier.',
  },
  {
    title: 'Dubai Shopping Festival',
    country: 'United Arab Emirates', city: 'Dubaï', subcategory: 'Culture',
    start: `${YEAR}-12-06`, end: `${YEAR + 1}-01-12`,
    description: "Six semaines de soldes, de concerts et de feux d'artifice : le motif de voyage le plus courant vers Dubaï.",
    highlights: ['Cible diaspora et familles', 'Hôtellerie très concurrentielle', 'À cheval sur deux années'],
    audience: 'Familles',
    notes: 'Chevauche décembre et janvier : rattaché au plan 2026 côté départ. Dates à confirmer.',
  },
  {
    title: 'Dubai World Cup — courses hippiques',
    country: 'United Arab Emirates', city: 'Dubaï', subcategory: 'Sport',
    start: `${YEAR}-03-28`,
    description: "La journée de courses la mieux dotée au monde, à Meydan, avec un fort protocole vestimentaire et mondain.",
    highlights: ['Événement mondain', 'Une seule journée : forfait court'],
    audience: 'Entreprises',
    notes: 'Se tient habituellement fin mars. Dates 2026 à confirmer.',
  },

  /* ── THAÏLANDE ─────────────────────────────────────────────────────────── */
  {
    title: 'Songkran — nouvel an thaï',
    country: 'Thailand', city: 'Chiang Mai', subcategory: 'Festival',
    start: `${YEAR}-04-13`, end: `${YEAR}-04-15`,
    description: "La bataille d'eau nationale : trois jours de fête dans tout le pays, la plus spectaculaire à Chiang Mai.",
    highlights: ['Dates fixes chaque année', 'Fête populaire gratuite', 'Haute saison, réserver tôt'],
    audience: 'Jeunes actifs',
    notes: 'Dates fixes du 13 au 15 avril : à confirmer d’un clic. Vols et hôtels saturés sur cette période.',
  },
  {
    title: 'Loy Krathong et Yi Peng',
    country: 'Thailand', city: 'Chiang Mai', subcategory: 'Culture',
    start: `${YEAR}-11-24`, end: `${YEAR}-11-25`,
    description: "La fête des lumières : lanternes lâchées dans le ciel et petites embarcations sur les rivières.",
    highlights: ['Images très partageables', 'Climat idéal en novembre'],
    audience: 'Grand public',
    notes: 'Date fixée sur le calendrier lunaire : varie chaque année, à confirmer.',
  },
  {
    title: 'Saison sèche des îles du Sud',
    country: 'Thailand', city: 'Krabi', subcategory: 'Plage & détente',
    start: `${YEAR}-11-01`, end: `${YEAR + 1}-03-31`,
    description: "La fenêtre la plus sûre pour la mer d'Andaman : ciel dégagé, mer calme, ferries assurés.",
    highlights: ['Saison longue', 'Combinable avec Bangkok', 'Hors mousson'],
    audience: 'Familles',
    notes: 'Saison, pas événement daté. Rattachée au plan 2026 pour le départ de novembre.',
  },
];

async function main() {
  const countries = await prisma.tourismCountry.findMany({ select: { name: true } });
  const known = new Set(countries.map(c => c.name));

  const unknown = [...new Set(proposals.map(p => p.country))].filter(c => !known.has(c));
  if (unknown.length) {
    console.warn(`⚠️  Pays absents du catalogue tourisme, propositions ignorées : ${unknown.join(', ')}`);
  }

  let created = 0;
  let updated = 0;

  for (const p of proposals) {
    if (!known.has(p.country)) continue;

    const data = {
      title: p.title,
      country: p.country,
      city: p.city ?? null,
      subcategory: p.subcategory,
      year: YEAR,
      startDate: new Date(p.start),
      endDate: p.end ? new Date(p.end) : null,
      // Fenêtre reprise des éditions précédentes : jamais présentée comme confirmée.
      datesConfirmed: false,
      description: p.description,
      highlights: p.highlights,
      audience: p.audience ?? null,
      link: p.link ?? null,
      internalNotes: p.notes,
      offerIncludes: [] as string[],
      status: 'proposed',
      isPublished: false,
    };

    // Pas de contrainte d'unicité : on déduplique sur (title, country, year).
    const existing = await prisma.tourismEvent.findFirst({
      where: { title: data.title, country: data.country, year: YEAR },
      select: { id: true },
    });

    if (existing) {
      await prisma.tourismEvent.update({ where: { id: existing.id }, data });
      updated++;
    } else {
      await prisma.tourismEvent.create({ data });
      created++;
    }
  }

  const rows = await prisma.tourismEvent.groupBy({
    by: ['country'],
    where: { year: YEAR },
    _count: { _all: true },
  });

  console.log(`✅ Propositions ${YEAR} — ${created} créées, ${updated} mises à jour.`);
  rows
    .sort((a, b) => b._count._all - a._count._all)
    .forEach(r => console.log(`   ${(r.country ?? '—').padEnd(24)} ${r._count._all}`));
  console.log('\nToutes en brouillon, dates non confirmées : à arbitrer depuis l’admin.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
