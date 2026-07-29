import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Catalogue de départ des centres de langue (story 5.14).
 *
 * Le `country` reprend **exactement** le vocabulaire de `universities.country`
 * (« Germany », « United Kingdom »…) : c'est la clé qui relie un centre aux étudiants
 * recalés sur l'exigence de langue d'une université de ce pays (5.3 → 5.8). Les 14 pays
 * du catalogue universités sont couverts.
 *
 * ⚠️ Ce qui est **vérifiable** ici : le nom du centre, sa ville, la langue enseignée,
 * son site officiel, les certifications qu'il prépare habituellement.
 * ⚠️ Ce qui est **indicatif** et doit être confirmé depuis l'admin : le tarif
 * (`priceFrom`, ordre de grandeur du marché local, pas un devis), le volume horaire, la
 * taille de classe et le calendrier des rentrées. Ils sont affichés « dès … » côté site.
 * Les coordonnées (e-mail, téléphone, adresse postale) sont volontairement laissées
 * vides plutôt qu'inventées : elles se saisissent à la main.
 *
 * `isPartner` reste false partout : aucun partenariat Midzo n'est signé à ce jour, et
 * `universityPartners` reste vide pour la même raison.
 */

type Center = {
  name: string;
  city: string;
  description: string;
  link: string;
  language?: string; // sinon la langue par défaut du pays
  levels?: string[];
  courseTypes?: string[];
  exams?: string[];
  accreditations?: string[];
  priceFrom?: number;
  priceUnit?: string;
  weeklyHours?: number;
  classSize?: number;
  startDates?: string;
  visa?: boolean;
  accommodation?: boolean;
  pathway?: boolean;
};

type CountryBlock = {
  country: string;
  language: string;
  currency: string;
  exams?: string[];
  levels?: string[];
  courseTypes?: string[];
  priceUnit?: string;
  centers: Center[];
};

const CEFR_ALL = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const CEFR_TO_C1 = ['A1', 'A2', 'B1', 'B2', 'C1'];
const STANDARD = ['Intensif', 'Standard', 'Cours du soir', 'En ligne', 'Préparation examen'];

const catalog: CountryBlock[] = [
  /* ─────────────────────────── ALLEMAGNE ─────────────────────────────────── */
  {
    country: 'Germany',
    language: 'Allemand',
    currency: 'EUR',
    levels: CEFR_ALL,
    exams: ['Goethe-Zertifikat', 'telc', 'TestDaF'],
    courseTypes: STANDARD,
    priceUnit: 'semaine',
    centers: [
      {
        name: 'Goethe-Institut Berlin',
        city: 'Berlin',
        description: "Institut culturel officiel de la République fédérale d'Allemagne : cours intensifs et certifications Goethe reconnues par toutes les universités allemandes.",
        link: 'https://www.goethe.de/ins/de/de/sta/ber.html',
        exams: ['Goethe-Zertifikat', 'TestDaF'],
        priceFrom: 420, weeklyHours: 25, classSize: 16,
        startDates: 'Sessions intensives toute l’année',
        visa: true, accommodation: true,
      },
      {
        name: 'Goethe-Institut München',
        city: 'Munich',
        description: 'Siège historique du Goethe-Institut : cours intensifs, cours du soir et préparation complète aux examens Goethe.',
        link: 'https://www.goethe.de/ins/de/de/sta/mun.html',
        exams: ['Goethe-Zertifikat', 'TestDaF'],
        priceFrom: 420, weeklyHours: 25, classSize: 16,
        visa: true, accommodation: true,
      },
      {
        name: 'Carl Duisberg Centrum Köln',
        city: 'Cologne',
        description: 'Centre de formation reconnu, spécialisé dans la préparation au TestDaF et à la DSH pour les candidats à l’université.',
        link: 'https://www.carl-duisberg-centren.de',
        exams: ['TestDaF', 'DSH', 'telc'],
        accreditations: ['FDSV', 'Bildungsurlaub'],
        priceFrom: 300, weeklyHours: 25,
        startDates: 'Rentrées mensuelles',
        visa: true, accommodation: true, pathway: true,
      },
      {
        name: 'did deutsch-institut Berlin',
        city: 'Berlin',
        description: 'Cours d’allemand général et intensif, du débutant au niveau C1, avec accompagnement des étudiants internationaux.',
        link: 'https://www.did.de',
        priceFrom: 260, weeklyHours: 25, classSize: 14,
        startDates: 'Rentrées chaque lundi',
        visa: true, accommodation: true,
      },
      {
        name: 'DeutschAkademie München',
        city: 'Munich',
        description: 'Cours intensifs et cours du soir à prix contenus, en petits groupes, du A1 au C2.',
        link: 'https://www.deutschakademie.de',
        exams: ['Goethe-Zertifikat', 'telc', 'TestDaF'],
        priceFrom: 200, weeklyHours: 20, classSize: 12,
        startDates: 'Rentrées chaque lundi',
      },
      {
        name: 'IIK Düsseldorf',
        city: 'Düsseldorf',
        description: 'Institut universitaire de communication internationale : centre d’examen TestDaF et cours préparatoires aux études supérieures.',
        link: 'https://www.iik-duesseldorf.de',
        exams: ['TestDaF', 'DSH', 'telc'],
        priceFrom: 280, weeklyHours: 25,
        visa: true, pathway: true,
      },
      {
        name: 'GLS German Language School',
        city: 'Berlin',
        description: 'Campus de langue en plein Prenzlauer Berg : allemand général, allemand de spécialité et année préparatoire aux universités.',
        link: 'https://www.gls-german-courses.de',
        accreditations: ['Eaquals', 'FDSV'],
        priceFrom: 290, weeklyHours: 24, classSize: 12,
        visa: true, accommodation: true, pathway: true,
      },
      {
        name: 'Humboldt-Institut Berlin',
        city: 'Berlin',
        description: 'Cours d’allemand intensifs en immersion totale, hébergement sur place et progression rapide d’un niveau par mois.',
        link: 'https://www.humboldt-institut.org',
        courseTypes: ['Intensif', 'Cours particuliers', 'Préparation examen'],
        priceFrom: 450, weeklyHours: 30, classSize: 10,
        visa: true, accommodation: true,
      },
    ],
  },

  /* ──────────────────────────── FRANCE ───────────────────────────────────── */
  {
    country: 'France',
    language: 'Français',
    currency: 'EUR',
    levels: CEFR_ALL,
    exams: ['DELF', 'DALF', 'TCF'],
    courseTypes: STANDARD,
    priceUnit: 'semaine',
    centers: [
      {
        name: 'Alliance Française Paris Île-de-France',
        city: 'Paris',
        description: 'La référence pour apprendre le français à Paris : cours du A1 au C2, centre d’examen DELF/DALF et TCF.',
        link: 'https://www.alliancefr.org',
        exams: ['DELF', 'DALF', 'TCF', 'TEF'],
        accreditations: ['Qualité FLE'],
        priceFrom: 250, weeklyHours: 20, classSize: 15,
        startDates: 'Rentrées toutes les deux semaines',
        visa: true, accommodation: true,
      },
      {
        name: 'CAVILAM – Alliance Française',
        city: 'Vichy',
        description: 'Centre historique de didactique du français, réputé pour ses stages intensifs et son suivi individualisé.',
        link: 'https://www.cavilam.com',
        accreditations: ['Qualité FLE'],
        priceFrom: 240, weeklyHours: 20, classSize: 12,
        visa: true, accommodation: true,
      },
      {
        name: 'Institut de Touraine',
        city: 'Tours',
        description: 'Institut fondé en 1912, spécialisé dans le français langue étrangère et la préparation aux études universitaires.',
        link: 'https://www.institutdetouraine.com',
        accreditations: ['Qualité FLE'],
        priceFrom: 230, weeklyHours: 20,
        visa: true, accommodation: true, pathway: true,
      },
      {
        name: 'France Langue Paris',
        city: 'Paris',
        description: 'Cours de français général, professionnel et préparation aux examens, avec des campus à Paris, Nice et Bordeaux.',
        link: 'https://www.france-langue.fr',
        accreditations: ['Qualité FLE'],
        priceFrom: 260, weeklyHours: 20,
        startDates: 'Rentrées chaque lundi',
        visa: true, accommodation: true,
      },
      {
        name: 'ACCORD French Language School',
        city: 'Paris',
        description: 'École de français au cœur de Paris : cours intensifs, ateliers de conversation et préparation DELF/DALF.',
        link: 'https://www.accord-langues.com',
        accreditations: ['Qualité FLE', 'Eaquals'],
        priceFrom: 245, weeklyHours: 20, classSize: 12,
        visa: true, accommodation: true,
      },
      {
        name: 'Lyon Bleu International',
        city: 'Lyon',
        description: 'École à taille humaine à Lyon, cours intensifs et semi-intensifs, séjours en famille d’accueil.',
        link: 'https://www.lyon-bleu.fr',
        courseTypes: ['Intensif', 'Semi-intensif', 'Cours particuliers', 'Préparation examen'],
        accreditations: ['Qualité FLE'],
        priceFrom: 220, weeklyHours: 20,
        visa: true, accommodation: true,
      },
      {
        name: 'Azurlingua',
        city: 'Nice',
        description: 'Cours de français sur la Côte d’Azur, du général à la préparation d’examens, avec logement étudiant.',
        link: 'https://www.azurlingua.com',
        accreditations: ['Qualité FLE'],
        priceFrom: 210, weeklyHours: 20,
        visa: true, accommodation: true,
      },
      {
        name: 'CUEF – Université Grenoble Alpes',
        city: 'Grenoble',
        description: 'Centre universitaire d’études françaises : semestres intensifs conçus comme une passerelle vers l’université française.',
        link: 'https://cuef.univ-grenoble-alpes.fr',
        courseTypes: ['Intensif', 'Année préparatoire', 'Préparation examen'],
        priceFrom: 1600, priceUnit: 'session', weeklyHours: 20,
        startDates: 'Semestres universitaires (septembre et janvier)',
        visa: true, pathway: true,
      },
    ],
  },

  /* ───────────────────────── ROYAUME-UNI ─────────────────────────────────── */
  {
    country: 'United Kingdom',
    language: 'Anglais',
    currency: 'GBP',
    levels: CEFR_ALL,
    exams: ['IELTS', 'Cambridge'],
    courseTypes: STANDARD,
    priceUnit: 'semaine',
    centers: [
      {
        name: 'International House London',
        city: 'Londres',
        description: 'École de référence à Covent Garden : anglais général, préparation IELTS et Cambridge, formation de professeurs.',
        link: 'https://www.ihlondon.com',
        accreditations: ['British Council', 'English UK'],
        priceFrom: 320, weeklyHours: 22, classSize: 12,
        startDates: 'Rentrées chaque lundi',
        visa: true, accommodation: true,
      },
      {
        name: 'St Giles International London Central',
        city: 'Londres',
        description: 'École historique proche de Tottenham Court Road : anglais général et académique, préparation aux examens.',
        link: 'https://www.stgiles-international.com',
        accreditations: ['British Council', 'English UK'],
        priceFrom: 300, weeklyHours: 20, classSize: 12,
        visa: true, accommodation: true,
      },
      {
        name: 'Kaplan International Languages London',
        city: 'Londres',
        description: 'Anglais général et académique, avec des parcours d’admission conditionnelle vers des universités britanniques.',
        link: 'https://www.kaplaninternational.com',
        accreditations: ['British Council', 'English UK'],
        priceFrom: 340, weeklyHours: 21,
        visa: true, accommodation: true, pathway: true,
      },
      {
        name: 'EC English London',
        city: 'Londres',
        description: 'Cours d’anglais général, intensif et préparation IELTS, avec un fort accompagnement des étudiants internationaux.',
        link: 'https://www.ecenglish.com',
        accreditations: ['British Council', 'English UK'],
        priceFrom: 310, weeklyHours: 20,
        visa: true, accommodation: true,
      },
      {
        name: 'Bell English Cambridge',
        city: 'Cambridge',
        description: 'Campus à Cambridge : anglais académique et préparation intensive aux examens Cambridge et IELTS.',
        link: 'https://www.bellenglish.com',
        accreditations: ['British Council', 'English UK'],
        priceFrom: 350, weeklyHours: 22, classSize: 14,
        visa: true, accommodation: true, pathway: true,
      },
      {
        name: 'Wimbledon School of English',
        city: 'Londres',
        description: 'École indépendante régulièrement classée parmi les meilleures du pays, en petits groupes.',
        link: 'https://www.wimbledon-school.ac.uk',
        accreditations: ['British Council', 'English UK', 'Eaquals'],
        priceFrom: 290, weeklyHours: 20, classSize: 10,
        visa: true, accommodation: true,
      },
      {
        name: 'Oxford International English School',
        city: 'Oxford',
        description: 'Anglais général et académique à Oxford, avec des programmes préparatoires à l’entrée universitaire.',
        link: 'https://www.oxfordinternationalenglish.com',
        accreditations: ['British Council', 'English UK'],
        priceFrom: 280, weeklyHours: 20,
        visa: true, accommodation: true, pathway: true,
      },
    ],
  },

  /* ───────────────────────── ÉTATS-UNIS ──────────────────────────────────── */
  {
    country: 'United States',
    language: 'Anglais',
    currency: 'USD',
    levels: CEFR_ALL,
    exams: ['TOEFL', 'IELTS'],
    courseTypes: STANDARD,
    priceUnit: 'semaine',
    centers: [
      {
        name: 'Columbia University – American Language Program',
        city: 'New York',
        description: 'Programme d’anglais intensif d’une université de l’Ivy League, orienté anglais académique et poursuite d’études.',
        link: 'https://sps.columbia.edu/american-language-program',
        courseTypes: ['Intensif', 'Standard', 'Année préparatoire'],
        priceFrom: 6000, priceUnit: 'session', weeklyHours: 20,
        startDates: 'Semestres universitaires',
        visa: true, pathway: true,
      },
      {
        name: 'UCLA Extension – American Language Center',
        city: 'Los Angeles',
        description: 'Anglais intensif sur le campus d’UCLA, avec passerelles vers les programmes universitaires américains.',
        link: 'https://www.uclaextension.edu/american-language-center',
        courseTypes: ['Intensif', 'Standard', 'Année préparatoire'],
        priceFrom: 5000, priceUnit: 'session', weeklyHours: 20,
        visa: true, pathway: true,
      },
      {
        name: 'Kaplan International Languages New York',
        city: 'New York',
        description: 'Anglais général, intensif et préparation TOEFL au cœur de Manhattan.',
        link: 'https://www.kaplaninternational.com',
        accreditations: ['ACCET'],
        priceFrom: 450, weeklyHours: 20,
        visa: true, accommodation: true, pathway: true,
      },
      {
        name: 'EC English Boston',
        city: 'Boston',
        description: 'École internationale dans la ville étudiante par excellence : anglais général et académique.',
        link: 'https://www.ecenglish.com',
        accreditations: ['ACCET'],
        priceFrom: 420, weeklyHours: 20,
        visa: true, accommodation: true,
      },
      {
        name: 'Rennert International',
        city: 'New York',
        description: 'École indépendante new-yorkaise : anglais général, cours particuliers et préparation TOEFL.',
        link: 'https://www.rennert.com',
        accreditations: ['ACCET'],
        priceFrom: 380, weeklyHours: 20, classSize: 10,
        visa: true, accommodation: true,
      },
      {
        name: 'FLS International – Boston Commons',
        city: 'Boston',
        description: 'Anglais intensif et programmes de préparation à l’admission universitaire américaine.',
        link: 'https://www.fls.net',
        accreditations: ['ACCET'],
        priceFrom: 360, weeklyHours: 24,
        visa: true, accommodation: true, pathway: true,
      },
      {
        name: 'ELS Language Centers',
        city: 'Plusieurs campus',
        description: 'Réseau historique de centres d’anglais implantés sur des campus universitaires américains.',
        link: 'https://www.els.edu',
        accreditations: ['ACCET'],
        priceFrom: 400, weeklyHours: 20,
        visa: true, accommodation: true, pathway: true,
      },
    ],
  },

  /* ────────────────────────────── CANADA ─────────────────────────────────── */
  {
    country: 'Canada',
    language: 'Anglais',
    currency: 'CAD',
    levels: CEFR_ALL,
    exams: ['IELTS', 'TOEFL'],
    courseTypes: STANDARD,
    priceUnit: 'semaine',
    centers: [
      {
        name: 'ILAC Toronto',
        city: 'Toronto',
        description: 'L’une des plus grandes écoles de langues du Canada : anglais général, académique et parcours vers les collèges partenaires.',
        link: 'https://www.ilac.com',
        accreditations: ['Languages Canada'],
        priceFrom: 420, weeklyHours: 25,
        startDates: 'Rentrées chaque lundi',
        visa: true, accommodation: true, pathway: true,
      },
      {
        name: 'ILSC Vancouver',
        city: 'Vancouver',
        description: 'Large choix de cours à la carte (affaires, examens, communication) dans un campus international.',
        link: 'https://www.ilsc.com',
        accreditations: ['Languages Canada'],
        priceFrom: 400, weeklyHours: 25,
        visa: true, accommodation: true, pathway: true,
      },
      {
        name: 'Kaplan International Toronto',
        city: 'Toronto',
        description: 'Anglais général et préparation aux examens, avec accompagnement à l’admission universitaire.',
        link: 'https://www.kaplaninternational.com',
        accreditations: ['Languages Canada'],
        priceFrom: 430, weeklyHours: 20,
        visa: true, accommodation: true,
      },
      {
        name: 'École de langues – Université Laval',
        city: 'Québec',
        description: 'Cours de français langue étrangère d’une université francophone, du A1 au C1, en session intensive ou semestrielle.',
        link: 'https://www.elul.ulaval.ca',
        language: 'Français',
        exams: ['TCF', 'TEF', 'DELF'],
        courseTypes: ['Intensif', 'Standard', 'Année préparatoire'],
        priceFrom: 2200, priceUnit: 'session', weeklyHours: 20,
        startDates: 'Sessions d’automne, d’hiver et d’été',
        visa: true, pathway: true,
      },
      {
        name: 'Edu-inter',
        city: 'Québec',
        description: 'École de français à Québec : immersion, préparation TEF/TCF pour l’immigration et les études.',
        link: 'https://www.edu-inter.net',
        language: 'Français',
        exams: ['TEF', 'TCF', 'DELF'],
        accreditations: ['Languages Canada'],
        priceFrom: 350, weeklyHours: 20,
        visa: true, accommodation: true,
      },
      {
        name: 'Collège Platon',
        city: 'Montréal',
        description: 'Cours de français et d’anglais à Montréal, formats intensifs et cours du soir accessibles.',
        link: 'https://www.collegeplaton.com',
        language: 'Français',
        exams: ['TEF', 'TCF'],
        priceFrom: 250, weeklyHours: 20,
        visa: true, accommodation: true,
      },
      {
        name: 'EC English Montréal',
        city: 'Montréal',
        description: 'Anglais général et intensif dans une ville bilingue, idéal avant une admission au Québec ou en Ontario.',
        link: 'https://www.ecenglish.com',
        accreditations: ['Languages Canada'],
        priceFrom: 380, weeklyHours: 20,
        visa: true, accommodation: true,
      },
    ],
  },

  /* ───────────────────────────── PAYS-BAS ────────────────────────────────── */
  {
    country: 'Netherlands',
    language: 'Néerlandais',
    currency: 'EUR',
    levels: CEFR_TO_C1,
    exams: ['NT2', 'CNaVT'],
    courseTypes: STANDARD,
    priceUnit: 'cours',
    centers: [
      {
        name: 'UvA Talen',
        city: 'Amsterdam',
        description: 'Centre de langues de l’Université d’Amsterdam : néerlandais général et préparation à l’examen d’État NT2.',
        link: 'https://www.uvatalen.nl',
        priceFrom: 750, weeklyHours: 8,
        startDates: 'Sessions toutes les 6 à 8 semaines',
        pathway: true,
      },
      {
        name: 'Direct Dutch Institute',
        city: 'La Haye',
        description: 'Institut spécialisé dans l’enseignement du néerlandais aux expatriés et étudiants internationaux depuis 1985.',
        link: 'https://www.directdutch.com',
        priceFrom: 650, weeklyHours: 6,
      },
      {
        name: 'Regina Coeli',
        city: 'Vught',
        description: 'Formation intensive en très petit comité (« les sœurs de Vught »), réputée pour sa progression accélérée.',
        link: 'https://www.reginacoeli.com',
        courseTypes: ['Intensif', 'Cours particuliers'],
        priceFrom: 2500, classSize: 3, weeklyHours: 30,
        accommodation: true,
      },
      {
        name: 'Koentact',
        city: 'Amsterdam',
        description: 'Cours de néerlandais en petits groupes, axés sur la conversation, avec formules du soir pour étudiants.',
        link: 'https://www.koentact.nl',
        priceFrom: 395, weeklyHours: 4, classSize: 10,
      },
      {
        name: 'Taalcentrum-VU',
        city: 'Amsterdam',
        description: 'Centre de langues de la Vrije Universiteit : néerlandais académique et préparation au NT2.',
        link: 'https://www.taalcentrum-vu.nl',
        priceFrom: 800, weeklyHours: 6,
        pathway: true,
      },
      {
        name: 'James Boswell Instituut – Universiteit Utrecht',
        city: 'Utrecht',
        description: 'Institut préparatoire de l’Université d’Utrecht : néerlandais, anglais académique et remise à niveau avant l’université.',
        link: 'https://www.jamesboswell.nl',
        courseTypes: ['Intensif', 'Année préparatoire', 'Préparation examen'],
        priceFrom: 900, weeklyHours: 10,
        pathway: true,
      },
    ],
  },

  /* ───────────────────────────── ESPAGNE ─────────────────────────────────── */
  {
    country: 'Spain',
    language: 'Espagnol',
    currency: 'EUR',
    levels: CEFR_ALL,
    exams: ['DELE', 'SIELE'],
    courseTypes: STANDARD,
    priceUnit: 'semaine',
    centers: [
      {
        name: 'Cursos Internacionales – Universidad de Salamanca',
        city: 'Salamanque',
        description: 'Le centre d’espagnol de l’université qui a codifié la langue : cours universitaires et centre d’examen DELE.',
        link: 'https://cursosinternacionales.usal.es',
        courseTypes: ['Intensif', 'Standard', 'Année préparatoire', 'Préparation examen'],
        priceFrom: 200, weeklyHours: 20,
        startDates: 'Sessions mensuelles',
        visa: true, accommodation: true, pathway: true,
      },
      {
        name: 'don Quijote Salamanca',
        city: 'Salamanque',
        description: 'Réseau espagnol majeur : cours intensifs, DELE et immersion culturelle, campus dans toute l’Espagne.',
        link: 'https://www.donquijote.org',
        accreditations: ['Instituto Cervantes'],
        priceFrom: 180, weeklyHours: 20, classSize: 8,
        startDates: 'Rentrées chaque lundi',
        visa: true, accommodation: true,
      },
      {
        name: 'Enforex Barcelona',
        city: 'Barcelone',
        description: 'Grande école d’espagnol à Barcelone, cours généraux, DELE et espagnol des affaires.',
        link: 'https://www.enforex.com',
        accreditations: ['Instituto Cervantes'],
        priceFrom: 175, weeklyHours: 20,
        visa: true, accommodation: true,
      },
      {
        name: 'AIL Madrid',
        city: 'Madrid',
        description: 'École primée à Madrid : petits groupes, préparation DELE et SIELE, forte communauté étudiante.',
        link: 'https://www.ailmadrid.com',
        accreditations: ['Instituto Cervantes'],
        priceFrom: 190, weeklyHours: 20, classSize: 8,
        visa: true, accommodation: true,
      },
      {
        name: 'Escuela Montalbán',
        city: 'Grenade',
        description: 'École andalouse à taille humaine, cours intensifs et séjours en famille d’accueil.',
        link: 'https://www.escuela-montalban.com',
        accreditations: ['Instituto Cervantes'],
        priceFrom: 165, weeklyHours: 20, classSize: 8,
        visa: true, accommodation: true,
      },
      {
        name: 'Camino Barcelona',
        city: 'Barcelone',
        description: 'Cours d’espagnol au centre de Barcelone, du A1 au C1, avec préparation DELE.',
        link: 'https://www.caminobarcelona.com',
        accreditations: ['Instituto Cervantes'],
        priceFrom: 170, weeklyHours: 20,
        visa: true, accommodation: true,
      },
      {
        name: 'TANDEM Madrid',
        city: 'Madrid',
        description: 'École fondée sur l’échange linguistique, cours intensifs et ateliers de conversation.',
        link: 'https://www.tandemmadrid.com',
        accreditations: ['Instituto Cervantes'],
        priceFrom: 180, weeklyHours: 20,
        visa: true, accommodation: true,
      },
    ],
  },

  /* ────────────────────────────── ITALIE ─────────────────────────────────── */
  {
    country: 'Italy',
    language: 'Italien',
    currency: 'EUR',
    levels: CEFR_ALL,
    exams: ['CILS', 'CELI', 'PLIDA'],
    courseTypes: STANDARD,
    priceUnit: 'semaine',
    centers: [
      {
        name: 'Università per Stranieri di Perugia',
        city: 'Pérouse',
        description: 'Université publique entièrement dédiée à l’enseignement de l’italien aux étrangers, centre d’examen CELI.',
        link: 'https://www.unistrapg.it',
        exams: ['CELI'],
        courseTypes: ['Intensif', 'Standard', 'Année préparatoire', 'Préparation examen'],
        priceFrom: 350, priceUnit: 'mois', weeklyHours: 20,
        startDates: 'Sessions mensuelles',
        visa: true, pathway: true,
      },
      {
        name: 'Università per Stranieri di Siena',
        city: 'Sienne',
        description: 'Université spécialisée dans l’italien langue étrangère et organisme responsable de la certification CILS.',
        link: 'https://www.unistrasi.it',
        exams: ['CILS'],
        courseTypes: ['Intensif', 'Standard', 'Année préparatoire', 'Préparation examen'],
        priceFrom: 350, priceUnit: 'mois', weeklyHours: 20,
        visa: true, pathway: true,
      },
      {
        name: 'Scuola Leonardo da Vinci Firenze',
        city: 'Florence',
        description: 'Réseau d’écoles d’italien reconnu, cours intensifs et préparation aux certifications officielles.',
        link: 'https://www.scuolaleonardo.com',
        priceFrom: 220, weeklyHours: 20, classSize: 12,
        startDates: 'Rentrées chaque lundi',
        visa: true, accommodation: true,
      },
      {
        name: 'Torre di Babele',
        city: 'Rome',
        description: 'École d’italien au cœur de Rome, cours en petits groupes et activités culturelles quotidiennes.',
        link: 'https://www.torredibabele.com',
        priceFrom: 210, weeklyHours: 20, classSize: 10,
        visa: true, accommodation: true,
      },
      {
        name: 'Centro Machiavelli',
        city: 'Florence',
        description: 'École historique de la place Santo Spirito : italien général, art et cuisine en italien.',
        link: 'https://www.centromachiavelli.it',
        priceFrom: 200, weeklyHours: 20,
        visa: true, accommodation: true,
      },
      {
        name: 'Linguaviva',
        city: 'Florence',
        description: 'Cours d’italien toute l’année, préparation aux examens CILS et CELI, hébergement organisé.',
        link: 'https://www.linguaviva.it',
        priceFrom: 205, weeklyHours: 20,
        visa: true, accommodation: true,
      },
      {
        name: 'Società Dante Alighieri – Roma',
        city: 'Rome',
        description: 'Institution culturelle chargée de la diffusion de la langue italienne, certification PLIDA.',
        link: 'https://ladante.it',
        exams: ['PLIDA'],
        priceFrom: 190, weeklyHours: 15,
        visa: true,
      },
    ],
  },

  /* ────────────────────────────── SUISSE ─────────────────────────────────── */
  {
    country: 'Switzerland',
    language: 'Allemand',
    currency: 'CHF',
    levels: CEFR_ALL,
    exams: ['Goethe-Zertifikat', 'telc'],
    courseTypes: STANDARD,
    priceUnit: 'semaine',
    centers: [
      {
        name: 'Klubschule Migros Zürich',
        city: 'Zurich',
        description: 'Le plus grand réseau de formation continue de Suisse : allemand du A1 au C2, cours du soir et intensifs.',
        link: 'https://www.klubschule.ch',
        priceFrom: 600, priceUnit: 'cours', weeklyHours: 4,
        startDates: 'Rentrées trimestrielles',
      },
      {
        name: 'inlingua Bern',
        city: 'Berne',
        description: 'Centre inlingua en Suisse alémanique : allemand général et professionnel, cours particuliers.',
        link: 'https://www.inlingua-bern.ch',
        priceFrom: 500, priceUnit: 'cours', weeklyHours: 6,
      },
      {
        name: 'Sprachenzentrum UZH und ETH Zürich',
        city: 'Zurich',
        description: 'Centre de langues commun à l’Université et à l’EPF de Zurich : allemand académique pour étudiants inscrits.',
        link: 'https://www.sprachenzentrum.uzh.ch',
        courseTypes: ['Standard', 'Intensif', 'Année préparatoire'],
        priceFrom: 400, priceUnit: 'session', weeklyHours: 4,
        startDates: 'Semestres universitaires',
        pathway: true,
      },
      {
        name: 'Alpadia Language School Montreux',
        city: 'Montreux',
        description: 'École de français au bord du Léman : cours intensifs, séjours d’été et préparation DELF.',
        link: 'https://www.alpadia.com',
        language: 'Français',
        exams: ['DELF', 'DALF', 'TCF'],
        priceFrom: 450, weeklyHours: 20, classSize: 12,
        visa: true, accommodation: true,
      },
      {
        name: 'École-club Migros Genève',
        city: 'Genève',
        description: 'Cours de français à Genève, du débutant au perfectionnement, en soirée ou en journée.',
        link: 'https://www.ecole-club.ch',
        language: 'Français',
        exams: ['DELF', 'DALF'],
        priceFrom: 600, priceUnit: 'cours', weeklyHours: 4,
      },
      {
        name: 'Université de Genève – Maison des Langues',
        city: 'Genève',
        description: 'Cours de français langue étrangère de l’Université de Genève, orientés études universitaires.',
        link: 'https://www.unige.ch/maisondeslangues',
        language: 'Français',
        exams: ['DELF', 'DALF'],
        courseTypes: ['Standard', 'Intensif', 'Année préparatoire'],
        priceFrom: 500, priceUnit: 'session', weeklyHours: 6,
        startDates: 'Semestres universitaires',
        pathway: true,
      },
    ],
  },

  /* ────────────────────────────── SUÈDE ─────────────────────────────────── */
  {
    country: 'Sweden',
    language: 'Suédois',
    currency: 'SEK',
    levels: CEFR_TO_C1,
    exams: ['Swedex', 'TISUS'],
    courseTypes: STANDARD,
    priceUnit: 'cours',
    centers: [
      {
        name: 'Folkuniversitetet Stockholm',
        city: 'Stockholm',
        description: 'Institution de formation liée aux universités suédoises : suédois pour étrangers, du A1 au C1.',
        link: 'https://www.folkuniversitetet.se',
        exams: ['Swedex'],
        priceFrom: 5900, weeklyHours: 6,
        startDates: 'Rentrées trimestrielles',
      },
      {
        name: 'Folkuniversitetet Göteborg',
        city: 'Göteborg',
        description: 'Cours de suédois en journée et en soirée, formats intensifs pour les nouveaux arrivants.',
        link: 'https://www.folkuniversitetet.se',
        exams: ['Swedex'],
        priceFrom: 5500, weeklyHours: 6,
      },
      {
        name: 'SFI – Stockholms stad',
        city: 'Stockholm',
        description: 'Suédois pour immigrés (SFI) : cours gratuits financés par la commune pour les résidents enregistrés.',
        link: 'https://start.stockholm/forskola-skola/vuxenutbildning/sfi/',
        courseTypes: ['Intensif', 'Standard', 'Cours du soir'],
        priceFrom: 0, weeklyHours: 15,
        startDates: 'Inscriptions permanentes',
      },
      {
        name: 'Stockholms universitet – Svenska som främmande språk',
        city: 'Stockholm',
        description: 'Cours universitaires de suédois et centre d’examen TISUS, exigé pour les cursus en suédois.',
        link: 'https://www.su.se',
        exams: ['TISUS'],
        courseTypes: ['Standard', 'Intensif', 'Année préparatoire'],
        priceFrom: 0, weeklyHours: 8,
        startDates: 'Semestres universitaires',
        pathway: true,
      },
      {
        name: 'Lunds universitet – Swedish courses',
        city: 'Lund',
        description: 'Cours de suédois pour étudiants internationaux inscrits à l’université, du niveau 1 au niveau avancé.',
        link: 'https://www.lu.se',
        exams: ['TISUS'],
        courseTypes: ['Standard', 'Année préparatoire'],
        priceFrom: 0, weeklyHours: 6,
        pathway: true,
      },
    ],
  },

  /* ───────────────────────────── PORTUGAL ────────────────────────────────── */
  {
    country: 'Portugal',
    language: 'Portugais',
    currency: 'EUR',
    levels: CEFR_TO_C1,
    exams: ['CAPLE'],
    courseTypes: STANDARD,
    priceUnit: 'semaine',
    centers: [
      {
        name: 'CIAL – Centro de Línguas',
        city: 'Lisbonne',
        description: 'École de portugais historique à Lisbonne, cours intensifs et préparation aux examens CAPLE.',
        link: 'https://www.cial.pt',
        accreditations: ['Eaquals'],
        priceFrom: 200, weeklyHours: 20, classSize: 10,
        startDates: 'Rentrées chaque lundi',
        visa: true, accommodation: true,
      },
      {
        name: 'Faculdade de Letras – Universidade de Lisboa',
        city: 'Lisbonne',
        description: 'Cours de portugais langue étrangère de l’université de Lisbonne, semestriels et intensifs d’été.',
        link: 'https://www.letras.ulisboa.pt',
        courseTypes: ['Intensif', 'Standard', 'Année préparatoire'],
        priceFrom: 600, priceUnit: 'session', weeklyHours: 12,
        startDates: 'Semestres universitaires',
        visa: true, pathway: true,
      },
      {
        name: 'Lusa Language School',
        city: 'Lisbonne',
        description: 'École à taille humaine au centre de Lisbonne, cours de portugais européen en petits groupes.',
        link: 'https://www.lusa-language-school.com',
        priceFrom: 180, weeklyHours: 15, classSize: 8,
        visa: true,
      },
      {
        name: 'Portuguese Connection',
        city: 'Lisbonne',
        description: 'Cours de portugais orientés conversation et vie quotidienne, formats intensifs ou du soir.',
        link: 'https://www.portugueseconnection.com',
        priceFrom: 170, weeklyHours: 15,
      },
      {
        name: 'Faculdade de Letras – Universidade do Porto',
        city: 'Porto',
        description: 'Cours de portugais pour étrangers de l’université de Porto, du A1 au C1.',
        link: 'https://www.letras.up.pt',
        courseTypes: ['Standard', 'Intensif', 'Année préparatoire'],
        priceFrom: 550, priceUnit: 'session', weeklyHours: 10,
        visa: true, pathway: true,
      },
      {
        name: 'Camões – Instituto da Cooperação e da Língua',
        city: 'Lisbonne',
        description: 'Institut public chargé de la promotion de la langue portugaise ; référence pour les certifications.',
        link: 'https://www.instituto-camoes.pt',
        exams: ['CAPLE'],
        priceFrom: 250, priceUnit: 'cours', weeklyHours: 6,
      },
    ],
  },

  /* ──────────────────────────────  CHINE ─────────────────────────────────── */
  {
    country: 'China',
    language: 'Chinois',
    currency: 'CNY',
    levels: ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'],
    exams: ['HSK'],
    courseTypes: STANDARD,
    priceUnit: 'semaine',
    centers: [
      {
        name: 'Beijing Language and Culture University (BLCU)',
        city: 'Pékin',
        description: 'L’université chinoise de référence pour l’enseignement du mandarin aux étrangers, programmes semestriels et annuels.',
        link: 'https://www.blcu.edu.cn',
        courseTypes: ['Intensif', 'Standard', 'Année préparatoire', 'Préparation examen'],
        priceFrom: 11600, priceUnit: 'session', weeklyHours: 20,
        startDates: 'Semestres de septembre et de mars',
        visa: true, accommodation: true, pathway: true,
      },
      {
        name: 'Fudan University – International Cultural Exchange School',
        city: 'Shanghai',
        description: 'Programmes de langue chinoise de l’université Fudan, du débutant au niveau avancé, avec visa étudiant.',
        link: 'https://ices.fudan.edu.cn',
        courseTypes: ['Intensif', 'Standard', 'Année préparatoire'],
        priceFrom: 12000, priceUnit: 'session', weeklyHours: 20,
        visa: true, accommodation: true, pathway: true,
      },
      {
        name: 'LTL Mandarin School Beijing',
        city: 'Pékin',
        description: 'École privée d’immersion : cours en petit groupe ou individuels, séjours en famille chinoise.',
        link: 'https://www.ltl-beijing.com',
        priceFrom: 2400, weeklyHours: 20, classSize: 5,
        startDates: 'Rentrées chaque lundi',
        visa: true, accommodation: true,
      },
      {
        name: 'Mandarin House Shanghai',
        city: 'Shanghai',
        description: 'Réseau d’écoles de mandarin implanté dans les grandes villes chinoises, préparation HSK.',
        link: 'https://www.mandarinhouse.com',
        priceFrom: 2200, weeklyHours: 20,
        visa: true, accommodation: true,
      },
      {
        name: 'That’s Mandarin Shanghai',
        city: 'Shanghai',
        description: 'Cours de mandarin avec méthode propre et forte composante numérique, formats flexibles.',
        link: 'https://www.thatsmandarin.com',
        priceFrom: 2000, weeklyHours: 20, classSize: 6,
        visa: true, accommodation: true,
      },
      {
        name: 'Hutong School Beijing',
        city: 'Pékin',
        description: 'Écoles de mandarin combinant cours de langue, stages et immersion culturelle.',
        link: 'https://www.hutong-school.com',
        priceFrom: 1900, weeklyHours: 20,
        visa: true, accommodation: true,
      },
      {
        name: 'Keats Chinese School',
        city: 'Kunming',
        description: 'Immersion intensive dans le Yunnan, cours particuliers et petits groupes toute l’année.',
        link: 'https://www.keatschinese.com',
        courseTypes: ['Intensif', 'Cours particuliers', 'Préparation examen'],
        priceFrom: 2600, weeklyHours: 25, classSize: 4,
        visa: true, accommodation: true,
      },
    ],
  },

  /* ───────────────────────────── BELGIQUE ────────────────────────────────── */
  {
    country: 'Belgium',
    language: 'Français',
    currency: 'EUR',
    levels: CEFR_ALL,
    exams: ['DELF', 'DALF', 'TCF'],
    courseTypes: STANDARD,
    priceUnit: 'cours',
    centers: [
      {
        name: 'CLL Centres de Langues – Louvain-la-Neuve',
        city: 'Louvain-la-Neuve',
        description: 'Centre de langues issu de l’UCLouvain : français langue étrangère, formats intensifs et du soir.',
        link: 'https://www.cll.be',
        priceFrom: 450, weeklyHours: 6,
        startDates: 'Rentrées trimestrielles',
        pathway: true,
      },
      {
        name: 'Alliance Française de Bruxelles-Europe',
        city: 'Bruxelles',
        description: 'Cours de français et centre d’examen DELF/DALF au cœur de la capitale européenne.',
        link: 'https://www.alliancefr.be',
        priceFrom: 400, weeklyHours: 6,
      },
      {
        name: 'KU Leuven – Instituut voor Levende Talen (ILT)',
        city: 'Louvain',
        description: 'Institut de langues de la KU Leuven : néerlandais académique et année préparatoire aux études en néerlandais.',
        link: 'https://ilt.kuleuven.be',
        language: 'Néerlandais',
        exams: ['CNaVT', 'NT2'],
        courseTypes: ['Intensif', 'Standard', 'Année préparatoire'],
        priceFrom: 1200, priceUnit: 'session', weeklyHours: 20,
        startDates: 'Semestres universitaires',
        visa: true, pathway: true,
      },
      {
        name: 'CVO Brussel',
        city: 'Bruxelles',
        description: 'Enseignement pour adultes subventionné : cours de néerlandais accessibles, du A1 au C1.',
        link: 'https://www.cvobrussel.be',
        language: 'Néerlandais',
        exams: ['CNaVT'],
        priceFrom: 120, weeklyHours: 4,
      },
      {
        name: 'Berlitz Bruxelles',
        city: 'Bruxelles',
        description: 'Méthode Berlitz en immersion, cours particuliers ou en mini-groupes, français et néerlandais.',
        link: 'https://www.berlitz.com/fr-be',
        courseTypes: ['Intensif', 'Cours particuliers', 'En ligne'],
        priceFrom: 900, weeklyHours: 10, classSize: 4,
      },
    ],
  },

  /* ──────────────────────────── LUXEMBOURG ───────────────────────────────── */
  {
    country: 'Luxembourg',
    language: 'Français',
    currency: 'EUR',
    levels: CEFR_ALL,
    exams: ['DELF', 'DALF'],
    courseTypes: STANDARD,
    priceUnit: 'cours',
    centers: [
      {
        name: 'Institut National des Langues (INL) – français',
        city: 'Luxembourg',
        description: 'Établissement public de référence : cours de français à tarif très accessible, du A1 au C2.',
        link: 'https://www.inll.lu',
        priceFrom: 100, weeklyHours: 4,
        startDates: 'Deux semestres par an',
      },
      {
        name: 'Institut National des Langues (INL) – allemand',
        city: 'Luxembourg',
        description: 'Cours d’allemand de l’Institut National des Langues, indispensables pour les cursus germanophones.',
        link: 'https://www.inll.lu',
        language: 'Allemand',
        exams: ['Goethe-Zertifikat', 'telc'],
        priceFrom: 100, weeklyHours: 4,
      },
      {
        name: 'Prolingua Language Centre',
        city: 'Luxembourg',
        description: 'Centre privé proposant français, allemand et luxembourgeois en cours du soir ou intensifs.',
        link: 'https://www.prolingua.lu',
        priceFrom: 350, weeklyHours: 4,
      },
      {
        name: 'Berlitz Luxembourg',
        city: 'Luxembourg',
        description: 'Cours en immersion, individuels ou en mini-groupes, orientés usage professionnel et académique.',
        link: 'https://www.berlitz.com',
        courseTypes: ['Intensif', 'Cours particuliers', 'En ligne'],
        priceFrom: 900, weeklyHours: 10, classSize: 4,
      },
      {
        name: 'inlingua Luxembourg',
        city: 'Luxembourg',
        description: 'Cours de langues pour adultes, formats flexibles compatibles avec un emploi du temps étudiant.',
        link: 'https://www.inlingua.lu',
        priceFrom: 400, weeklyHours: 4,
      },
    ],
  },
];

async function main() {
  let created = 0;
  let updated = 0;

  for (const block of catalog) {
    for (const c of block.centers) {
      const levels = c.levels ?? block.levels ?? CEFR_ALL;
      const data = {
        name: c.name,
        country: block.country,
        city: c.city,
        language: c.language ?? block.language,
        levels: levels.length > 1 ? `${levels[0]}-${levels[levels.length - 1]}` : levels[0],
        levelsOffered: levels,
        link: c.link,
        description: c.description,
        courseTypes: c.courseTypes ?? block.courseTypes ?? STANDARD,
        examsPrepared: c.exams ?? block.exams ?? [],
        accreditations: c.accreditations ?? [],
        universityPartners: [] as string[],
        priceFrom: c.priceFrom ?? null,
        priceUnit: c.priceFrom != null ? (c.priceUnit ?? block.priceUnit ?? 'semaine') : null,
        currency: block.currency,
        weeklyHours: c.weeklyHours ?? null,
        classSize: c.classSize ?? null,
        startDates: c.startDates ?? null,
        offersVisaSupport: !!c.visa,
        offersAccommodation: !!c.accommodation,
        offersPathway: !!c.pathway,
        isPartner: false,
        isValidated: true,
      };

      // Pas de contrainte d'unicité sur `name` : on déduplique sur (name, country)
      // pour que le script reste rejouable.
      const existing = await prisma.languageCenter.findFirst({
        where: { name: data.name, country: data.country },
        select: { id: true },
      });

      if (existing) {
        await prisma.languageCenter.update({ where: { id: existing.id }, data });
        updated++;
      } else {
        await prisma.languageCenter.create({ data });
        created++;
      }
    }
  }

  const total = await prisma.languageCenter.count();
  const byCountry = await prisma.languageCenter.groupBy({ by: ['country'], _count: { _all: true } });

  console.log(`✅ Centres de langue — ${created} créés, ${updated} mis à jour, ${total} en base.`);
  byCountry
    .sort((a, b) => b._count._all - a._count._all)
    .forEach(r => console.log(`   ${r.country.padEnd(16)} ${r._count._all}`));
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
