import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Catalogue de départ des programmes tourisme (story 6.1).
 *
 * Deux sous-catégories seulement : `safari` et `sport`. Ce ne sont pas des étiquettes
 * libres — ce sont les deux seules que le site affiche, via `TourismProgramsSection`
 * injecté dans `SafariAfrica` (safari) et `SportsTourism` (sport). Un programme rangé
 * ailleurs n'apparaîtrait nulle part.
 *
 * Le contenu prolonge ce qui est déjà en dur sur ces deux pages : les quatre destinations
 * safari du site (Botswana, Lesotho, Namibie, Zimbabwe) et les six disciplines sportives
 * (football, course, tennis, rugby, cyclisme, sport mécanique), étendus aux pays déjà
 * présents dans `tourism_countries` (Kenya, Afrique du Sud, Rwanda, Maroc, Turquie,
 * Thaïlande, Portugal, Émirats) pour que catalogue et fiches pays se répondent.
 *
 * ⚠️ **Aucun prix n'est seedé, et rien n'est publié** (`isValidated: false`), pour la même
 * raison que les événements tourisme : l'itinéraire et la saison se documentent, le tarif
 * et le contenu du forfait sont l'offre commerciale de Midzo — ils se saisissent en admin.
 * Chaque fiche est donc une **proposition** : à compléter (prix, devise), puis à publier.
 *
 * ⚠️ Ce qui est **vérifiable** ici : l'existence des parcs, des épreuves et des étapes,
 * la saison conseillée, la logique d'itinéraire. Aucune date d'édition n'est inscrite :
 * les calendriers changent chaque année.
 *
 * Les visuels réutilisent les images déjà employées sur le site (page safari, page sport)
 * ou celles de la fiche pays en base — aucune URL n'est inventée.
 */

type Program = {
  title: string;
  subcategory: 'safari' | 'sport';
  country: string;
  city: string;
  description: string;
  itinerary: string;
  transport: string;
  /** Devise dans laquelle le tarif se négocie sur cette destination. */
  currency: string;
  /** Clé d'image de la page sport ; sinon on retombe sur l'image du pays. */
  sportImage?: keyof typeof SPORT_IMAGES;
};

// Images de la page /services/tourism-safari, pour les pays absents de `tourism_countries`.
const SAFARI_FALLBACK_IMAGES: Record<string, string> = {
  Botswana: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  Lesotho: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  Namibia: 'https://images.unsplash.com/photo-1548017787-de2a60019a2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  Zimbabwe: 'https://images.unsplash.com/photo-1504198416323-30f7bf32fc48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
};

// Images de la page /services/tourism-sports, une par discipline.
const SPORT_IMAGES = {
  football: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  running: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  tennis: 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  rugby: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  cycling: 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  motorsport: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
} as const;

const catalog: Program[] = [
  /* ─── Safari ──────────────────────────────────────────────────────────────── */
  {
    title: 'Delta de l’Okavango & Chobe — le grand Botswana',
    subcategory: 'safari',
    country: 'Botswana',
    city: 'Maun',
    description:
      'Le safari de référence du Botswana : trois nuits en camp au cœur du delta de l’Okavango, où l’on navigue en mokoro entre les papyrus, puis les concentrations d’éléphants de Chobe. Saison sèche (juin–octobre) pour l’observation autour des points d’eau.',
    itinerary:
      'J1 Maun — J2-J4 Delta de l’Okavango (mokoro, safari à pied) — J5-J6 Réserve de Moremi — J7 Savuti — J8-J9 Parc national de Chobe (Kasane) — J10 Retour ou extension chutes Victoria',
    transport: 'Vols légers entre camps (Cessna), 4x4 ouverts avec guide, croisière sur la rivière Chobe',
    currency: 'USD',
  },
  {
    title: 'Chobe & chutes Victoria — safari court',
    subcategory: 'safari',
    country: 'Botswana',
    city: 'Kasane',
    description:
      'Format court pour une première fois en Afrique australe : les éléphants de Chobe au coucher du soleil depuis la rivière, puis les chutes Victoria à une heure de route. Se combine facilement avec un séjour balnéaire.',
    itinerary:
      'J1 Arrivée Kasane — J2 Game drive matinal + croisière sur la Chobe — J3 Passage de frontière et chutes Victoria — J4 Survol en hélicoptère (option) — J5 Départ',
    transport: '4x4 avec guide, bateau à moteur, transferts frontaliers assurés',
    currency: 'USD',
  },
  {
    title: 'Etosha & Damaraland — la Namibie du Nord',
    subcategory: 'safari',
    country: 'Namibia',
    city: 'Windhoek',
    description:
      'Etosha et sa cuvette blanche, où la faune vient à vous aux points d’eau, puis le Damaraland et ses éléphants du désert. Un itinéraire de grands espaces, sur des pistes en bon état, adapté à la conduite autonome.',
    itinerary:
      'J1 Windhoek — J2 Plateau du Waterberg — J3-J5 Parc national d’Etosha — J6-J7 Damaraland (gravures de Twyfelfontein) — J8 Cape Cross — J9-J10 Swakopmund — J11 Windhoek',
    transport: '4x4 de location avec tente de toit, ou véhicule avec chauffeur-guide',
    currency: 'USD',
  },
  {
    title: 'Sossusvlei & côte des Squelettes',
    subcategory: 'safari',
    country: 'Namibia',
    city: 'Swakopmund',
    description:
      'Les dunes rouges de Sossusvlei au lever du jour, Deadvlei et ses acacias pétrifiés, puis la côte des Squelettes et ses colonies d’otaries. Moins de faune, davantage de paysages : le complément idéal d’un safari classique.',
    itinerary:
      'J1 Windhoek — J2-J3 Sesriem & Sossusvlei (Dune 45, Deadvlei) — J4 Canyon de Sesriem — J5 Walvis Bay — J6 Swakopmund & côte des Squelettes — J7 Retour',
    transport: 'Véhicule 4x4, excursion en bateau à Walvis Bay, vol panoramique en option',
    currency: 'USD',
  },
  {
    title: 'Hwange & Mana Pools — le Zimbabwe sauvage',
    subcategory: 'safari',
    country: 'Zimbabwe',
    city: 'Victoria Falls',
    description:
      'Deux parcs très différents : Hwange et ses immenses troupeaux d’éléphants, puis Mana Pools, l’un des rares parcs d’Afrique où le safari à pied est autorisé, sur les rives du Zambèze. Réservé aux voyageurs prêts à marcher.',
    itinerary:
      'J1 Chutes Victoria — J2-J4 Parc national de Hwange — J5 Route vers Kariba — J6-J8 Mana Pools (safari à pied et en canoë) — J9 Harare ou retour',
    transport: 'Vol intérieur Victoria Falls–Mana Pools, 4x4 avec guide agréé, canoë sur le Zambèze',
    currency: 'USD',
  },
  {
    title: 'Chutes Victoria — long week-end',
    subcategory: 'safari',
    country: 'Zimbabwe',
    city: 'Victoria Falls',
    description:
      'Quatre jours sur l’une des plus grandes chutes d’eau du monde : sentiers du parc, croisière au coucher du soleil sur le Zambèze, et activités à sensations (saut à l’élastique, rafting) selon le niveau des eaux.',
    itinerary:
      'J1 Arrivée et sentier des chutes — J2 Croisière sur le Zambèze + village culturel — J3 Rafting ou survol en hélicoptère — J4 Départ',
    transport: 'Transferts aéroport, déplacements à pied en ville, navettes vers les activités',
    currency: 'USD',
  },
  {
    title: 'Le royaume du ciel à cheval — Lesotho',
    subcategory: 'safari',
    country: 'Lesotho',
    city: 'Maseru',
    description:
      'Randonnée à cheval sur les hauts plateaux basotho, à plus de 2 000 m : villages sans route, chutes de Maletsunyane, nuits chez l’habitant. Une destination sans foule, à combiner avec l’Afrique du Sud.',
    itinerary:
      'J1 Maseru — J2 Route vers Semonkong — J3-J4 Randonnée à cheval et chutes de Maletsunyane — J5 Col de Sani ou Thaba-Bosiu — J6 Retour Maseru',
    transport: '4x4 (pistes de montagne), poneys basotho avec guide local',
    currency: 'USD',
  },
  {
    title: 'Masai Mara & vallée du Rift',
    subcategory: 'safari',
    country: 'Kenya',
    city: 'Nairobi',
    description:
      'Le classique kényan : les lacs du Rift et leurs flamants, puis trois nuits dans le Masai Mara. De juillet à octobre, la grande migration des gnous passe par la réserve — période à réserver très en avance.',
    itinerary:
      'J1 Nairobi — J2 Lac Naivasha — J3 Lac Nakuru — J4-J6 Réserve du Masai Mara — J7 Amboseli (vue sur le Kilimandjaro) — J8 Retour Nairobi',
    transport: 'Minibus 4x4 à toit ouvrant avec chauffeur-guide, vol intérieur vers la Mara en option',
    currency: 'USD',
  },
  {
    title: 'Kruger & route panoramique',
    subcategory: 'safari',
    country: 'South Africa',
    city: 'Johannesburg',
    description:
      'Le parc Kruger reste le safari le plus accessible du continent : routes goudronnées, hébergements de tous budgets, conduite autonome possible. La route panoramique (canyon de la Blyde) s’y ajoute sans détour.',
    itinerary:
      'J1 Johannesburg — J2 Route panoramique (canyon de la Blyde, Bourke’s Luck) — J3-J5 Parc national Kruger — J6 Réserve privée de Sabi Sand (option) — J7 Retour',
    transport: 'Voiture de location ou véhicule avec chauffeur, game drives menés par les rangers du parc',
    currency: 'USD',
  },
  {
    title: 'Trek des gorilles des Virunga',
    subcategory: 'safari',
    country: 'Rwanda',
    city: 'Kigali',
    description:
      'Une heure en présence d’une famille de gorilles de montagne dans le parc des Volcans, après une marche exigeante en altitude. Le permis de trekking est délivré en nombre limité et se réserve plusieurs mois à l’avance : il pèse lourd dans le budget total.',
    itinerary:
      'J1 Kigali (mémorial du génocide) — J2 Route vers Musanze — J3 Trek gorilles (parc national des Volcans) — J4 Lac Kivu ou singes dorés — J5 Retour Kigali',
    transport: '4x4 avec chauffeur, marche d’approche de 2 à 6 h selon la famille de gorilles suivie',
    currency: 'USD',
  },

  /* ─── Sport ───────────────────────────────────────────────────────────────── */
  {
    title: 'Marathon de Paris — dossard & séjour',
    subcategory: 'sport',
    country: 'France',
    city: 'Paris',
    description:
      'L’un des plus grands marathons d’Europe, couru au printemps des Champs-Élysées au bois de Boulogne. Les quotas d’inscription partent plusieurs mois à l’avance, et le dossard se retire au salon du running la veille de la course.',
    itinerary:
      'J1 Arrivée et retrait du dossard — J2 Reconnaissance du parcours et repas d’avant-course — J3 Marathon — J4 Récupération et visite libre — J5 Départ',
    transport: 'Vol international, transferts aéroport, transports en commun pendant le séjour',
    currency: 'EUR',
    sportImage: 'running',
  },
  {
    title: 'Roland-Garros — tournoi sur terre battue',
    subcategory: 'sport',
    country: 'France',
    city: 'Paris',
    description:
      'Deux journées de tournoi porte d’Auteuil, en fin de printemps. Les places partent par tirage au sort plusieurs mois avant : le programme se fixe une fois les billets obtenus, court Philippe-Chatrier ou courts annexes.',
    itinerary:
      'J1 Arrivée — J2 Journée de tournoi (session jour) — J3 Seconde journée de tournoi — J4 Paris libre — J5 Départ',
    transport: 'Vol international, transferts, navettes vers le stade',
    currency: 'EUR',
    sportImage: 'tennis',
  },
  {
    title: 'Tour de France — étape de montagne',
    subcategory: 'sport',
    country: 'France',
    city: 'Alpe d’Huez',
    description:
      'Voir passer le peloton dans un col alpestre, au milieu des camping-cars et de la caravane publicitaire. Séjour calé sur une étape de montagne, avec possibilité de monter soi-même le col le matin de la course.',
    itinerary:
      'J1 Arrivée à Grenoble — J2 Montée du col à vélo (facultatif) — J3 Jour d’étape sur le bord de la route — J4 Seconde étape ou détente — J5 Départ',
    transport: 'Vol + train jusqu’à Grenoble, navette montagne, location de vélo de route en option',
    currency: 'EUR',
    sportImage: 'cycling',
  },
  {
    title: 'Tournoi des Six Nations — match à Saint-Denis',
    subcategory: 'sport',
    country: 'France',
    city: 'Saint-Denis',
    description:
      'Un match du Tournoi au Stade de France, en hiver. La billetterie est contingentée par les fédérations et part très vite ; l’ambiance d’avant-match dans les pubs parisiens fait partie du déplacement.',
    itinerary:
      'J1 Arrivée — J2 Jour de match (transfert aller-retour au stade) — J3 Paris libre — J4 Départ',
    transport: 'Vol international, RER et navettes dédiées vers le stade',
    currency: 'EUR',
    sportImage: 'rugby',
  },
  {
    title: 'Premier League — week-end match à Londres',
    subcategory: 'sport',
    country: 'United Kingdom',
    city: 'London',
    description:
      'Un match de Premier League dans l’un des stades londoniens. Les dates définitives sont fixées tardivement par les diffuseurs : le séjour se cale une fois le calendrier télé publié, rarement plus de six semaines avant.',
    itinerary:
      'J1 Arrivée et visite du stade — J2 Jour de match — J3 Londres libre (musées, marchés) — J4 Départ',
    transport: 'Vol international, transports en commun (Oyster), transferts stade',
    currency: 'EUR',
    sportImage: 'football',
  },
  {
    title: 'CAN 2027 — suivre la compétition en Afrique de l’Est',
    subcategory: 'sport',
    country: 'Kenya',
    city: 'Nairobi',
    description:
      'La Coupe d’Afrique des Nations 2027 est organisée conjointement par le Kenya, la Tanzanie et l’Ouganda. Trois pays hôtes, donc des déplacements régionaux entre les matchs : le programme se construit à la publication du calendrier.',
    itinerary:
      'J1 Arrivée à Nairobi — J2 Premier match de poule — J3 Journée libre ou parc national de Nairobi — J4 Deuxième match — J5 Transfert vers la ville hôte suivante — J6-J7 Suite de la compétition — J8 Départ',
    transport: 'Vol international, vols régionaux entre villes hôtes, bus vers les stades',
    currency: 'EUR',
    sportImage: 'football',
  },
  {
    title: 'Two Oceans Marathon — Le Cap',
    subcategory: 'sport',
    country: 'South Africa',
    city: 'Cape Town',
    description:
      'L’ultramarathon sud-africain de 56 km se court au moment de Pâques, entre océan Atlantique et océan Indien, avec la montée de Chapman’s Peak en point d’orgue. Une épreuve de 21 km est proposée en parallèle.',
    itinerary:
      'J1 Arrivée au Cap — J2 Retrait des dossards et reconnaissance — J3 Course — J4 Cape Point et péninsule — J5 Vignobles de Stellenbosch — J6 Départ',
    transport: 'Vol international, voiture de location ou transferts, navettes course',
    currency: 'EUR',
    sportImage: 'running',
  },
  {
    title: 'Marathon international de Marrakech',
    subcategory: 'sport',
    country: 'Morocco',
    city: 'Marrakech',
    description:
      'Marathon d’hiver au climat sec, sur un parcours plat traversant la palmeraie et la médina — l’un des plus accessibles depuis l’Afrique de l’Ouest, sans visa pour la plupart des passeports africains.',
    itinerary:
      'J1 Arrivée et retrait du dossard — J2 Médina et souks — J3 Marathon (ou semi) — J4 Excursion Atlas ou vallée de l’Ourika — J5 Départ',
    transport: 'Vol direct depuis plusieurs capitales africaines, transferts riad, navettes départ de course',
    currency: 'EUR',
    sportImage: 'running',
  },
  {
    title: 'Grand Prix de Formule 1 d’Abu Dhabi',
    subcategory: 'sport',
    country: 'United Arab Emirates',
    city: 'Abu Dhabi',
    description:
      'Le week-end de course sur le circuit de Yas Marina, en fin de saison : essais libres, qualifications et Grand Prix, avec concerts en soirée. Les tribunes les plus demandées se réservent dès l’ouverture de la billetterie.',
    itinerary:
      'J1 Arrivée à Dubaï ou Abu Dhabi — J2 Essais libres — J3 Qualifications — J4 Grand Prix — J5 Désert ou Louvre Abu Dhabi — J6 Départ',
    transport: 'Vol international, transferts hôtel-circuit, navettes Yas Island',
    currency: 'EUR',
    sportImage: 'motorsport',
  },
  {
    title: 'Marathon d’Istanbul — courir entre deux continents',
    subcategory: 'sport',
    country: 'Turkey',
    city: 'Istanbul',
    description:
      'Le seul marathon au monde qui traverse deux continents : départ côté asiatique, passage du pont du Bosphore fermé à la circulation, arrivée dans la vieille ville. Épreuve d’automne, ouverte aussi en 15 km et en marche populaire.',
    itinerary:
      'J1 Arrivée — J2 Sainte-Sophie, Grand Bazar et retrait du dossard — J3 Marathon — J4 Croisière sur le Bosphore — J5 Départ',
    transport: 'Vol international, transferts, navettes vers le départ côté asiatique',
    currency: 'EUR',
    sportImage: 'running',
  },
  {
    title: 'Stage de Muay Thaï — Phuket',
    subcategory: 'sport',
    country: 'Thailand',
    city: 'Phuket',
    description:
      'Les camps de boxe thaïe de l’île accueillent tous les niveaux, débutants inclus, sur des formules à la semaine : deux sessions par jour, hébergement sur place, et soirées de combats professionnels au stade local.',
    itinerary:
      'S1 Arrivée, évaluation du niveau, entraînement biquotidien — Week-end libre (îles Phi Phi) — S2 Entraînement, sparring encadré, soirée de combats — Départ',
    transport: 'Vol international via Bangkok, transfert aéroport, scooter ou navette du camp',
    currency: 'EUR',
  },
  {
    title: 'Stage de surf — Ericeira',
    subcategory: 'sport',
    country: 'Portugal',
    city: 'Ericeira',
    description:
      'Réserve mondiale de surf à moins d’une heure de Lisbonne : une semaine de cours encadrés, des spots adaptés au niveau du groupe, et des vagues praticables une bonne partie de l’année.',
    itinerary:
      'J1 Arrivée de Lisbonne — J2-J4 Cours de surf matin et soir, analyse vidéo — J5 Journée libre (Sintra ou Lisbonne) — J6 Dernière session — J7 Départ',
    transport: 'Vol vers Lisbonne, transfert vers Ericeira, navettes vers les spots avec le matériel',
    currency: 'EUR',
  },
];

async function main() {
  // Visuels : on privilégie l'image de la fiche pays (déjà en base), sinon celle de la
  // page du site. Aucune URL n'est fabriquée : un pays sans image reste sans image.
  const countries = await prisma.tourismCountry.findMany({ select: { name: true, image: true } });
  const countryImage = new Map(countries.map(c => [c.name, c.image]));

  let created = 0;
  let updated = 0;

  for (const p of catalog) {
    const images = [
      p.sportImage ? SPORT_IMAGES[p.sportImage] : null,
      countryImage.get(p.country) ?? SAFARI_FALLBACK_IMAGES[p.country] ?? null,
    ].filter((u): u is string => !!u);

    const data = {
      title: p.title,
      subcategory: p.subcategory,
      country: p.country,
      city: p.city,
      description: p.description,
      itinerary: p.itinerary,
      transport: p.transport,
      // Le prix se saisit en admin : le script ne l'invente pas et ne l'écrase pas
      // non plus s'il a déjà été renseigné (cf. `priceSet` plus bas).
      currency: p.currency,
      images,
    };

    // Pas de contrainte d'unicité sur `title` : déduplication sur (title, subcategory)
    // pour que le script reste rejouable.
    const existing = await prisma.tourismProgram.findFirst({
      where: { title: data.title, subcategory: data.subcategory },
      select: { id: true },
    });

    if (existing) {
      // On respecte le travail fait en admin : prix saisi et publication ne sont
      // pas réécrits par une nouvelle exécution du script.
      await prisma.tourismProgram.update({ where: { id: existing.id }, data });
      updated++;
    } else {
      await prisma.tourismProgram.create({
        data: { ...data, price: null, isValidated: false },
      });
      created++;
    }
  }

  const total = await prisma.tourismProgram.count();
  const published = await prisma.tourismProgram.count({ where: { isValidated: true } });
  const priced = await prisma.tourismProgram.count({ where: { NOT: { price: null } } });
  const bySub = await prisma.tourismProgram.groupBy({ by: ['subcategory'], _count: { _all: true } });
  const byCountry = await prisma.tourismProgram.groupBy({ by: ['country'], _count: { _all: true } });

  console.log(`✅ Programmes tourisme — ${created} créés, ${updated} mis à jour, ${total} en base.`);
  console.log(`   ${published}/${total} publiés · ${priced}/${total} avec un prix (à saisir en admin).`);
  bySub
    .sort((a, b) => b._count._all - a._count._all)
    .forEach(r => console.log(`   ${r.subcategory.padEnd(10)} ${r._count._all}`));
  console.log('   ── pays ──');
  byCountry
    .sort((a, b) => b._count._all - a._count._all)
    .forEach(r => console.log(`   ${r.country.padEnd(22)} ${r._count._all}`));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
