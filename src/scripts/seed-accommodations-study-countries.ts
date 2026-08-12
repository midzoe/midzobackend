import { PrismaClient } from '@prisma/client';
import { studyCountriesSeed } from './data/country-availability';

const prisma = new PrismaClient();

/**
 * Catalogue de départ des logements étudiants (`accommodations`).
 *
 * Périmètre volontairement restreint aux **12 pays d'études** déclarés par
 * `studyCountriesSeed` (src/scripts/data/country-availability.ts) — les mêmes que le
 * catalogue universités : un logement n'a de sens que là où l'étudiant peut être admis.
 * Le `country` reprend donc **exactement** le vocabulaire anglais de `University.country`
 * (« Germany », « United Kingdom »…), qui est aussi la valeur envoyée par le filtre pays
 * de l'écran public (`StudentAccommodation`) alimenté par `useCountries`.
 *
 * Volume : **12 fiches par pays**, réparties sur plusieurs villes universitaires et sur les
 * quatre types (résidence / studio / colocation / famille d'accueil), pour que le filtre
 * ville ou type de l'écran public renvoie toujours quelque chose.
 *
 * Ce qui est **vérifiable** ici : l'organisme (œuvre universitaire, opérateur de
 * résidences, plateforme de colocation), sa ville, son site officiel, son mode
 * d'attribution.
 * Ce qui est **indicatif** : `pricePerMonth`. Un bailleur étudiant publie une fourchette,
 * pas un loyer unique — la valeur posée est l'ordre de grandeur constaté sur la ville, dans
 * la devise locale (`currency`), et doit être ajustée depuis l'admin. La mention est
 * ajoutée à chaque description pour qu'elle reste visible côté site.
 *
 * `images` est laissé vide : une photo générique ne représenterait pas le bâtiment réel.
 * `contact` porte le site officiel quand il existe, et rien plutôt qu'une adresse inventée.
 *
 * Rejouable : déduplication sur (name, country, city).
 */

type Place = {
  name: string;
  city: string;
  type: 'studio' | 'shared' | 'residence' | 'homestay';
  pricePerMonth: number;
  contact?: string;
  description: string;
};

type Block = { country: string; currency: string; places: Place[] };

const catalog: Block[] = [
  /* ─────────────────────────── ROYAUME-UNI ───────────────────────────────── */
  {
    country: 'United Kingdom',
    currency: 'GBP',
    places: [
      {
        name: 'Student Roost',
        city: 'Leeds',
        type: 'residence',
        pricePerMonth: 700,
        contact: 'https://www.studentroost.co.uk',
        description:
          "Réseau national de résidences étudiantes couvrant une vingtaine de villes britanniques, avec chambres en suite et studios, charges et wifi compris. Leeds concentre plus de 60 000 étudiants pour des loyers très inférieurs à Londres.",
      },
      {
        name: 'Fresh Student Living',
        city: 'Sheffield',
        type: 'residence',
        pricePerMonth: 620,
        contact: 'https://www.freshstudentliving.co.uk',
        description:
          "Résidences privées implantées près des campus de Sheffield, avec des contrats de 44 ou 51 semaines. Sheffield figure régulièrement parmi les villes étudiantes les moins chères du Royaume-Uni.",
      },
      {
        name: 'University of Glasgow — Résidences universitaires',
        city: 'Glasgow',
        type: 'residence',
        pricePerMonth: 720,
        contact: 'https://www.gla.ac.uk',
        description:
          "Logement universitaire garanti aux étudiants internationaux de première année qui candidatent avant la date limite. Chambres en suite ou partagées, charges incluses, sur le campus ou à proximité immédiate.",
      },
      {
        name: 'University of Cambridge — Colleges',
        city: 'Cambridge',
        type: 'residence',
        pricePerMonth: 900,
        contact: 'https://www.cam.ac.uk',
        description:
          "À Cambridge, le logement passe par le college d'affectation, qui héberge la quasi-totalité de ses étudiants pendant la durée du cursus. Aucune recherche sur le marché privé n'est nécessaire à l'arrivée.",
      },
      {
        name: 'Vita Student',
        city: 'Bristol',
        type: 'studio',
        pricePerMonth: 1050,
        contact: 'https://www.vitastudent.com',
        description:
          "Studios tout inclus (charges, ménage des parties communes, salle de sport, salles d'étude) au cœur de Bristol. Segment haut de gamme, à mettre en regard du budget d'une chambre en maison partagée.",
      },
      {
        name: 'Collegiate UK',
        city: 'Nottingham',
        type: 'studio',
        pricePerMonth: 800,
        contact: 'https://www.collegiate-ac.com',
        description:
          "Studios meublés avec cuisine privative dans les grandes villes universitaires anglaises. Nottingham, avec ses deux universités, offre un marché étudiant abondant et des loyers modérés.",
      },
      {
        name: 'Rightmove — colocation étudiante',
        city: 'Leeds',
        type: 'shared',
        pricePerMonth: 500,
        contact: 'https://www.rightmove.co.uk',
        description:
          "Premier portail immobilier britannique, utilisé pour trouver une chambre en maison partagée via une agence. Les groupes d'étudiants signent un bail commun pour l'année entière, souvent dès février pour la rentrée suivante.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'Cardiff',
        type: 'homestay',
        pricePerMonth: 550,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant à Cardiff, capitale galloise où le coût de la vie est nettement inférieur à celui du Sud-Est anglais. Formule adaptée à une première année ou à un semestre d'échange.",
      },
      {
        name: 'Unite Students',
        city: 'London',
        type: 'residence',
        pricePerMonth: 1150,
        contact: 'https://www.unitestudents.com',
        description:
          "Premier opérateur de résidences étudiantes du Royaume-Uni : chambres en suite et studios, charges, wifi et assurance inclus, contrat calé sur l'année universitaire. Réservation ouverte dès l'obtention de l'admission.",
      },
      {
        name: 'iQ Student Accommodation',
        city: 'Manchester',
        type: 'studio',
        pricePerMonth: 850,
        contact: 'https://www.iqstudentaccommodation.com',
        description:
          "Studios meublés avec cuisine privative, salle de sport et espaces de travail. Manchester reste l'une des grandes villes étudiantes les plus abordables du pays face à Londres.",
      },
      {
        name: 'SpareRoom — colocation étudiante',
        city: 'Birmingham',
        type: 'shared',
        pricePerMonth: 550,
        contact: 'https://www.spareroom.co.uk',
        description:
          "Plateforme britannique de référence pour la 'house share' : chambre en maison partagée entre étudiants, souvent charges comprises. Un garant au Royaume-Uni ou six mois de loyer d'avance sont fréquemment demandés.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'Edinburgh',
        type: 'homestay',
        pricePerMonth: 700,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant, petit-déjeuner généralement inclus. Formule utile pour les premières semaines, le temps de visiter et de sécuriser un logement longue durée sur place.",
      },
    ],
  },

  /* ─────────────────────────── ÉTATS-UNIS ────────────────────────────────── */
  {
    country: 'United States',
    currency: 'USD',
    places: [
      {
        name: 'New York University — Residence Halls',
        city: 'New York',
        type: 'residence',
        pricePerMonth: 1800,
        contact: 'https://www.nyu.edu',
        description:
          "Résidences universitaires réparties dans Manhattan et Brooklyn, attribuées par tirage au sort après la première année. Le logement sur le campus reste la seule option abordable pour un étudiant international à New York.",
      },
      {
        name: 'University of Michigan — Residence Halls',
        city: 'Ann Arbor',
        type: 'residence',
        pricePerMonth: 1100,
        contact: 'https://housing.umich.edu',
        description:
          "Logement garanti aux étudiants de première année sur l'un des plus grands campus publics du pays. Le tarif est facturé par semestre et inclut un plan repas, à intégrer au budget global.",
      },
      {
        name: 'Purdue University — Residence Halls',
        city: 'West Lafayette',
        type: 'residence',
        pricePerMonth: 900,
        contact: 'https://www.purdue.edu',
        description:
          "Campus du Midwest réputé en ingénierie, avec un coût de logement parmi les plus bas des grandes universités publiques américaines. Chambres doubles ou simples, contrat calé sur l'année académique.",
      },
      {
        name: 'University of Texas at Austin — On-campus housing',
        city: 'Austin',
        type: 'residence',
        pricePerMonth: 1200,
        contact: 'https://housing.utexas.edu',
        description:
          "Résidences universitaires sur le campus d'Austin, avec plan repas inclus dans la plupart des formules. La demande dépasse largement l'offre : candidater dès la confirmation d'admission.",
      },
      {
        name: 'Greystar Student Living',
        city: 'Chicago',
        type: 'studio',
        pricePerMonth: 1250,
        contact: 'https://www.greystar.com',
        description:
          "Résidences privées meublées gérées par l'un des premiers opérateurs immobiliers américains, implantées près des grands campus urbains. Bail individuel par chambre et charges généralement incluses.",
      },
      {
        name: 'Craigslist — colocation étudiante',
        city: 'Seattle',
        type: 'shared',
        pricePerMonth: 1100,
        contact: 'https://www.craigslist.org',
        description:
          "Petites annonces de référence aux États-Unis pour la chambre en appartement partagé. Ne jamais verser de dépôt avant d'avoir visité ou fait visiter par un tiers de confiance : les arnaques y sont fréquentes.",
      },
      {
        name: 'Roommates.com — recherche de colocataires',
        city: 'San Francisco',
        type: 'shared',
        pricePerMonth: 1400,
        contact: 'https://www.roommates.com',
        description:
          "Plateforme de mise en relation entre colocataires, avec profils vérifiés. Utile sur la baie de San Francisco, où le loyer d'un logement individuel dépasse le budget de la plupart des étudiants.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'San Diego',
        type: 'homestay',
        pricePerMonth: 1100,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant en Californie du Sud, souvent avec petit-déjeuner. Solution privilégiée pour un programme de langue ou un premier semestre, sans dépôt de garantie ni cosignataire américain.",
      },
      {
        name: 'Boston University — Residence Halls',
        city: 'Boston',
        type: 'residence',
        pricePerMonth: 1300,
        contact: 'https://www.bu.edu/housing/',
        description:
          "Logement sur le campus, garanti aux étudiants de première année. Le tarif se règle par semestre et inclut souvent un plan repas obligatoire, à budgéter en plus du loyer.",
      },
      {
        name: 'American Campus Communities',
        city: 'Austin',
        type: 'studio',
        pricePerMonth: 1000,
        contact: 'https://www.americancampus.com',
        description:
          "Premier opérateur privé de logements étudiants aux États-Unis, implanté à proximité immédiate des grands campus. Bail individuel par chambre (chacun n'est engagé que sur sa part), meublé et charges incluses.",
      },
      {
        name: 'Colocation hors campus (off-campus housing)',
        city: 'Los Angeles',
        type: 'shared',
        pricePerMonth: 1200,
        contact: '',
        description:
          "Appartement partagé entre étudiants, la solution la plus courante à partir de la deuxième année. Prévoir dépôt de garantie, justificatifs de revenus ou cosignataire américain, et l'ameublement à la charge du locataire.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'New York',
        type: 'homestay',
        pricePerMonth: 1400,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant à New York, souvent hors Manhattan. Formule d'atterrissage sans dépôt lourd ni bail long, le temps de finaliser un logement proche du campus.",
      },
    ],
  },

  /* ─────────────────────────── CANADA ────────────────────────────────────── */
  {
    country: 'Canada',
    currency: 'CAD',
    places: [
      {
        name: 'UBC — Student Housing',
        city: 'Vancouver',
        type: 'residence',
        pricePerMonth: 1100,
        contact: 'https://vancouver.housing.ubc.ca',
        description:
          "Le plus grand parc de logements universitaires du Canada, sur le campus de Point Grey. Place garantie aux étudiants internationaux de première année qui répondent dans les délais à l'offre d'admission.",
      },
      {
        name: 'McGill — Résidences universitaires',
        city: 'Montréal',
        type: 'residence',
        pricePerMonth: 1150,
        contact: 'https://www.mcgill.ca',
        description:
          "Résidences du campus du centre-ville, garanties aux nouveaux étudiants de premier cycle. Formules avec plan repas obligatoire en résidence traditionnelle, ou en appartement pour les cycles supérieurs.",
      },
      {
        name: 'Université Laval — Résidences',
        city: 'Québec',
        type: 'residence',
        pricePerMonth: 550,
        contact: 'https://www.residences.ulaval.ca',
        description:
          "Chambres sur le campus de Sainte-Foy à l'un des tarifs les plus bas du pays, avec accès direct au réseau de tunnels souterrains l'hiver. Priorité aux étudiants internationaux à leur arrivée.",
      },
      {
        name: 'University of Alberta — Residence',
        city: 'Edmonton',
        type: 'residence',
        pricePerMonth: 800,
        contact: 'https://www.ualberta.ca',
        description:
          "Résidences universitaires d'Edmonton, dans une province où le coût du logement reste très inférieur à Toronto et Vancouver. Chambres et appartements meublés, contrats de 8 ou 12 mois.",
      },
      {
        name: 'Rentals.ca — studio meublé',
        city: 'Calgary',
        type: 'studio',
        pricePerMonth: 1300,
        contact: 'https://rentals.ca',
        description:
          "Portail national de location, utile pour un studio meublé hors campus. Prévoir un dépôt d'un demi-mois de loyer et, à défaut d'historique de crédit canadien, plusieurs mois payés d'avance.",
      },
      {
        name: 'Places4Students',
        city: 'Ottawa',
        type: 'shared',
        pricePerMonth: 800,
        contact: 'https://www.places4students.com',
        description:
          "Service de logement hors campus référencé par de nombreuses universités canadiennes : chambres en colocation et recherche de colocataires, filtrées par établissement.",
      },
      {
        name: 'Canada Homestay Network',
        city: 'Vancouver',
        type: 'homestay',
        pricePerMonth: 1100,
        contact: 'https://www.canadahomestaynetwork.ca',
        description:
          "Familles d'accueil sélectionnées et suivies en Colombie-Britannique, repas inclus. Alternative crédible au marché locatif de Vancouver, le plus tendu du pays.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'Ottawa',
        type: 'homestay',
        pricePerMonth: 900,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant dans la capitale fédérale, ville bilingue et bien desservie. Formule d'atterrissage utile avant de signer un bail d'un an, la norme en Ontario.",
      },
      {
        name: 'University of Toronto — Résidences universitaires',
        city: 'Toronto',
        type: 'residence',
        pricePerMonth: 1250,
        contact: 'https://www.utoronto.ca',
        description:
          "Résidences des collèges de l'université, en formule avec ou sans plan repas. Places garanties aux nouveaux arrivants qui candidatent dans les délais, très demandées ensuite.",
      },
      {
        name: 'GEC Living',
        city: 'Vancouver',
        type: 'studio',
        pricePerMonth: 1300,
        contact: 'https://www.gecliving.com',
        description:
          "Résidences privées meublées destinées aux étudiants internationaux de Vancouver et Burnaby, charges et internet inclus. Marché locatif de Vancouver parmi les plus tendus du pays.",
      },
      {
        name: 'Kijiji — colocation étudiante',
        city: 'Montréal',
        type: 'shared',
        pricePerMonth: 700,
        contact: 'https://www.kijiji.ca',
        description:
          "Chambre en appartement partagé à Montréal, la grande ville universitaire la moins chère du Canada. Attention au calendrier : la majorité des baux québécois démarrent le 1er juillet.",
      },
      {
        name: 'Canada Homestay Network',
        city: 'Toronto',
        type: 'homestay',
        pricePerMonth: 1000,
        contact: 'https://www.canadahomestaynetwork.ca',
        description:
          "Réseau national de familles d'accueil sélectionnées et suivies, avec repas inclus. Solution privilégiée par les étudiants mineurs et les primo-arrivants.",
      },
    ],
  },

  /* ─────────────────────────── ALLEMAGNE ─────────────────────────────────── */
  {
    country: 'Germany',
    currency: 'EUR',
    places: [
      {
        name: 'Studierendenwerk Frankfurt am Main',
        city: 'Frankfurt',
        type: 'residence',
        pricePerMonth: 380,
        contact: 'https://www.studentenwerkfrankfurt.de',
        description:
          "Œuvre universitaire de Francfort et de la région Rhin-Main : cités universitaires à loyer encadré dans une ville où le marché privé est tiré par le secteur bancaire. Candidature en ligne dès l'admission.",
      },
      {
        name: 'Studierendenwerk Heidelberg',
        city: 'Heidelberg',
        type: 'residence',
        pricePerMonth: 340,
        contact: 'https://www.stw.uni-heidelberg.de',
        description:
          "Places en Wohnheim pour les étudiants de la plus ancienne université d'Allemagne. Ville étudiante compacte où la cité universitaire évite un marché privé restreint et cher.",
      },
      {
        name: 'Studierendenwerk Dresden',
        city: 'Dresden',
        type: 'residence',
        pricePerMonth: 280,
        contact: 'https://www.studentenwerk-dresden.de',
        description:
          "L'un des parcs de logement étudiant les plus abordables d'Allemagne, dans une grande ville universitaire de l'Est. Les délais d'attente y sont sensiblement plus courts qu'à Munich ou Berlin.",
      },
      {
        name: 'Studierendenwerk Aachen',
        city: 'Aachen',
        type: 'residence',
        pricePerMonth: 320,
        contact: 'https://www.studierendenwerk-aachen.de',
        description:
          "Cités universitaires d'Aix-la-Chapelle, ville d'ingénieurs adossée à la RWTH. Position frontalière avec la Belgique et les Pays-Bas, loyers nettement inférieurs à la moyenne ouest-allemande.",
      },
      {
        name: 'Studierendenwerk Stuttgart',
        city: 'Stuttgart',
        type: 'residence',
        pricePerMonth: 400,
        contact: 'https://www.studierendenwerk-stuttgart.de',
        description:
          "Logements étudiants publics dans la capitale du Bade-Wurtemberg. Le marché privé y est tendu par l'industrie automobile : la place en Wohnheim est décisive pour tenir le budget.",
      },
      {
        name: 'THE FIZZ',
        city: 'Berlin',
        type: 'studio',
        pricePerMonth: 700,
        contact: 'https://www.the-fizz.com',
        description:
          "Studios meublés tout inclus à Berlin, réservables en ligne depuis l'étranger et sans garant allemand. Option de repli quand la liste d'attente du Studierendenwerk dépasse la rentrée.",
      },
      {
        name: 'WG-Gesucht — colocation (WG)',
        city: 'Leipzig',
        type: 'shared',
        pricePerMonth: 350,
        contact: 'https://www.wg-gesucht.de',
        description:
          "Chambre en colocation à Leipzig, ville étudiante en forte croissance où les loyers restent parmi les plus bas des grandes villes allemandes. Sélection par entretien avec les colocataires.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'Bonn',
        type: 'homestay',
        pricePerMonth: 450,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant à Bonn, ville universitaire à taille humaine sur le Rhin. Immersion linguistique utile avant un cursus enseigné en allemand.",
      },
      {
        name: 'Studierendenwerk Berlin',
        city: 'Berlin',
        type: 'residence',
        pricePerMonth: 350,
        contact: 'https://www.stw.berlin',
        description:
          "Œuvre universitaire officielle de Berlin : près de 9 500 places en cité universitaire à des loyers très inférieurs au marché privé. Candidature à déposer dès l'admission, les listes d'attente se comptent en semestres.",
      },
      {
        name: 'Studierendenwerk München Oberbayern',
        city: 'Munich',
        type: 'residence',
        pricePerMonth: 400,
        contact: 'https://www.studierendenwerk-muenchen-oberbayern.de',
        description:
          "Cités universitaires de Munich et de Haute-Bavière. Munich étant la ville la plus chère d'Allemagne, la place en Wohnheim y fait une différence décisive sur le budget.",
      },
      {
        name: 'WG-Gesucht — colocation (WG)',
        city: 'Hamburg',
        type: 'shared',
        pricePerMonth: 480,
        contact: 'https://www.wg-gesucht.de',
        description:
          "Plateforme de référence pour la Wohngemeinschaft, mode de logement étudiant le plus répandu en Allemagne. La sélection se fait par entretien avec les colocataires, souvent en visio depuis l'étranger.",
      },
      {
        name: 'THE FIZZ',
        city: 'Cologne',
        type: 'studio',
        pricePerMonth: 620,
        contact: 'https://www.the-fizz.com',
        description:
          "Studios meublés tout inclus (charges, internet, espaces communs) dans plusieurs villes universitaires allemandes. Contrat court possible, utile pour un semestre d'échange.",
      },
    ],
  },

  /* ─────────────────────────── FRANCE ────────────────────────────────────── */
  {
    country: 'France',
    currency: 'EUR',
    places: [
      {
        name: 'Crous de Lyon — Résidences universitaires',
        city: 'Lyon',
        type: 'residence',
        pricePerMonth: 350,
        contact: 'https://www.crous-lyon.fr',
        description:
          "Logement public à loyer encadré dans la deuxième ville étudiante de France. Réservation en ligne via Trouver un logement, ouverte l'été aux étudiants internationaux non boursiers.",
      },
      {
        name: 'Crous de Bordeaux Aquitaine — Résidences universitaires',
        city: 'Bordeaux',
        type: 'residence',
        pricePerMonth: 340,
        contact: 'https://www.crous-bordeaux.fr',
        description:
          "Résidences universitaires du campus de Talence-Pessac-Gradignan, l'un des plus vastes de France. Chambres rénovées et studios, éligibles aux APL.",
      },
      {
        name: 'Crous de Montpellier — Résidences universitaires',
        city: 'Montpellier',
        type: 'residence',
        pricePerMonth: 330,
        contact: 'https://www.crous-montpellier.fr',
        description:
          "Ville où l'étudiant représente près d'un habitant sur cinq : l'offre Crous y est dense, mais la demande sature dès juillet. Déposer le dossier dès l'admission.",
      },
      {
        name: 'Cité internationale universitaire de Paris',
        city: 'Paris',
        type: 'residence',
        pricePerMonth: 550,
        contact: 'https://www.ciup.fr',
        description:
          "Campus de 43 maisons dans le 14e arrondissement, dédié aux étudiants et chercheurs internationaux. Admission sur dossier académique, avec un brassage de nationalités que le marché privé parisien n'offre pas.",
      },
      {
        name: 'Les Estudines',
        city: 'Paris',
        type: 'studio',
        pricePerMonth: 750,
        contact: 'https://www.estudines.com',
        description:
          "Résidences étudiantes privées du groupe Réside Études, en Île-de-France et en région : studios meublés éligibles aux APL, services inclus. Garant exigé, Visale accepté.",
      },
      {
        name: 'Cardinal Campus',
        city: 'Lyon',
        type: 'studio',
        pricePerMonth: 620,
        contact: 'https://www.cardinalcampus.fr',
        description:
          "Opérateur lyonnais de résidences étudiantes : studios meublés avec espaces communs, dans plusieurs villes de la région. Baux de 9 ou 12 mois selon le calendrier universitaire.",
      },
      {
        name: 'La Carte des Colocs — colocation',
        city: 'Nantes',
        type: 'shared',
        pricePerMonth: 420,
        contact: 'https://www.lacartedescolocs.fr',
        description:
          "Plateforme française dédiée à la colocation, avec recherche cartographique par quartier. Nantes combine un marché étudiant important et des loyers inférieurs à Paris ou Lyon.",
      },
      {
        name: 'Leboncoin — colocation étudiante',
        city: 'Rennes',
        type: 'shared',
        pricePerMonth: 400,
        contact: 'https://www.leboncoin.fr',
        description:
          "Premier site d'annonces entre particuliers en France, très utilisé pour la chambre en colocation. Ne verser aucun acompte avant la signature d'un bail et la visite du logement.",
      },
      {
        name: 'Crous de Paris — Résidences universitaires',
        city: 'Paris',
        type: 'residence',
        pricePerMonth: 400,
        contact: 'https://trouverunlogement.lescrous.fr',
        description:
          "Logement étudiant public à loyer encadré, attribué sur critères sociaux via le Dossier social étudiant (DSE). Les étudiants internationaux hors boursiers passent par la plateforme de réservation en ligne, ouverte l'été.",
      },
      {
        name: 'Nexity Studéa',
        city: 'Lyon',
        type: 'studio',
        pricePerMonth: 600,
        contact: 'https://www.nexity-studea.com',
        description:
          "Première chaîne privée de résidences étudiantes en France : studios meublés éligibles aux APL, avec services inclus. Garant exigé — la garantie d'État Visale est acceptée.",
      },
      {
        name: 'Studapart — colocation',
        city: 'Toulouse',
        type: 'shared',
        pricePerMonth: 420,
        contact: 'https://www.studapart.com',
        description:
          "Plateforme partenaire de nombreux établissements français, avec dossier en ligne et garant intégré pour les étudiants étrangers. Chambre en colocation meublée.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'Lille',
        type: 'homestay',
        pricePerMonth: 500,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant avec accès cuisine, souvent la solution la plus simple à sécuriser depuis l'étranger : pas de garant ni de dépôt de garantie important.",
      },
    ],
  },

  /* ─────────────────────────── PAYS-BAS ──────────────────────────────────── */
  {
    country: 'Netherlands',
    currency: 'EUR',
    places: [
      {
        name: 'DUWO',
        city: 'Leiden',
        type: 'residence',
        pricePerMonth: 520,
        contact: 'https://www.duwo.nl',
        description:
          "Logements réservés aux étudiants internationaux de l'université de Leyde, attribués en amont de la rentrée via l'établissement. Chambres meublées, contrat calé sur le semestre ou l'année.",
      },
      {
        name: 'SSH Student Housing',
        city: 'Nijmegen',
        type: 'residence',
        pricePerMonth: 430,
        contact: 'https://www.sshxl.nl',
        description:
          "Chambres étudiantes à Nimègue, ville universitaire du sud-est où les loyers restent contenus. Contingent réservé aux internationaux, attribué avant l'arrivée.",
      },
      {
        name: 'Vestide',
        city: 'Eindhoven',
        type: 'residence',
        pricePerMonth: 450,
        contact: 'https://www.vestide.nl',
        description:
          "Bailleur étudiant d'Eindhoven, partenaire de la TU/e pour le logement des étudiants internationaux. Chambres et studios meublés à proximité du campus.",
      },
      {
        name: 'The Social Hub (ex-The Student Hotel)',
        city: 'Eindhoven',
        type: 'studio',
        pricePerMonth: 850,
        contact: 'https://www.thesocialhub.co',
        description:
          "Studios tout inclus mêlant étudiants, jeunes actifs et voyageurs, avec espaces de coworking et salle de sport. Réservation en ligne au mois, sans garant néerlandais.",
      },
      {
        name: 'Pararius — studio meublé',
        city: 'Rotterdam',
        type: 'studio',
        pricePerMonth: 900,
        contact: 'https://www.pararius.com',
        description:
          "Portail locatif néerlandais en anglais, orienté marché privé. Prévoir un revenu ou un garant représentant trois à quatre fois le loyer, exigence standard des agences.",
      },
      {
        name: 'HousingAnywhere',
        city: 'Rotterdam',
        type: 'shared',
        pricePerMonth: 600,
        contact: 'https://housinganywhere.com',
        description:
          "Plateforme née à Rotterdam pour la réservation de chambres à distance, avec contrat et paiement sécurisés. Conçue pour l'étudiant qui ne peut pas visiter avant son arrivée.",
      },
      {
        name: 'Kamernet — colocation',
        city: 'Maastricht',
        type: 'shared',
        pricePerMonth: 500,
        contact: 'https://kamernet.nl',
        description:
          "Chambre en colocation à Maastricht, ville la plus internationale du pays rapportée à sa taille. La sélection passe souvent par une visite collective (hospiteren) organisée par les colocataires.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'Utrecht',
        type: 'homestay',
        pricePerMonth: 550,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant à Utrecht, au centre du pays et à vingt minutes d'Amsterdam en train. Solution de transition face à une pénurie structurelle de logements étudiants.",
      },
      {
        name: 'DUWO',
        city: 'Delft',
        type: 'residence',
        pricePerMonth: 500,
        contact: 'https://www.duwo.nl',
        description:
          "Premier bailleur étudiant des Pays-Bas (Delft, Leyde, Amsterdam, La Haye), partenaire direct des universités pour les logements réservés aux internationaux. Inscription payante à la liste d'attente.",
      },
      {
        name: 'SSH Student Housing',
        city: 'Utrecht',
        type: 'residence',
        pricePerMonth: 480,
        contact: 'https://www.sshxl.nl',
        description:
          "Chambres et studios dans huit villes universitaires néerlandaises, dont un contingent réservé aux étudiants internationaux attribué avant la rentrée.",
      },
      {
        name: 'Xior Student Housing',
        city: 'Amsterdam',
        type: 'studio',
        pricePerMonth: 800,
        contact: 'https://www.xior.be',
        description:
          "Studios meublés tout inclus près des campus d'Amsterdam. Le marché amstellodamois est le plus cher et le plus tendu du pays : réserver plusieurs mois à l'avance.",
      },
      {
        name: 'Kamernet — colocation',
        city: 'Groningen',
        type: 'shared',
        pricePerMonth: 450,
        contact: 'https://kamernet.nl',
        description:
          "Plateforme néerlandaise de chambres en colocation. Groningue, ville universitaire à taille humaine, offre l'un des meilleurs rapports loyer/qualité de vie du pays.",
      },
    ],
  },

  /* ─────────────────────────── ESPAGNE ───────────────────────────────────── */
  {
    country: 'Spain',
    currency: 'EUR',
    places: [
      {
        name: 'Colegios Mayores — Universidad Complutense de Madrid',
        city: 'Madrid',
        type: 'residence',
        pricePerMonth: 850,
        contact: 'https://www.ucm.es',
        description:
          "Les colegios mayores de la Complutense combinent hébergement, restauration et vie culturelle sur le campus de Moncloa. Admission sur dossier, avec un fort ancrage associatif propre au modèle espagnol.",
      },
      {
        name: 'Micampus Residencias',
        city: 'Madrid',
        type: 'residence',
        pricePerMonth: 900,
        contact: 'https://www.micampusresidencia.com',
        description:
          "Réseau de résidences privées près des grands campus espagnols, en pension complète ou demi-pension. Réservation en ligne possible depuis l'étranger, sans garant espagnol.",
      },
      {
        name: 'Nexo Residencias',
        city: 'Sevilla',
        type: 'residence',
        pricePerMonth: 750,
        contact: 'https://www.nexoresidencias.com',
        description:
          "Résidences universitaires à Séville et dans d'autres villes espagnoles, avec chambres individuelles et services inclus. Formules à l'année universitaire ou au semestre.",
      },
      {
        name: 'Yugo',
        city: 'Barcelona',
        type: 'studio',
        pricePerMonth: 950,
        contact: 'https://yugo.com',
        description:
          "Opérateur international de résidences étudiantes présent à Barcelone : studios meublés, charges et wifi inclus, espaces communs. Réservation en ligne et contrat en anglais.",
      },
      {
        name: 'Uniplaces — chambre en colocation',
        city: 'Madrid',
        type: 'shared',
        pricePerMonth: 500,
        contact: 'https://www.uniplaces.com',
        description:
          "Réservation à distance d'une chambre meublée à Madrid, contrat signé en ligne avant l'arrivée. Le piso compartido reste le mode de logement le plus courant chez les étudiants espagnols.",
      },
      {
        name: 'Badi — piso compartido',
        city: 'Barcelona',
        type: 'shared',
        pricePerMonth: 550,
        contact: 'https://badi.com',
        description:
          "Plateforme barcelonaise de colocation avec profils vérifiés et paiement du loyer intégré. Marché barcelonais très tendu : viser les quartiers desservis par le métro plutôt que le centre historique.",
      },
      {
        name: 'Idealista — piso compartido',
        city: 'Granada',
        type: 'shared',
        pricePerMonth: 280,
        contact: 'https://www.idealista.com',
        description:
          "Grenade offre parmi les loyers étudiants les plus bas d'Espagne pour une ville universitaire majeure. Chambre en appartement partagé, souvent charges comprises dans le centre.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'Salamanca',
        type: 'homestay',
        pricePerMonth: 500,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant à Salamanque, référence historique pour l'apprentissage de l'espagnol. Repas souvent inclus et immersion linguistique immédiate.",
      },
      {
        name: 'Resa — Residencias de Estudiantes',
        city: 'Madrid',
        type: 'residence',
        pricePerMonth: 900,
        contact: 'https://www.resa.es',
        description:
          "Premier réseau de résidences étudiantes d'Espagne, en pension complète ou demi-pension, ménage et activités inclus. Formules au semestre ou à l'année universitaire.",
      },
      {
        name: 'Livensa Living',
        city: 'Barcelona',
        type: 'studio',
        pricePerMonth: 950,
        contact: 'https://www.livensaliving.com',
        description:
          "Studios individuels meublés avec espaces communs (salle de sport, coworking) à Barcelone. Réservation en ligne possible depuis l'étranger, sans garant espagnol.",
      },
      {
        name: 'Idealista — piso compartido',
        city: 'Valencia',
        type: 'shared',
        pricePerMonth: 350,
        contact: 'https://www.idealista.com',
        description:
          "Plateforme immobilière de référence en Espagne. La chambre en 'piso compartido' reste le logement étudiant le plus courant, et Valence figure parmi les grandes villes les moins chères.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'Sevilla',
        type: 'homestay',
        pricePerMonth: 600,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant avec repas, très répandue en Andalousie. Immersion linguistique utile aux étudiants inscrits dans un cursus enseigné en espagnol.",
      },
    ],
  },

  /* ─────────────────────────── SUÈDE ─────────────────────────────────────── */
  {
    country: 'Sweden',
    currency: 'SEK',
    places: [
      {
        name: 'Uppsalahem — logement étudiant',
        city: 'Uppsala',
        type: 'residence',
        pricePerMonth: 4500,
        contact: 'https://www.uppsalahem.se',
        description:
          "Bailleur municipal d'Uppsala et principal pourvoyeur de logements étudiants de la ville. Attribution à l'ancienneté dans la file d'attente : s'inscrire le jour de l'admission.",
      },
      {
        name: 'Lund University Accommodation',
        city: 'Lund',
        type: 'residence',
        pricePerMonth: 4600,
        contact: 'https://www.lunduniversity.lu.se',
        description:
          "Contingent de logements réservé par l'université aux étudiants internationaux en échange ou en master, garanti si la demande est déposée dans la fenêtre officielle.",
      },
      {
        name: 'Studentbostäder i Linköping',
        city: 'Linköping',
        type: 'residence',
        pricePerMonth: 4200,
        contact: 'https://www.studentbostader.se',
        description:
          "Parc de logements étudiants de Linköping, ville universitaire technologique du sud de la Suède. Loyers modérés et délais d'attente plus courts qu'à Stockholm.",
      },
      {
        name: 'Bostaden — Umeå',
        city: 'Umeå',
        type: 'residence',
        pricePerMonth: 3800,
        contact: 'https://www.bostaden.umea.se',
        description:
          "Bailleur municipal d'Umeå, dans le nord du pays : l'un des meilleurs rapports offre/demande de Suède pour un étudiant, avec des loyers parmi les plus bas.",
      },
      {
        name: 'KTH Accommodation',
        city: 'Stockholm',
        type: 'studio',
        pricePerMonth: 6000,
        contact: 'https://www.kth.se',
        description:
          "Chambres et studios réservés par l'Institut royal de technologie à ses étudiants internationaux. Offre limitée mais décisive dans une ville où le marché locatif libre est quasi inaccessible.",
      },
      {
        name: 'Boplats Göteborg',
        city: 'Göteborg',
        type: 'shared',
        pricePerMonth: 4200,
        contact: 'https://www.boplats.se',
        description:
          "File d'attente municipale de Göteborg, ouverte aux étudiants pour les chambres et petits logements. Inscription gratuite et ancienneté déterminante dans l'attribution.",
      },
      {
        name: 'Qasa — sous-location',
        city: 'Stockholm',
        type: 'shared',
        pricePerMonth: 6500,
        contact: 'https://qasa.se',
        description:
          "Plateforme suédoise de sous-location encadrée, avec contrat type et loyer sécurisé. Vérifier que le propriétaire ou la coopérative a autorisé la sous-location avant de signer.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'Stockholm',
        type: 'homestay',
        pricePerMonth: 6000,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant à Stockholm, formule de repli quand la file d'attente du logement étudiant dépasse la date de rentrée.",
      },
      {
        name: 'SSSB — Stiftelsen Stockholms Studentbostäder',
        city: 'Stockholm',
        type: 'residence',
        pricePerMonth: 5200,
        contact: 'https://www.sssb.se',
        description:
          "Fondation qui loge les étudiants de Stockholm. L'attribution se fait à l'ancienneté dans la file d'attente (kötid) : s'y inscrire le jour même de l'admission est déterminant.",
      },
      {
        name: 'AF Bostäder',
        city: 'Lund',
        type: 'residence',
        pricePerMonth: 4300,
        contact: 'https://www.afbostader.se',
        description:
          "Bailleur étudiant historique de Lund, environ 6 000 logements pour une ville où l'université structure toute la vie locale. Loyers parmi les plus bas de Suède.",
      },
      {
        name: 'Chalmers Studentbostäder',
        city: 'Göteborg',
        type: 'studio',
        pricePerMonth: 5000,
        contact: 'https://chalmersstudentbostader.se',
        description:
          "Fondation de logement étudiant de Göteborg : studios meublés ou non, à proximité des campus de Chalmers. Contingent réservé aux étudiants internationaux en échange.",
      },
      {
        name: 'Blocket — sous-location (andrahand)',
        city: 'Malmö',
        type: 'shared',
        pricePerMonth: 4000,
        contact: 'https://www.blocket.se',
        description:
          "Le marché de la sous-location encadrée ('andrahand') complète l'offre étudiante suédoise, structurellement insuffisante. Vérifier que le propriétaire a bien autorisé la sous-location.",
      },
    ],
  },

  /* ─────────────────────────── SUISSE ────────────────────────────────────── */
  {
    country: 'Switzerland',
    currency: 'CHF',
    places: [
      {
        name: 'ETH Zürich — Wohnen',
        city: 'Zürich',
        type: 'residence',
        pricePerMonth: 750,
        contact: 'https://ethz.ch',
        description:
          "Logements gérés ou référencés par l'École polytechnique fédérale pour ses étudiants et doctorants. Places contingentées et attribuées en priorité aux nouveaux arrivants internationaux.",
      },
      {
        name: 'Universität Basel — Wohnen',
        city: 'Basel',
        type: 'residence',
        pricePerMonth: 700,
        contact: 'https://www.unibas.ch',
        description:
          "Chambres en résidence pour les étudiants de Bâle, ville frontalière avec la France et l'Allemagne. Certains étudiants logent côté français ou allemand, où le loyer est deux fois moindre.",
      },
      {
        name: 'Université de Fribourg — Logements étudiants',
        city: 'Fribourg',
        type: 'residence',
        pricePerMonth: 550,
        contact: 'https://www.unifr.ch',
        description:
          "Logements universitaires dans la seule université bilingue français-allemand de Suisse. Loyers sensiblement inférieurs à ceux de Zurich, Genève et Lausanne.",
      },
      {
        name: 'USI — Alloggi studenti',
        city: 'Lugano',
        type: 'residence',
        pricePerMonth: 700,
        contact: 'https://www.usi.ch',
        description:
          "Logements référencés par l'Università della Svizzera italiana pour ses étudiants, dans le canton italophone du Tessin. Marché plus accessible que sur l'arc lémanique.",
      },
      {
        name: 'Université de Neuchâtel — Logements',
        city: 'Neuchâtel',
        type: 'studio',
        pricePerMonth: 550,
        contact: 'https://www.unine.ch',
        description:
          "Studios et chambres proposés par l'université, dans une ville universitaire à taille humaine au bord du lac. L'une des options les plus abordables de Suisse romande.",
      },
      {
        name: 'Homegate — studio meublé',
        city: 'Lausanne',
        type: 'studio',
        pricePerMonth: 1100,
        contact: 'https://www.homegate.ch',
        description:
          "Premier portail immobilier suisse. Sur le marché privé, prévoir un dossier complet (attestation d'inscription, garant ou caution bancaire) et une caution de trois mois de loyer.",
      },
      {
        name: 'ImmoScout24 — colocation',
        city: 'Zürich',
        type: 'shared',
        pricePerMonth: 800,
        contact: 'https://www.immoscout24.ch',
        description:
          "Annonces de chambres en colocation à Zurich, ville la plus chère du pays. La WG reste le seul montage réaliste pour un budget étudiant sans revenus locaux.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'Genève',
        type: 'homestay',
        pricePerMonth: 900,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant à Genève, où le marché locatif privé affiche un taux de vacance proche de zéro. Formule de transition pour les premiers mois.",
      },
      {
        name: 'WOKO — Studentische Wohngenossenschaft',
        city: 'Zürich',
        type: 'residence',
        pricePerMonth: 700,
        contact: 'https://www.woko.ch',
        description:
          "Coopérative de logement étudiant de Zurich, la plus grande de Suisse : chambres en colocation à loyer modéré face à un marché privé parmi les plus tendus d'Europe.",
      },
      {
        name: 'FMEL — Fondation Maisons pour Étudiants Lausanne',
        city: 'Lausanne',
        type: 'residence',
        pricePerMonth: 750,
        contact: 'https://www.fmel.ch',
        description:
          "Résidences réservées aux étudiants de l'UNIL et de l'EPFL, réparties dans l'agglomération lausannoise. Attribution sur dossier, priorité aux nouveaux arrivants.",
      },
      {
        name: 'Cité Universitaire de Genève',
        city: 'Genève',
        type: 'studio',
        pricePerMonth: 900,
        contact: 'https://www.citeuni.ch',
        description:
          "Studios et chambres pour étudiants et chercheurs à Genève, où le marché locatif privé est quasi inaccessible sans dossier suisse établi.",
      },
      {
        name: 'WGZimmer.ch — colocation (WG)',
        city: 'Bern',
        type: 'shared',
        pricePerMonth: 650,
        contact: 'https://www.wgzimmer.ch',
        description:
          "Plateforme suisse de référence pour la chambre en colocation. La WG reste le montage le plus réaliste pour un budget étudiant en Suisse alémanique.",
      },
    ],
  },

  /* ─────────────────────────── ITALIE ────────────────────────────────────── */
  {
    country: 'Italy',
    currency: 'EUR',
    places: [
      {
        name: 'ER.GO — Diritto allo studio Emilia-Romagna',
        city: 'Bologna',
        type: 'residence',
        pricePerMonth: 300,
        contact: 'https://www.er-go.it',
        description:
          "Organisme régional du droit à l'étude : logement à tarif social attribué au concours, sur critères de revenu et de mérite, en même temps que la bourse régionale.",
      },
      {
        name: 'DSU Toscana',
        city: 'Firenze',
        type: 'residence',
        pricePerMonth: 300,
        contact: 'https://www.dsu.toscana.it',
        description:
          "Résidences publiques de Florence, Sienne et Pise. Le dossier de bourse régionale vaut demande de logement : les deux se déposent ensemble, avant l'été.",
      },
      {
        name: 'LazioDisco',
        city: 'Roma',
        type: 'residence',
        pricePerMonth: 280,
        contact: 'https://www.laziodisco.it',
        description:
          "Organisme du droit à l'étude du Latium, qui gère les résidences universitaires publiques de Rome. Places limitées face au nombre d'inscrits : candidater dès l'ouverture du concours.",
      },
      {
        name: 'Camplus',
        city: 'Milano',
        type: 'residence',
        pricePerMonth: 800,
        contact: 'https://www.camplus.it',
        description:
          "Résidence du premier réseau italien de collèges de mérite, à Milan. Services inclus et accompagnement académique, dans la ville la plus chère d'Italie.",
      },
      {
        name: 'Campus X',
        city: 'Roma',
        type: 'residence',
        pricePerMonth: 700,
        contact: 'https://www.campusx.it',
        description:
          "Résidences étudiantes privées à Rome et dans plusieurs villes italiennes : chambres et studios meublés, espaces communs et sportifs, contrat en ligne.",
      },
      {
        name: 'Spotahome — chambre meublée',
        city: 'Milano',
        type: 'studio',
        pricePerMonth: 900,
        contact: 'https://www.spotahome.com',
        description:
          "Plateforme de réservation à distance avec visite vidéo réalisée par ses équipes. Utile à Milan, où les logements partent vite et où le bail exige souvent un garant italien.",
      },
      {
        name: 'Idealista — stanza singola',
        city: 'Padova',
        type: 'shared',
        pricePerMonth: 400,
        contact: 'https://www.idealista.it',
        description:
          "Chambre individuelle en appartement partagé à Padoue, l'une des plus anciennes universités d'Europe. Loyers nettement inférieurs à Milan pour une ville étudiante dense.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'Firenze',
        type: 'homestay',
        pricePerMonth: 600,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant à Florence, destination majeure des programmes d'échange. Alternative au bail italien, qui réclame garant et codice fiscale.",
      },
      {
        name: 'Camplus',
        city: 'Bologna',
        type: 'residence',
        pricePerMonth: 700,
        contact: 'https://www.camplus.it',
        description:
          "Premier réseau italien de collèges de mérite et de résidences universitaires, présent dans une quinzaine de villes. Services inclus et accompagnement académique.",
      },
      {
        name: 'EDISU Piemonte',
        city: 'Torino',
        type: 'residence',
        pricePerMonth: 300,
        contact: 'https://www.edisu.piemonte.it',
        description:
          "Organisme public du droit à l'étude : logement à tarif social attribué au concours, sur critères de revenu et de mérite, en même temps que la bourse régionale.",
      },
      {
        name: 'Immobiliare.it — posto letto',
        city: 'Milano',
        type: 'shared',
        pricePerMonth: 600,
        contact: 'https://www.immobiliare.it',
        description:
          "Le 'posto letto' (place en chambre partagée) ou la chambre simple en appartement est le logement étudiant le plus courant à Milan, ville la plus chère d'Italie.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'Roma',
        type: 'homestay',
        pricePerMonth: 650,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant à Rome, souvent dans les quartiers résidentiels bien desservis. Alternative simple à un bail italien qui exige garant et codice fiscale.",
      },
    ],
  },

  /* ─────────────────────────── PORTUGAL ──────────────────────────────────── */
  {
    country: 'Portugal',
    currency: 'EUR',
    places: [
      {
        name: 'SASUP — Universidade do Porto (Residências)',
        city: 'Porto',
        type: 'residence',
        pricePerMonth: 220,
        contact: 'https://sasup.up.pt',
        description:
          "Résidences des services d'action sociale de l'université de Porto, aux tarifs les plus bas de la ville. Places limitées, avec priorité aux boursiers et aux étudiants internationaux en programme d'échange.",
      },
      {
        name: 'SASUC — Universidade de Coimbra (Residências)',
        city: 'Coimbra',
        type: 'residence',
        pricePerMonth: 200,
        contact: 'https://www.uc.pt',
        description:
          "Résidences universitaires publiques de Coimbra, ville où la vie étudiante structure la cité depuis des siècles. Loyers très inférieurs au marché privé local.",
      },
      {
        name: 'SASUM — Universidade do Minho (Residências)',
        city: 'Braga',
        type: 'residence',
        pricePerMonth: 200,
        contact: 'https://www.sas.uminho.pt',
        description:
          "Logements publics sur les campus de Braga et Guimarães, avec restauration universitaire à proximité. L'une des options les plus abordables du pays.",
      },
      {
        name: 'Universidade de Aveiro — Residências',
        city: 'Aveiro',
        type: 'residence',
        pricePerMonth: 220,
        contact: 'https://www.ua.pt',
        description:
          "Résidences sur un campus compact au bord de la ria, à une heure de Porto. Le logement universitaire y couvre une part importante des étudiants inscrits.",
      },
      {
        name: 'Livensa Living',
        city: 'Lisboa',
        type: 'studio',
        pricePerMonth: 800,
        contact: 'https://www.livensaliving.com',
        description:
          "Studios meublés avec espaces communs à Lisbonne, réservables en ligne depuis l'étranger. Segment privé, dans une ville où les loyers ont fortement augmenté ces dernières années.",
      },
      {
        name: 'Smart Studios',
        city: 'Porto',
        type: 'studio',
        pricePerMonth: 650,
        contact: 'https://www.smartstudios.pt',
        description:
          "Studios étudiants meublés à Porto, charges et internet inclus, à proximité des pôles universitaires. Contrats au semestre ou à l'année académique.",
      },
      {
        name: 'Idealista — quarto partilhado',
        city: 'Lisboa',
        type: 'shared',
        pricePerMonth: 450,
        contact: 'https://www.idealista.pt',
        description:
          "Chambre en appartement partagé à Lisbonne, mode de logement le plus courant chez les étudiants. Privilégier les quartiers desservis par le métro plutôt que le centre touristique.",
      },
      {
        name: 'HousingAnywhere',
        city: 'Lisboa',
        type: 'shared',
        pricePerMonth: 500,
        contact: 'https://housinganywhere.com',
        description:
          "Réservation d'une chambre à distance avec contrat en ligne, avant même l'obtention du visa. Le paiement n'est reversé au bailleur qu'après l'emménagement.",
      },
      {
        name: 'SAS Universidade de Lisboa — Residências',
        city: 'Lisboa',
        type: 'residence',
        pricePerMonth: 250,
        contact: 'https://www.sas.ulisboa.pt',
        description:
          "Résidences publiques des services d'action sociale de l'Université de Lisbonne : les tarifs les plus bas du marché, priorité aux boursiers et places limitées.",
      },
      {
        name: 'Milestone Student Living',
        city: 'Porto',
        type: 'studio',
        pricePerMonth: 600,
        contact: 'https://www.milestone-living.com',
        description:
          "Résidences étudiantes privées meublées à Porto et Lisbonne, charges incluses et réservation en ligne. Contrats à l'année universitaire ou au semestre.",
      },
      {
        name: 'Uniplaces — chambre en colocation',
        city: 'Porto',
        type: 'shared',
        pricePerMonth: 350,
        contact: 'https://www.uniplaces.com',
        description:
          "Plateforme née à Lisbonne, spécialisée dans la réservation de chambres à distance avec contrat en ligne — utile quand on ne peut pas visiter avant l'arrivée.",
      },
      {
        name: "Homestay.com — famille d'accueil",
        city: 'Coimbra',
        type: 'homestay',
        pricePerMonth: 350,
        contact: 'https://www.homestay.com',
        description:
          "Chambre chez l'habitant à Coimbra, ville universitaire historique où le logement étudiant privé reste limité et se réserve tôt.",
      },
    ],
  },

  /* ─────────────────────────── CHINE ─────────────────────────────────────── */
  {
    country: 'China',
    currency: 'CNY',
    places: [
      {
        name: 'Peking University — Résidence internationale',
        city: 'Beijing',
        type: 'residence',
        pricePerMonth: 2500,
        contact: 'https://www.pku.edu.cn',
        description:
          "Dortoirs réservés aux étudiants internationaux sur le campus de Haidian, en chambre simple ou double. Réservation via le bureau des admissions, en même temps que l'inscription.",
      },
      {
        name: 'Shanghai Jiao Tong University — Dortoirs internationaux',
        city: 'Shanghai',
        type: 'residence',
        pricePerMonth: 2600,
        contact: 'https://www.sjtu.edu.cn',
        description:
          "Logement sur le campus de Minhang ou de Xuhui, facturé à la journée. Les places étant limitées, une partie des étudiants se loge en ville dès la deuxième année.",
      },
      {
        name: 'Nanjing University — Résidence internationale',
        city: 'Nanjing',
        type: 'residence',
        pricePerMonth: 1600,
        contact: 'https://www.nju.edu.cn',
        description:
          "Chambres meublées sur le campus de Xianlin, à un niveau de loyer très inférieur à Pékin et Shanghai. Nankin accueille l'une des plus fortes communautés étudiantes du pays.",
      },
      {
        name: 'Wuhan University — Résidence internationale',
        city: 'Wuhan',
        type: 'residence',
        pricePerMonth: 1500,
        contact: 'https://www.whu.edu.cn',
        description:
          "Résidence pour étudiants étrangers sur un campus réputé pour son cadre, au bord du lac de l'Est. Coût de la vie parmi les plus bas des grandes villes universitaires chinoises.",
      },
      {
        name: "Sun Yat-sen University — Résidence internationale",
        city: 'Guangzhou',
        type: 'residence',
        pricePerMonth: 1800,
        contact: 'https://www.sysu.edu.cn',
        description:
          "Dortoirs internationaux à Canton, porte d'entrée du delta de la rivière des Perles. Chambres meublées avec services inclus, réservées via le bureau des étudiants étrangers.",
      },
      {
        name: "Xi'an Jiaotong University — Résidence internationale",
        city: "Xi'an",
        type: 'residence',
        pricePerMonth: 1200,
        contact: 'https://www.xjtu.edu.cn',
        description:
          "Logement sur le campus de Xi'an, grande ville universitaire de l'intérieur où le budget mensuel est le plus contenu du catalogue chinois.",
      },
      {
        name: 'Lianjia (Beike) — location meublée',
        city: 'Shenzhen',
        type: 'studio',
        pricePerMonth: 3500,
        contact: 'https://www.ke.com',
        description:
          "Premier réseau d'agences immobilières de Chine, incontournable pour louer hors campus. Prévoir un compte bancaire local, un dépôt de garantie et l'enregistrement de résidence au commissariat.",
      },
      {
        name: 'Ziroom — appartement partagé',
        city: 'Beijing',
        type: 'shared',
        pricePerMonth: 3800,
        contact: 'https://www.ziroom.com',
        description:
          "Colocation meublée à contrat standardisé et gestion en ligne, très répandue chez les jeunes actifs et étudiants de Pékin. Loyer souvent payable au trimestre.",
      },
      {
        name: 'Tsinghua University — Résidence internationale',
        city: 'Beijing',
        type: 'residence',
        pricePerMonth: 2400,
        contact: 'https://www.tsinghua.edu.cn',
        description:
          "Dortoirs du campus réservés aux étudiants internationaux, facturés à la journée par chambre simple ou double. Réservation via le bureau des admissions, en même temps que l'inscription.",
      },
      {
        name: 'Fudan University — Résidence internationale',
        city: 'Shanghai',
        type: 'residence',
        pricePerMonth: 2700,
        contact: 'https://www.fudan.edu.cn',
        description:
          "Logement sur le campus de Fudan, chambres meublées avec services inclus. Les places étant contingentées, une partie des étudiants se loge en ville dès la deuxième année.",
      },
      {
        name: 'Zhejiang University — Chambre individuelle',
        city: 'Hangzhou',
        type: 'studio',
        pricePerMonth: 2000,
        contact: 'https://www.zju.edu.cn',
        description:
          "Chambre individuelle sur le campus de Hangzhou, à un niveau de loyer nettement inférieur à Pékin et Shanghai pour une université de rang équivalent.",
      },
      {
        name: 'Ziroom — appartement partagé',
        city: 'Shanghai',
        type: 'shared',
        pricePerMonth: 3500,
        contact: 'https://www.ziroom.com',
        description:
          "Opérateur chinois de location meublée en colocation, avec contrat standardisé et gestion en ligne. Prévoir un compte bancaire local et l'enregistrement de résidence au commissariat.",
      },
    ],
  },
];

async function main() {
  // Garde-fou : le catalogue ne doit couvrir que des pays d'études déclarés.
  const declared = new Set(studyCountriesSeed);
  const intrus = catalog.map(b => b.country).filter(c => !declared.has(c));
  if (intrus.length > 0) {
    throw new Error(`Pays hors catalogue d'études : ${intrus.join(', ')}`);
  }
  const manquants = studyCountriesSeed.filter(c => !catalog.some(b => b.country === c));
  if (manquants.length > 0) {
    console.warn(`⚠️  Pays d'études sans logement : ${manquants.join(', ')}`);
  }

  // Le même organisme peut revenir dans plusieurs villes (Homestay.com, WG-Gesucht…), mais
  // deux fiches identiques (name, country, city) fusionneraient en base sans être visibles ici.
  const vus = new Set<string>();
  const doublons = catalog
    .flatMap(b => b.places.map(p => `${p.name} | ${b.country} | ${p.city}`))
    .filter(k => (vus.has(k) ? true : (vus.add(k), false)));
  if (doublons.length > 0) {
    throw new Error(`Doublons dans le catalogue :\n  ${doublons.join('\n  ')}`);
  }

  let created = 0;
  let updated = 0;

  for (const block of catalog) {
    for (const p of block.places) {
      const data = {
        name: p.name,
        country: block.country,
        city: p.city,
        type: p.type,
        pricePerMonth: p.pricePerMonth,
        currency: block.currency,
        contact: p.contact || null,
        description: `${p.description} Tarif mensuel indicatif, à confirmer auprès du bailleur.`,
      };

      // Pas de contrainte d'unicité sur `name` : déduplication sur (name, country, city)
      // pour que le script reste rejouable.
      const existing = await prisma.accommodation.findFirst({
        where: { name: data.name, country: data.country, city: data.city },
        select: { id: true },
      });

      if (existing) {
        await prisma.accommodation.update({ where: { id: existing.id }, data });
        updated++;
      } else {
        await prisma.accommodation.create({ data });
        created++;
      }
    }
  }

  const total = await prisma.accommodation.count();
  const byCountry = await prisma.accommodation.groupBy({
    by: ['country'],
    _count: { _all: true },
  });

  console.log(`✅ Logements étudiants — ${created} créés, ${updated} mis à jour, ${total} en base.`);
  byCountry
    .sort((a, b) => b._count._all - a._count._all)
    .forEach(r => console.log(`   ${r.country.padEnd(16)} ${r._count._all}`));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
