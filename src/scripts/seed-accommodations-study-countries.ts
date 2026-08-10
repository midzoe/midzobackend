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
