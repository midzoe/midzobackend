import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Catalogue des centres de langue **au pays de départ** (2026-08-12).
 *
 * Pendant du catalogue à destination (`seed-language-centers.ts`) : ici, le `country`
 * est un **pays d'origine du module visa** — le vocabulaire anglais de `ORIGINS` dans
 * `seed-visa-rules.ts`, repris côté front par `VISA_ORIGIN_COUNTRIES`. Ce sont les
 * instituts où l'on atteint le niveau exigé **avant** de déposer un dossier : c'est là
 * que se passent le TCF/TEF pour la France et le Canada, le TestDaF et les Goethe-Zertifikat
 * pour l'Allemagne, l'IELTS et le TOEFL pour le monde anglophone.
 *
 * ⚠️ **Vérifié** ici, source par source : l'existence de l'établissement, sa ville, la
 * langue enseignée, son site officiel et les certifications qu'il fait passer.
 * ⚠️ **Volontairement vide** : tarifs, volumes horaires, tailles de classe, calendriers,
 * adresses, e-mails et téléphones. Ils varient d'une session à l'autre et ne s'inventent
 * pas — ils se saisissent depuis l'admin, fiche par fiche.
 *
 * `offersPathway` n'est vrai que pour les instituts qui hébergent un **Espace Campus
 * France** (l'orientation vers l'université y est un service réel). `offersVisaSupport`
 * est faux partout : un centre au pays de départ ne parraine aucun visa.
 * `isPartner` reste faux : aucun partenariat Midzo n'est signé.
 *
 * ⚠️ **Le Niger n'a aucune fiche** : la coopération culturelle française y est suspendue
 * depuis 2023 et aucun centre de langue actif n'a pu être vérifié. Mieux vaut un pays
 * vide qu'une fiche inventée — à compléter à la main le jour où l'information existe.
 */

type Center = {
  name: string;
  city: string;
  description: string;
  language: string;
  link?: string;
  levels?: string[];
  courseTypes?: string[];
  exams?: string[];
  accreditations?: string[];
  /** Héberge un Espace Campus France : accompagnement vers l'université à l'étranger. */
  pathway?: boolean;
};

type CountryBlock = {
  /** Vocabulaire anglais des pays d'origine visa (VISA_ORIGIN_COUNTRIES). */
  country: string;
  currency: string;
  centers: Center[];
};

const CEFR_ALL = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const HSK = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];
const STANDARD = ['Intensif', 'Standard', 'Cours du soir', 'En ligne', 'Préparation examen'];

/* Jeux de certifications par filière de destination. */
const FR_FULL = ['DELF', 'DALF', 'TCF', 'TEF'];
const FR_DIPLOMAS = ['DELF', 'DALF'];
const DE_FULL = ['Goethe-Zertifikat', 'TestDaF'];
const DE_BASE = ['Goethe-Zertifikat'];

/** Formule répétée : les instituts culturels officiels enseignent tous du A1 au C2. */
const goethe = (name: string, city: string, link: string, exams = DE_FULL): Center => ({
  name, city, link, language: 'Allemand', exams,
  description: `Institut culturel officiel de la République fédérale d’Allemagne à ${city} : cours d’allemand du A1 au C2 et passage des certifications exigées par les universités allemandes.`,
});

const catalog: CountryBlock[] = [
  /* ──────────────────────────────── TOGO ─────────────────────────────────── */
  {
    country: 'Togo',
    currency: 'XOF',
    centers: [
      {
        name: 'Institut français du Togo – Centre de langues',
        city: 'Lomé',
        language: 'Français',
        link: 'https://institutfrancais-togo.com',
        exams: [...FR_FULL, 'TOEIC'],
        description: 'Seul organisme habilité au Togo à faire passer les certifications de français : TCF tout public, TCF Québec et Canada, TEF Canada, DELF et DALF, avec ateliers de préparation.',
        pathway: true,
      },
      goethe('Goethe-Institut Togo', 'Lomé', 'https://www.goethe.de/ins/tg/fr/index.html'),
      {
        name: 'Institut Confucius de l’Université de Lomé',
        city: 'Lomé',
        language: 'Chinois',
        link: 'https://univ-lome.tg',
        levels: HSK,
        exams: ['HSK'],
        description: 'Seul centre d’examen HSK et HSKK du Togo : cours de chinois en journée et en soirée, ouverts aux étudiants de toute l’Afrique de l’Ouest.',
      },
    ],
  },

  /* ──────────────────────────────── BÉNIN ────────────────────────────────── */
  {
    country: 'Benin',
    currency: 'XOF',
    centers: [
      {
        name: 'Institut français du Bénin – Cotonou',
        city: 'Cotonou',
        language: 'Français',
        link: 'https://if-benin.com',
        exams: FR_FULL,
        description: 'Institut de référence entre l’ambassade de France et la Présidence : cours de français, certifications et Espace Campus France pour les candidats aux études en France.',
        pathway: true,
      },
      {
        name: 'Institut français du Bénin – antenne de Parakou',
        city: 'Parakou',
        language: 'Français',
        link: 'https://if-benin.com',
        exams: FR_DIPLOMAS,
        description: 'Antenne nord de l’Institut français du Bénin : cours de français et sessions de certification sans descendre à Cotonou.',
      },
      {
        name: 'Institut Confucius de l’Université d’Abomey-Calavi',
        city: 'Abomey-Calavi',
        language: 'Chinois',
        levels: HSK,
        exams: ['HSK'],
        description: 'Créé en 2009 avec l’université Jiaotong de Chongqing : cours de chinois et accompagnement des candidats aux bourses du gouvernement chinois.',
      },
    ],
  },

  /* ───────────────────────────── CÔTE D’IVOIRE ───────────────────────────── */
  {
    country: "Côte d'Ivoire",
    currency: 'XOF',
    centers: [
      {
        name: 'Institut français de Côte d’Ivoire – Centre de langues',
        city: 'Abidjan',
        language: 'Français',
        link: 'https://institutfrancais.ci',
        exams: [...FR_FULL, 'TEFAQ'],
        description: 'Centre d’examen pour le TCF, le TEF, le TEFAQ, le e-TEF naturalisation et les diplômes DELF/DALF, avec ateliers de préparation en présentiel et à distance.',
        pathway: true,
      },
      goethe('Goethe-Institut Côte d’Ivoire', 'Abidjan', 'https://www.goethe.de/ins/ci/fr/index.html'),
      {
        name: 'Institut Confucius de l’Université Félix Houphouët-Boigny',
        city: 'Abidjan',
        language: 'Chinois',
        levels: HSK,
        exams: ['HSK'],
        description: 'Institut Confucius du campus de Cocody : cours de chinois et sessions d’examen HSK organisées sur place.',
      },
    ],
  },

  /* ─────────────────────────────── SÉNÉGAL ───────────────────────────────── */
  {
    country: 'Senegal',
    currency: 'XOF',
    centers: [
      {
        name: 'Institut français du Sénégal – Dakar',
        city: 'Dakar',
        language: 'Français',
        link: 'https://institutfrancais-senegal.com',
        exams: FR_FULL,
        description: 'Institut Léopold Sédar Senghor : cours et certifications de français, et Espace Campus France pour construire son dossier d’études en France.',
        pathway: true,
      },
      {
        name: 'Institut français du Sénégal – Saint-Louis',
        city: 'Saint-Louis',
        language: 'Français',
        link: 'https://institutfrancais-senegal.com',
        exams: FR_DIPLOMAS,
        description: 'Antenne de Saint-Louis de l’Institut français du Sénégal : cours de français et sessions de certification.',
      },
      goethe('Goethe-Institut Senegal', 'Dakar', 'https://www.goethe.de/ins/sn/fr/index.html'),
      {
        name: 'British Council Senegal',
        city: 'Dakar',
        language: 'Anglais',
        link: 'https://www.britishcouncil.com.sn/en',
        exams: ['IELTS', 'Cambridge'],
        description: 'Centre d’examen IELTS de Dakar et cours d’anglais du British Council, pour les candidats aux universités anglophones.',
      },
      {
        name: 'Instituto Cervantes de Dakar',
        city: 'Dakar',
        language: 'Espagnol',
        link: 'https://dakar.cervantes.es',
        exams: ['DELE', 'SIELE'],
        description: 'Institut officiel de la langue espagnole à Dakar : cours d’espagnol et diplômes DELE délivrés au nom du ministère espagnol de l’Éducation.',
      },
    ],
  },

  /* ─────────────────────────────── GUINÉE ────────────────────────────────── */
  {
    country: 'Guinea',
    currency: 'GNF',
    centers: [
      {
        name: 'Institut français de Guinée – Centre de langues',
        city: 'Conakry',
        language: 'Français',
        link: 'https://institutfrancais-guinee.fr',
        exams: FR_FULL,
        description: 'Centre culturel franco-guinéen : français général et de spécialité (français universitaire, administratif, médical), centre d’examen TCF, TEF, DELF et DALF.',
        pathway: true,
      },
    ],
  },

  /* ──────────────────────────────── MALI ─────────────────────────────────── */
  {
    country: 'Mali',
    currency: 'XOF',
    centers: [
      {
        name: 'Institut français du Mali – Centre de langues',
        city: 'Bamako',
        language: 'Français',
        link: 'https://www.institutfrancaismali.org',
        exams: ['DELF', 'DALF', 'TCF'],
        description: 'Seul organisme habilité à Bamako pour les certifications de français : préparation et passage du DELF, du DALF et du TCF.',
        pathway: true,
      },
      {
        name: 'Alliance française de Mopti',
        city: 'Mopti',
        language: 'Français',
        exams: FR_DIPLOMAS,
        description: 'Alliance française de Mopti : cours de français et session d’examen DELF/DALF pour le centre du pays.',
      },
      {
        name: 'Institut Confucius de l’Université des Lettres et des Sciences Humaines de Bamako',
        city: 'Bamako',
        language: 'Chinois',
        levels: HSK,
        exams: ['HSK'],
        description: 'Institut Confucius de l’ULSHB : cours de chinois et formations diplômantes en langue et culture chinoises.',
      },
    ],
  },

  /* ────────────────────────────── BURKINA FASO ───────────────────────────── */
  {
    country: 'Burkina Faso',
    currency: 'XOF',
    centers: [
      {
        name: 'Institut français du Burkina Faso – Centre de langues de Ouagadougou',
        city: 'Ouagadougou',
        language: 'Français',
        link: 'http://institutfrancais-burkinafaso.com',
        exams: FR_FULL,
        description: 'Seul centre agréé du Burkina Faso pour la formation en français langue étrangère et les certifications officielles de français.',
        pathway: true,
      },
      {
        name: 'Institut français du Burkina Faso – antenne de Bobo-Dioulasso',
        city: 'Bobo-Dioulasso',
        language: 'Français',
        link: 'http://institutfrancais-burkinafaso.com',
        exams: FR_DIPLOMAS,
        description: 'Antenne de Bobo-Dioulasso de l’Institut français : cours de français et sessions de certification dans l’ouest du pays.',
      },
      goethe('Goethe-Institut Burkina Faso', 'Ouagadougou', 'https://www.goethe.de/ins/bf/fr/index.html', DE_BASE),
    ],
  },

  /* ─────────────────────────────── CAMEROUN ──────────────────────────────── */
  {
    country: 'Cameroon',
    currency: 'XAF',
    centers: [
      {
        name: 'Institut français du Cameroun – Yaoundé',
        city: 'Yaoundé',
        language: 'Français',
        link: 'https://www.ifcameroun.com',
        exams: FR_FULL,
        description: 'Centre de langues et d’examens de l’Institut français du Cameroun : certifications et tests de français pour les projets d’études et d’immigration.',
        pathway: true,
      },
      {
        name: 'Institut français du Cameroun – Douala',
        city: 'Douala',
        language: 'Français',
        link: 'https://www.ifcameroun.com',
        exams: FR_FULL,
        description: 'Antenne de Douala : cours de français et sessions de certification pour la capitale économique.',
      },
      goethe('Goethe-Institut Kamerun', 'Yaoundé', 'https://www.goethe.de/ins/cm/fr/index.html'),
      {
        name: 'Sprachlernzentrum Douala (SLZ)',
        city: 'Douala',
        language: 'Allemand',
        link: 'https://www.slz-douala.org/fr/',
        exams: DE_FULL,
        description: 'Centre d’apprentissage de l’allemand partenaire du Goethe-Institut de Yaoundé : cours du A1 au C1 et préparation aux examens allemands.',
      },
      {
        name: 'Institut de Langue Allemande (ILA) Douala',
        city: 'Douala',
        language: 'Allemand',
        link: 'https://www.ila-cm.com/cours-de-langue-allemande',
        exams: DE_BASE,
        description: 'Partenaire du Goethe-Institut Kamerun : cours intensifs d’allemand en matinée ou en soirée, orientés départ en Allemagne.',
      },
      {
        name: 'Erfolg-Zentrum',
        city: 'Douala',
        language: 'Allemand',
        link: 'https://erfolg-zentrum.de/',
        exams: DE_BASE,
        description: 'Centre privé d’allemand langue étrangère implanté à Douala et Yaoundé, spécialisé dans la préparation au départ pour l’Allemagne.',
      },
    ],
  },

  /* ──────────────────────────────── TCHAD ────────────────────────────────── */
  {
    country: 'Chad',
    currency: 'XAF',
    centers: [
      {
        name: 'Institut français du Tchad',
        city: 'N’Djaména',
        language: 'Français',
        link: 'https://www.institut-francais-tchad.org',
        exams: FR_FULL,
        description: 'Institut français de N’Djaména : coopération linguistique, cours de français et Espace Campus France.',
        pathway: true,
      },
      {
        name: 'CALF – Centre d’apprentissage de la langue française',
        city: 'N’Djaména',
        language: 'Français',
        link: 'https://calftchadndja.org',
        exams: FR_FULL,
        description: 'Centre voisin de l’Institut français : formation en français tous niveaux et centre d’examen DELF/DALF, TEF et TCF.',
      },
    ],
  },

  /* ──────────────────────────────── GABON ────────────────────────────────── */
  {
    country: 'Gabon',
    currency: 'XAF',
    centers: [
      {
        name: 'Institut français du Gabon',
        city: 'Libreville',
        language: 'Français',
        link: 'https://institutfrancais-gabon.com',
        exams: FR_FULL,
        description: 'Institut du boulevard Triomphal : cours de français, passage du TCF sur place ou à distance et TEF Canada désormais organisé à Libreville.',
        pathway: true,
      },
      {
        name: 'Institut Confucius de l’Université Omar Bongo',
        city: 'Libreville',
        language: 'Chinois',
        link: 'https://confuciusuob.com',
        levels: HSK,
        exams: ['HSK'],
        description: 'Institut Confucius installé sur le campus de l’Université Omar Bongo : apprentissage du mandarin à son rythme.',
      },
    ],
  },

  /* ─────────────────────────── CONGO-BRAZZAVILLE ─────────────────────────── */
  {
    country: 'Republic of the Congo',
    currency: 'XAF',
    centers: [
      {
        name: 'Institut français du Congo – Brazzaville',
        city: 'Brazzaville',
        language: 'Français',
        link: 'https://institutfrancais-congo.com',
        exams: FR_DIPLOMAS,
        description: 'Cours de français adaptés aux projets universitaires et professionnels, avec certification par les diplômes officiels DELF et DALF.',
        pathway: true,
      },
      {
        name: 'Institut français du Congo – Pointe-Noire',
        city: 'Pointe-Noire',
        language: 'Français',
        link: 'https://www.ifc-pointenoire.com',
        exams: FR_FULL,
        description: 'Antenne de Pointe-Noire : cours de langues, examens de certification et cours de préparation à ces diplômes.',
      },
    ],
  },

  /* ─────────────────────────────── RD CONGO ──────────────────────────────── */
  {
    country: 'DR Congo',
    currency: 'CDF',
    centers: [
      {
        name: 'Institut français de Kinshasa – Halle de la Gombe',
        city: 'Kinshasa',
        language: 'Français',
        link: 'https://institutfrancais-kinshasa.org',
        exams: ['DELF', 'DALF', 'TCF'],
        description: 'Présent à Kinshasa depuis 1967 : formations certifiantes en français (DELF, DALF, TCF) et Espace Campus France.',
        pathway: true,
      },
      {
        name: 'Institut français de Lubumbashi',
        city: 'Lubumbashi',
        language: 'Français',
        link: 'https://www.ifrdc.org',
        exams: FR_DIPLOMAS,
        description: 'Antenne du Katanga du réseau français en RDC : cours de français et sessions de certification.',
      },
      {
        name: 'Institut français de Goma',
        city: 'Goma',
        language: 'Français',
        link: 'https://institutfrancaisgoma.org',
        exams: FR_DIPLOMAS,
        description: 'Institut français de Goma, à l’est du pays : cours de français et certifications officielles.',
      },
    ],
  },

  /* ─────────────────────────────── NIGERIA ───────────────────────────────── */
  {
    country: 'Nigeria',
    currency: 'NGN',
    centers: [
      {
        name: 'Alliance Française de Lagos – Mike Adenuga Centre',
        city: 'Lagos',
        language: 'Français',
        link: 'https://www.afnigeria.org/lagos/',
        exams: FR_FULL,
        description: 'Fondée en 1959, la plus grande Alliance française du Nigeria (environ 4 000 inscrits par an) : cours de français et certifications officielles.',
      },
      {
        name: 'Alliance Française d’Abuja',
        city: 'Abuja',
        language: 'Français',
        link: 'https://www.afnigeria.org',
        exams: FR_DIPLOMAS,
        description: 'Alliance française de la capitale fédérale : cours de français tous niveaux et préparation aux diplômes DELF/DALF.',
      },
      goethe('Goethe-Institut Nigeria', 'Lagos', 'https://www.goethe.de/ins/ng/en/index.html'),
      {
        name: 'British Council Nigeria',
        city: 'Lagos',
        language: 'Anglais',
        link: 'https://www.britishcouncil.org.ng',
        exams: ['IELTS', 'Cambridge'],
        description: 'Cours d’anglais et centre d’examen IELTS du British Council, pour les dossiers vers le Royaume-Uni, le Canada et l’Australie.',
      },
    ],
  },

  /* ──────────────────────────────── GHANA ────────────────────────────────── */
  {
    country: 'Ghana',
    currency: 'GHS',
    centers: [
      {
        name: 'Alliance Française d’Accra',
        city: 'Accra',
        language: 'Français',
        link: 'https://afaccra.org',
        exams: [...FR_FULL, 'DAEFLE'],
        description: 'Fondée en 1957, seul centre d’examen du Ghana pour les diplômes et tests de français reconnus internationalement (DELF, DALF, DAEFLE, TCF, TEF).',
      },
      {
        name: 'Goethe-Institut Ghana',
        city: 'Accra',
        language: 'Allemand',
        link: 'https://www.goethe.de/ins/gh/en/index.html',
        exams: DE_FULL,
        description: 'Centre agréé TestDaF à Accra : cours extensifs, intensifs et super-intensifs, et examens Goethe reconnus par les universités allemandes.',
      },
      {
        name: 'British Council Ghana',
        city: 'Accra',
        language: 'Anglais',
        link: 'https://www.britishcouncil.org.gh',
        exams: ['IELTS', 'Cambridge'],
        description: 'Centre d’examen IELTS d’Accra et cours d’anglais académique du British Council.',
      },
    ],
  },

  /* ──────────────────────────────── KENYA ────────────────────────────────── */
  {
    country: 'Kenya',
    currency: 'KES',
    centers: [
      {
        name: 'Alliance Française de Nairobi',
        city: 'Nairobi',
        language: 'Français',
        link: 'https://afkenya.org',
        exams: ['DELF', 'DALF', 'TCF'],
        description: 'Principal centre culturel francophone du Kenya : cours de français en immersion et certifications officielles.',
      },
      {
        name: 'Goethe-Institut Kenya',
        city: 'Nairobi',
        language: 'Allemand',
        link: 'https://www.goethe.de/ins/ke/en/index.html',
        exams: DE_FULL,
        description: 'Implanté au Kenya depuis 1963 : cours d’allemand longs, intensifs et de préparation aux examens, à Nairobi et à Mombasa.',
      },
      {
        name: 'British Council Kenya',
        city: 'Nairobi',
        language: 'Anglais',
        link: 'https://www.britishcouncil.co.ke',
        exams: ['IELTS', 'Cambridge'],
        description: 'Centre d’examen IELTS de Nairobi : le test d’anglais demandé pour étudier au Royaume-Uni, au Canada ou en Australie.',
      },
    ],
  },

  /* ──────────────────────────────── MAROC ────────────────────────────────── */
  {
    country: 'Morocco',
    currency: 'MAD',
    centers: [
      {
        name: 'Institut français du Maroc – Rabat',
        city: 'Rabat',
        language: 'Français',
        link: 'https://if-maroc.org',
        exams: FR_FULL,
        description: 'Réseau de douze instituts au Maroc : cours de français selon l’âge, le niveau et le projet, et certifications officielles.',
        pathway: true,
      },
      {
        name: 'Institut français du Maroc – Casablanca',
        city: 'Casablanca',
        language: 'Français',
        link: 'https://if-maroc.org/casablanca/cours/',
        exams: FR_FULL,
        description: 'Centre de langue de Casablanca : cours de français tous publics et passage des diplômes DELF/DALF et tests TCF/TEF.',
      },
      {
        name: 'Institut français du Maroc – Marrakech',
        city: 'Marrakech',
        language: 'Français',
        link: 'https://if-maroc.org/marrakech/',
        exams: FR_DIPLOMAS,
        description: 'Institut français de Marrakech : cours de français et sessions de certification.',
      },
      goethe('Goethe-Institut Maroc – Rabat', 'Rabat', 'https://www.goethe.de/ins/ma/fr/index.html'),
      goethe('Goethe-Institut Maroc – Casablanca', 'Casablanca', 'https://www.goethe.de/ins/ma/fr/index.html'),
      {
        name: 'British Council Morocco',
        city: 'Rabat',
        language: 'Anglais',
        link: 'https://www.britishcouncil.ma',
        exams: ['IELTS', 'Cambridge'],
        description: 'Cours d’anglais et centre d’examen IELTS du British Council au Maroc.',
      },
      {
        name: 'Amideast Morocco',
        city: 'Rabat',
        language: 'Anglais',
        link: 'https://www.amideast.org/morocco',
        exams: ['TOEFL', 'IELTS'],
        description: 'Organisation américaine à but non lucratif présente au Maghreb depuis 1951 : cours d’anglais général et académique, préparation au TOEFL.',
      },
      {
        name: 'Instituto Cervantes de Rabat',
        city: 'Rabat',
        language: 'Espagnol',
        link: 'https://rabat.cervantes.es',
        exams: ['DELE', 'SIELE'],
        description: 'Institut officiel espagnol à Rabat : cours d’espagnol et diplômes DELE, utiles pour les universités espagnoles.',
      },
    ],
  },

  /* ──────────────────────────────── TUNISIE ──────────────────────────────── */
  {
    country: 'Tunisia',
    currency: 'TND',
    centers: [
      {
        name: 'Institut français de Tunisie – Centre de langue de Tunis',
        city: 'Tunis',
        language: 'Français',
        link: 'https://www.institutfrancais-tunisie.com',
        exams: FR_FULL,
        description: 'Opérateur de la coopération linguistique française en Tunisie : formations toute l’année pour étudiants et adultes, tests et diplômes reconnus internationalement.',
        pathway: true,
      },
      {
        name: 'Institut français de Tunisie – Sousse',
        city: 'Sousse',
        language: 'Français',
        link: 'https://www.institutfrancais-tunisie.com',
        exams: FR_DIPLOMAS,
        description: 'Centre de langue de Sousse : cours de français et sessions de certification.',
      },
      {
        name: 'Institut français de Tunisie – Sfax',
        city: 'Sfax',
        language: 'Français',
        link: 'https://www.institutfrancais-tunisie.com',
        exams: FR_DIPLOMAS,
        description: 'Centre de langue de Sfax : cours de français et sessions de certification pour le sud du pays.',
      },
      goethe('Goethe-Institut Tunisie', 'Tunis', 'https://www.goethe.de/ins/tn/fr/index.html'),
      {
        name: 'British Council Tunisia',
        city: 'Tunis',
        language: 'Anglais',
        link: 'https://www.britishcouncil.tn/en',
        exams: ['IELTS', 'Cambridge'],
        description: 'Cours de préparation à l’IELTS (à partir du niveau B1) et sessions d’examen dans cinq villes tunisiennes.',
      },
      {
        name: 'Amideast Tunisia',
        city: 'Tunis',
        language: 'Anglais',
        link: 'https://www.amideast.org/tunisia',
        exams: ['TOEFL', 'IELTS'],
        description: 'Présent à Tunis depuis 1973, avec des centres à Sousse et aux Berges du Lac : cours d’anglais et préparation au TOEFL, au SAT et au GRE.',
      },
      {
        name: 'Instituto Cervantes de Tunis',
        city: 'Tunis',
        language: 'Espagnol',
        link: 'https://tunez.cervantes.es',
        exams: ['DELE'],
        description: 'Institut officiel espagnol de l’avenue de la Liberté : cours d’espagnol et diplômes DELE.',
      },
    ],
  },

  /* ──────────────────────────────── ÉGYPTE ───────────────────────────────── */
  {
    country: 'Egypt',
    currency: 'EGP',
    centers: [
      {
        name: 'Institut français d’Égypte – Le Caire',
        city: 'Le Caire',
        language: 'Français',
        link: 'https://www.ifegypte.com',
        exams: ['DELF', 'DALF', 'TCF'],
        description: 'Tête d’un réseau de sept centres de langue en Égypte : cours de français du débutant à l’avancé et certifications officielles.',
        pathway: true,
      },
      {
        name: 'Institut français d’Égypte – Alexandrie',
        city: 'Alexandrie',
        language: 'Français',
        link: 'https://www.ifegypte.com',
        exams: FR_DIPLOMAS,
        description: 'Centre de langue d’Alexandrie de l’Institut français d’Égypte : cours de français et sessions de certification.',
      },
      goethe('Goethe-Institut Kairo', 'Le Caire', 'https://www.goethe.de/ins/eg/de/index.html'),
      goethe('Goethe-Institut Alexandria', 'Alexandrie', 'https://www.goethe.de/ins/eg/de/index.html'),
      {
        name: 'British Council Egypt',
        city: 'Le Caire',
        language: 'Anglais',
        link: 'https://www.britishcouncil.org.eg/en/english/courses-adults',
        exams: ['IELTS', 'Cambridge'],
        description: 'Cours d’anglais du A1 au C1 au Caire, à Gizeh et à Alexandrie, et préparation à l’IELTS conçue avec un co-créateur du test.',
      },
      {
        name: 'Amideast Egypt',
        city: 'Le Caire',
        language: 'Anglais',
        link: 'https://www.amideast.org/egypt',
        exams: ['TOEFL', 'IELTS'],
        description: 'Centres de formation du Caire et d’Alexandrie : anglais général, de conversation, des affaires et anglais académique.',
      },
      {
        name: 'Instituto Cervantes de El Cairo',
        city: 'Le Caire',
        language: 'Espagnol',
        link: 'https://elcairo.cervantes.es',
        exams: ['DELE'],
        description: 'Institut officiel espagnol du Caire : cours d’espagnol général et spécialisés, diplômes DELE.',
      },
    ],
  },

  /* ─────────────────────────── AFRIQUE DU SUD ────────────────────────────── */
  {
    country: 'South Africa',
    currency: 'ZAR',
    centers: [
      {
        name: 'Goethe-Institut South Africa',
        city: 'Johannesburg',
        language: 'Allemand',
        link: 'https://www.goethe.de/ins/za/en/index.html',
        exams: DE_FULL,
        description: 'Cours d’allemand à tous les niveaux et examens de langue attestant du niveau exigé par les universités allemandes.',
      },
      {
        name: 'French Institute of South Africa (IFAS)',
        city: 'Johannesburg',
        language: 'Français',
        link: 'https://frenchinstitute.org.za',
        exams: FR_DIPLOMAS,
        description: 'Institut français d’Afrique du Sud : réseau d’enseignement du français, formation des enseignants et accompagnement vers les études supérieures en France.',
        pathway: true,
      },
    ],
  },
];

async function main() {
  let created = 0;
  let updated = 0;

  for (const block of catalog) {
    for (const c of block.centers) {
      const levels = c.levels ?? CEFR_ALL;
      const data = {
        name: c.name,
        country: block.country,
        city: c.city,
        language: c.language,
        levels: levels.length > 1 ? `${levels[0]}-${levels[levels.length - 1]}` : levels[0],
        levelsOffered: levels,
        link: c.link ?? null,
        description: c.description,
        courseTypes: c.courseTypes ?? STANDARD,
        examsPrepared: c.exams ?? [],
        accreditations: c.accreditations ?? [],
        universityPartners: [] as string[],
        // Tarifs, horaires et calendriers : laissés vides, ils se saisissent à la main.
        priceFrom: null,
        priceUnit: null,
        currency: block.currency,
        weeklyHours: null,
        classSize: null,
        startDates: null,
        offersVisaSupport: false,
        offersAccommodation: false,
        offersPathway: !!c.pathway,
        isPartner: false,
        isValidated: true,
      };

      // Même déduplication que le catalogue à destination : (name, country).
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

  const origins = catalog.map(b => b.country);
  const rows = await prisma.languageCenter.groupBy({
    by: ['country'],
    where: { country: { in: origins } },
    _count: { _all: true },
  });
  const total = await prisma.languageCenter.count();

  console.log(`✅ Centres au pays de départ — ${created} créés, ${updated} mis à jour.`);
  console.log(`   ${rows.reduce((s, r) => s + r._count._all, 0)} fiches sur ${origins.length} pays de départ, ${total} centres en base au total.`);
  rows
    .sort((a, b) => b._count._all - a._count._all)
    .forEach(r => console.log(`   ${r.country.padEnd(24)} ${r._count._all}`));
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
