import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Catalogue de départ des ressources d'orientation (stories 10.1 / 10.2).
 *
 * Il alimente `/orientation` (écran public) et `/admin/orientation`. Le contenu suit les
 * trois axes affichés sur la page marketing `/services/orientation` : école & études,
 * carrière & emploi, formation professionnelle.
 *
 * ⚠️ Ce qui est **vérifiable** ici : le nom de la ressource, l'organisme qui la publie,
 * son site officiel, la nature de la prestation.
 * ⚠️ Ce qui est **indicatif** et doit être confirmé depuis l'admin : les tarifs (jamais
 * saisis ici), les dates de session et les conditions d'admission — elles changent chaque
 * année. Aucun contact (e-mail, téléphone) n'est inventé : ces champs restent vides.
 *
 * `location` = lieu de la formation. Il n'est renvoyé qu'aux abonnés premium (FR35), donc
 * il n'est rempli que lorsqu'il est réellement connu ; « En ligne » est une valeur exacte,
 * pas un remplissage.
 */

type Resource = {
  title: string;
  type: 'guide' | 'book' | 'company' | 'certification';
  category: string;
  provider?: string;
  description: string;
  link?: string;
  location?: string;
};

// Vocabulaire de catégories volontairement court : ce sont les filtres affichés côté public.
const ETUDES = 'Études à l’étranger';
const LANGUES = 'Langues & tests';
const IT = 'Numérique & IT';
const BUSINESS = 'Gestion & business';
const CARRIERE = 'Emploi & carrière';
const FORMATION = 'Formation professionnelle';
const SCIENCES = 'Sciences & ingénierie';

const catalog: Resource[] = [
  // ─── Guides : portails officiels et procédures ──────────────────────────────
  {
    title: 'Campus France — procédure « Études en France »',
    type: 'guide',
    category: ETUDES,
    provider: 'Campus France',
    description:
      'Le passage obligé pour candidater dans le supérieur français depuis le Togo : création du dossier en ligne, choix des formations, entretien, puis prise de rendez-vous visa. À ouvrir dès l’automne pour une rentrée de septembre.',
    link: 'https://www.campusfrance.org',
    location: 'Espace Campus France Togo — Lomé',
  },
  {
    title: 'DAAD — base des programmes d’études en Allemagne',
    type: 'guide',
    category: ETUDES,
    provider: 'DAAD (Office allemand d’échanges universitaires)',
    description:
      'Recherche de licences, masters et programmes de doctorat dans toutes les universités allemandes, avec la langue d’enseignement, les frais de semestre et les dates limites. Comprend aussi la base des bourses DAAD.',
    link: 'https://www2.daad.de/deutschland/studienangebote/studiengang/en/',
    location: 'En ligne',
  },
  {
    title: 'anabin — reconnaissance de votre diplôme en Allemagne',
    type: 'guide',
    category: ETUDES,
    provider: 'KMK — Zentralstelle für ausländisches Bildungswesen',
    description:
      'Base officielle qui indique si votre baccalauréat ou votre licence donne accès aux études en Allemagne, et à quelles conditions (accès direct, Studienkolleg, examen d’entrée). À vérifier avant toute candidature.',
    link: 'https://anabin.kmk.org',
    location: 'En ligne',
  },
  {
    title: 'uni-assist — candidature centralisée aux universités allemandes',
    type: 'guide',
    category: ETUDES,
    provider: 'uni-assist e.V.',
    description:
      'Guichet unique par lequel passent la plupart des universités allemandes pour évaluer les dossiers étrangers : un seul envoi de pièces, des frais par candidature. Vérifiez sur le site si votre université est affiliée.',
    link: 'https://www.uni-assist.de',
    location: 'En ligne (dossier papier ou numérique)',
  },
  {
    title: 'Make it in Germany — travailler et s’installer en Allemagne',
    type: 'guide',
    category: CARRIERE,
    provider: 'Gouvernement fédéral allemand',
    description:
      'Portail officiel pour les travailleurs qualifiés : métiers en tension, conditions du visa de recherche d’emploi et de la carte de séjour, reconnaissance des qualifications professionnelles, démarches d’installation.',
    link: 'https://www.make-it-in-germany.com',
    location: 'En ligne',
  },
  {
    title: 'EURES — offres d’emploi dans l’Espace économique européen',
    type: 'guide',
    category: CARRIERE,
    provider: 'Commission européenne',
    description:
      'Portail européen de la mobilité de l’emploi : offres agrégées des services publics de l’emploi, fiches « vivre et travailler » pays par pays, conseillers EURES. Utile pour cadrer un projet avant de postuler.',
    link: 'https://eures.europa.eu',
    location: 'En ligne',
  },
  {
    title: 'Europass — CV et passeport de compétences européen',
    type: 'guide',
    category: CARRIERE,
    provider: 'Commission européenne',
    description:
      'Générateur gratuit de CV au format attendu par les recruteurs européens, avec grille d’auto-évaluation des langues (A1–C2) et espace de stockage des diplômes. Le format à privilégier pour une candidature en Europe.',
    link: 'https://europass.europa.eu',
    location: 'En ligne',
  },
  {
    title: 'ONISEP — explorer les métiers et les filières',
    type: 'guide',
    category: ETUDES,
    provider: 'ONISEP (France)',
    description:
      'Fiches métiers détaillées (missions, salaires, études nécessaires) et cartographie des filières du supérieur français. Point de départ utile quand le projet n’est pas encore fixé sur un domaine.',
    link: 'https://www.onisep.fr',
    location: 'En ligne',
  },
  {
    title: 'Parcoursup — admission en 1re année en France',
    type: 'guide',
    category: ETUDES,
    provider: 'Ministère de l’Enseignement supérieur (France)',
    description:
      'Plateforme nationale d’admission en première année du supérieur. Les candidats résidant hors Union européenne passent d’abord par la procédure « Études en France » de Campus France : vérifiez laquelle vous concerne.',
    link: 'https://www.parcoursup.gouv.fr',
    location: 'En ligne',
  },
  {
    title: 'UCAS — candidater aux universités britanniques',
    type: 'guide',
    category: ETUDES,
    provider: 'UCAS (Royaume-Uni)',
    description:
      'Plateforme unique pour les candidatures en licence au Royaume-Uni : cinq vœux maximum, une lettre de motivation (personal statement), des dates limites fixes en janvier pour la rentrée suivante.',
    link: 'https://www.ucas.com',
    location: 'En ligne',
  },
  {
    title: 'EduCanada — étudier au Canada',
    type: 'guide',
    category: ETUDES,
    provider: 'Gouvernement du Canada',
    description:
      'Portail officiel : établissements désignés, programmes, bourses du gouvernement canadien et conditions du permis d’études. Comprend la liste des documents financiers exigés à l’appui de la demande.',
    link: 'https://www.educanada.ca',
    location: 'En ligne',
  },
  {
    title: 'Study in NL — étudier aux Pays-Bas',
    type: 'guide',
    category: ETUDES,
    provider: 'Nuffic',
    description:
      'Portail officiel des études aux Pays-Bas : programmes enseignés en anglais, frais de scolarité pour les étudiants hors UE, bourses Orange Knowledge et Holland Scholarship, procédure de visa MVV.',
    link: 'https://www.studyinnl.org',
    location: 'En ligne',
  },
  {
    title: 'Erasmus+ — mobilités et bourses européennes',
    type: 'guide',
    category: ETUDES,
    provider: 'Commission européenne',
    description:
      'Programme européen de mobilité : échanges universitaires, masters conjoints Erasmus Mundus (souvent entièrement financés, ouverts aux étudiants hors Europe), stages et volontariat.',
    link: 'https://erasmus-plus.ec.europa.eu',
    location: 'En ligne',
  },
  {
    title: 'Ausbildung — la formation en alternance en Allemagne',
    type: 'guide',
    category: FORMATION,
    provider: 'Bundesagentur für Arbeit',
    description:
      'La voie professionnelle allemande : deux à trois ans en alternance entreprise/école, rémunérée, avec un diplôme reconnu à la clé. Le portail liste les places disponibles métier par métier et région par région.',
    link: 'https://www.arbeitsagentur.de',
    location: 'Allemagne — agence pour l’emploi de chaque Land',
  },
  {
    title: 'ScholarshipPortal — moteur de recherche de bourses',
    type: 'guide',
    category: ETUDES,
    provider: 'Studyportals',
    description:
      'Recense des milliers de bourses européennes filtrables par pays, niveau et nationalité. Vérifiez toujours l’information sur le site de l’établissement : le moteur peut référencer des appels clos.',
    link: 'https://www.scholarshipportal.com',
    location: 'En ligne',
  },
  {
    title: 'MastersPortal — comparer les masters en Europe',
    type: 'guide',
    category: ETUDES,
    provider: 'Studyportals',
    description:
      'Comparateur de programmes de master par pays, discipline, langue d’enseignement et frais de scolarité. Pratique pour dresser une première liste avant de vérifier chaque programme à la source.',
    link: 'https://www.mastersportal.com',
    location: 'En ligne',
  },

  // ─── Ouvrages de référence ──────────────────────────────────────────────────
  {
    title: 'What Color Is Your Parachute?',
    type: 'book',
    category: CARRIERE,
    provider: 'Richard N. Bolles — Ten Speed Press',
    description:
      'Le classique du bilan de compétences et de la recherche d’emploi, réédité chaque année depuis 1970. Sa méthode « fleur » aide à identifier ce que l’on sait faire avant de choisir un secteur.',
  },
  {
    title: 'Designing Your Life',
    type: 'book',
    category: CARRIERE,
    provider: 'Bill Burnett & Dave Evans — Knopf',
    description:
      'Issu du cours de design thinking de Stanford : construire deux ou trois versions plausibles de sa vie professionnelle et les tester par petits prototypes plutôt que de chercher « la » vocation.',
  },
  {
    title: 'So Good They Can’t Ignore You',
    type: 'book',
    category: CARRIERE,
    provider: 'Cal Newport — Business Plus',
    description:
      'Thèse à contre-courant : la passion suit la compétence rare, elle ne la précède pas. Utile pour arbitrer entre un métier « qui fait envie » et un métier où l’on peut devenir vraiment bon.',
  },
  {
    title: 'Mindset: The New Psychology of Success',
    type: 'book',
    category: CARRIERE,
    provider: 'Carol S. Dweck — Random House',
    description:
      'Les travaux sur l’état d’esprit de développement : pourquoi croire que ses capacités sont modifiables change la façon d’aborder un échec, un examen ou une réorientation.',
  },
  {
    title: 'Deep Work',
    type: 'book',
    category: CARRIERE,
    provider: 'Cal Newport — Grand Central Publishing',
    description:
      'Méthodes de travail en concentration profonde. Directement applicable à la préparation d’un concours, d’une certification ou d’un test de langue en parallèle d’un emploi.',
  },
  {
    title: 'Cracking the Coding Interview',
    type: 'book',
    category: IT,
    provider: 'Gayle Laakmann McDowell — CareerCup',
    description:
      'Référence des entretiens techniques : près de 190 exercices d’algorithmique corrigés, plus les codes implicites de l’entretien dans les entreprises tech. Indispensable avant de postuler à l’international.',
  },
  {
    title: 'Business Model You',
    type: 'book',
    category: BUSINESS,
    provider: 'Tim Clark, Alexander Osterwalder & Yves Pigneur — Wiley',
    description:
      'Le canevas de modèle économique appliqué à une personne : cartographier ce que l’on apporte, à qui, et par quels canaux. Bon support pour préparer un entretien d’orientation.',
  },
  {
    title: 'The Defining Decade',
    type: 'book',
    category: CARRIERE,
    provider: 'Meg Jay — Twelve',
    description:
      'Pourquoi les choix faits entre 20 et 30 ans pèsent plus lourd que les suivants, et comment construire du « capital identitaire » plutôt que d’accumuler des expériences sans lien.',
  },

  // ─── Organismes, écoles et plateformes ──────────────────────────────────────
  {
    title: 'Goethe-Institut',
    type: 'company',
    category: LANGUES,
    provider: 'Goethe-Institut',
    description:
      'Institut culturel allemand : cours d’allemand de A1 à C2 et passage des examens officiels Goethe-Zertifikat, acceptés par les universités allemandes et les services consulaires.',
    link: 'https://www.goethe.de',
    location: 'Goethe-Institut Lomé (Togo) et réseau mondial',
  },
  {
    title: 'FUN MOOC',
    type: 'company',
    category: ETUDES,
    provider: 'France Université Numérique',
    description:
      'Cours en ligne gratuits produits par les universités et grandes écoles françaises, en français. Bon moyen de tester un domaine — et de montrer sa motivation dans un dossier de candidature.',
    link: 'https://www.fun-mooc.fr',
    location: 'En ligne',
  },
  {
    title: 'Coursera',
    type: 'company',
    category: IT,
    provider: 'Coursera',
    description:
      'Plateforme de cours en ligne d’universités et d’entreprises (Google, IBM, Meta). Suivi gratuit possible en auditeur libre ; le certificat, lui, est payant. Aide financière disponible sur demande.',
    link: 'https://www.coursera.org',
    location: 'En ligne',
  },
  {
    title: 'edX',
    type: 'company',
    category: IT,
    provider: 'edX (2U)',
    description:
      'Cours et MicroMasters d’universités comme le MIT, Harvard ou la TU Delft. Certains MicroMasters donnent des crédits valables dans un master si vous êtes ensuite admis.',
    link: 'https://www.edx.org',
    location: 'En ligne',
  },
  {
    title: 'OpenClassrooms',
    type: 'company',
    category: IT,
    provider: 'OpenClassrooms',
    description:
      'Parcours diplômants entièrement en ligne avec mentorat individuel hebdomadaire, débouchant sur des titres inscrits au RNCP français (développement, data, gestion de projet, cybersécurité).',
    link: 'https://openclassrooms.com',
    location: 'En ligne (mentorat en visioconférence)',
  },
  {
    title: 'Le Wagon',
    type: 'company',
    category: IT,
    provider: 'Le Wagon',
    description:
      'Bootcamp intensif en développement web et en data science : neuf semaines à temps plein ou vingt-quatre semaines à temps partiel, orienté projet et insertion professionnelle.',
    link: 'https://www.lewagon.com',
    location: 'Campus dans une quarantaine de villes (Paris, Berlin, Lisbonne, Amsterdam…) et en ligne',
  },
  {
    title: 'École 42',
    type: 'company',
    category: IT,
    provider: 'Réseau 42',
    description:
      'Formation informatique gratuite, sans condition de diplôme ni professeur : sélection par une épreuve d’admission (« la Piscine »), progression par projets et évaluation entre pairs.',
    link: 'https://42.fr',
    location: 'Paris et réseau 42 dans plus de trente pays',
  },
  {
    title: 'Simplon.co',
    type: 'company',
    category: IT,
    provider: 'Simplon.co',
    description:
      'Réseau de « fabriques » numériques : formations aux métiers du code et de la data, gratuites pour les apprenants, ciblant en priorité les personnes éloignées de l’emploi et sans diplôme du supérieur.',
    link: 'https://simplon.co',
    location: 'France et Afrique — réseau de fabriques locales',
  },
  {
    title: 'ALX',
    type: 'company',
    category: IT,
    provider: 'ALX (African Leadership Group)',
    description:
      'Programmes tech intensifs pour jeunes Africains (génie logiciel, data, intelligence artificielle, leadership), suivis en ligne avec des sessions présentielles dans les hubs.',
    link: 'https://www.alxafrica.com',
    location: 'En ligne, avec des hubs à Accra, Lagos, Nairobi et Kigali',
  },
  {
    title: 'AIMS — African Institute for Mathematical Sciences',
    type: 'company',
    category: SCIENCES,
    provider: 'AIMS',
    description:
      'Master en sciences mathématiques d’un an, enseigné en anglais par des chercheurs internationaux, avec bourse couvrant scolarité, logement et repas pour les étudiants sélectionnés.',
    link: 'https://aims.ac.za',
    location: 'Campus au Sénégal, au Ghana, au Cameroun, au Rwanda et en Afrique du Sud',
  },
  {
    title: 'IHK — chambres de commerce allemandes',
    type: 'company',
    category: FORMATION,
    provider: 'Deutsche Industrie- und Handelskammer',
    description:
      'Les IHK encadrent l’Ausbildung, organisent les examens de fin de formation et délivrent les certificats professionnels reconnus dans toute l’Allemagne. Elles instruisent aussi la reconnaissance des qualifications étrangères.',
    link: 'https://www.ihk.de',
    location: 'Allemagne — chambre compétente selon la ville de l’entreprise',
  },
  {
    title: 'Cisco Networking Academy',
    type: 'company',
    category: IT,
    provider: 'Cisco',
    description:
      'Cours réseaux et cybersécurité gratuits ou peu coûteux, dispensés en ligne et par des établissements partenaires ; c’est la voie de préparation habituelle aux certifications Cisco.',
    link: 'https://www.netacad.com',
    location: 'En ligne et établissements partenaires',
  },

  // ─── Certifications ─────────────────────────────────────────────────────────
  {
    title: 'TOEFL iBT',
    type: 'certification',
    category: LANGUES,
    provider: 'ETS',
    description:
      'Test d’anglais académique demandé par les universités anglophones (Amérique du Nord surtout). Score sur 120, valable deux ans. Les seuils exigés varient selon le programme : vérifiez-les avant de réserver.',
    link: 'https://www.ets.org/toefl',
  },
  {
    title: 'IELTS Academic',
    type: 'certification',
    category: LANGUES,
    provider: 'British Council / IDP / Cambridge',
    description:
      'Test d’anglais accepté par les universités britanniques, australiennes et canadiennes, ainsi que par plusieurs services d’immigration. Note globale de 0 à 9, valable deux ans.',
    link: 'https://www.ielts.org',
  },
  {
    title: 'Goethe-Zertifikat (A1 à C2)',
    type: 'certification',
    category: LANGUES,
    provider: 'Goethe-Institut',
    description:
      'Diplôme d’allemand reconnu dans le monde entier, sans limite de validité. Le A1 est souvent exigé pour un visa de regroupement familial, le B1/B2 pour une Ausbildung, le C1 pour l’université.',
    link: 'https://www.goethe.de/de/spr/kup/prf.html',
    location: 'Goethe-Institut Lomé et centres d’examen partenaires',
  },
  {
    title: 'TestDaF',
    type: 'certification',
    category: LANGUES,
    provider: 'g.a.s.t. / TestDaF-Institut',
    description:
      'Test d’allemand spécifiquement universitaire, noté par niveaux TDN 3 à 5. La plupart des universités allemandes exigent un TDN 4 dans les quatre épreuves pour une admission en cursus germanophone.',
    link: 'https://www.testdaf.de',
  },
  {
    title: 'telc Deutsch B1 / B2 / C1',
    type: 'certification',
    category: LANGUES,
    provider: 'telc gGmbH',
    description:
      'Certificats d’allemand alignés sur le cadre européen, souvent acceptés en alternative au Goethe-Zertifikat pour l’Ausbildung, le travail ou la naturalisation. Variantes métier (santé, technique).',
    link: 'https://www.telc.net',
  },
  {
    title: 'DELF / DALF',
    type: 'certification',
    category: LANGUES,
    provider: 'France Éducation international',
    description:
      'Diplômes officiels de français langue étrangère, valables à vie. Le DELF B2 ou le DALF C1 dispense du test de langue pour l’inscription dans la plupart des universités françaises.',
    link: 'https://www.france-education-international.fr',
  },
  {
    title: 'TCF — Test de connaissance du français',
    type: 'certification',
    category: LANGUES,
    provider: 'France Éducation international',
    description:
      'Test de français passé en une session, valable deux ans, avec des versions dédiées aux études en France (TCF pour la demande d’admission préalable) et aux démarches de nationalité.',
    link: 'https://www.france-education-international.fr',
  },
  {
    title: 'Google Career Certificates',
    type: 'certification',
    category: IT,
    provider: 'Google (via Coursera)',
    description:
      'Certificats professionnels sans prérequis (support informatique, data analytics, UX design, cybersécurité, gestion de projet), conçus pour un premier emploi. Environ six mois à raison de quelques heures par semaine.',
    link: 'https://grow.google/certificates/',
    location: 'En ligne',
  },
  {
    title: 'AWS Certified Cloud Practitioner',
    type: 'certification',
    category: IT,
    provider: 'Amazon Web Services',
    description:
      'Première marche des certifications cloud d’AWS : vocabulaire, services de base, modèle de facturation et de sécurité. Bonne porte d’entrée avant les certifications d’architecte ou de développeur.',
    link: 'https://aws.amazon.com/certification/',
  },
  {
    title: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
    type: 'certification',
    category: IT,
    provider: 'Microsoft',
    description:
      'Certification d’entrée sur le cloud Microsoft Azure. Les supports de révision officiels sont gratuits sur Microsoft Learn ; seul l’examen est payant.',
    link: 'https://learn.microsoft.com/credentials/certifications/azure-fundamentals/',
  },
  {
    title: 'Cisco CCNA',
    type: 'certification',
    category: IT,
    provider: 'Cisco',
    description:
      'Certification réseau de référence (adressage IP, routage, commutation, sécurité de base, automatisation). Très demandée pour les postes d’administrateur réseau et de technicien support.',
    link: 'https://www.netacad.com',
  },
  {
    title: 'CompTIA A+',
    type: 'certification',
    category: IT,
    provider: 'CompTIA',
    description:
      'Certification généraliste en support informatique : matériel, systèmes d’exploitation, réseaux et dépannage. Souvent citée comme prérequis dans les offres de technicien helpdesk.',
    link: 'https://www.comptia.org/certifications/a',
  },
  {
    title: 'PMP — Project Management Professional',
    type: 'certification',
    category: BUSINESS,
    provider: 'Project Management Institute',
    description:
      'Certification internationale en gestion de projet. Elle exige une expérience préalable de conduite de projets et un volume de formation attesté : à viser en milieu de carrière, pas en sortie d’études.',
    link: 'https://www.pmi.org/certifications/project-management-pmp',
  },
  {
    title: 'ACCA — comptabilité et finance',
    type: 'certification',
    category: BUSINESS,
    provider: 'Association of Chartered Certified Accountants',
    description:
      'Qualification comptable britannique reconnue dans plus de 180 pays, passée par examens successifs et cumulable avec un emploi. Voie classique vers l’audit et la finance d’entreprise à l’international.',
    link: 'https://www.accaglobal.com',
  },
];

async function main() {
  let created = 0;
  let updated = 0;

  for (const [index, r] of catalog.entries()) {
    const data = {
      title: r.title,
      type: r.type,
      category: r.category,
      description: r.description,
      provider: r.provider ?? null,
      link: r.link ?? null,
      location: r.location ?? null,
      imageUrl: null,
      isValidated: true,
      order: (index + 1) * 10,
    };

    // Pas de contrainte d'unicité sur `title` : on déduplique sur (title, type)
    // pour que le script reste rejouable sans créer de doublons.
    const existing = await prisma.orientationResource.findFirst({
      where: { title: data.title, type: data.type },
      select: { id: true },
    });

    if (existing) {
      await prisma.orientationResource.update({ where: { id: existing.id }, data });
      updated++;
    } else {
      await prisma.orientationResource.create({ data });
      created++;
    }
  }

  const total = await prisma.orientationResource.count();
  const byType = await prisma.orientationResource.groupBy({ by: ['type'], _count: { _all: true } });
  const byCategory = await prisma.orientationResource.groupBy({
    by: ['category'],
    _count: { _all: true },
  });

  console.log(`✅ Orientation — ${created} créées, ${updated} mises à jour, ${total} en base.`);
  byType
    .sort((a, b) => b._count._all - a._count._all)
    .forEach(r => console.log(`   ${r.type.padEnd(16)} ${r._count._all}`));
  console.log('   ── catégories ──');
  byCategory
    .sort((a, b) => b._count._all - a._count._all)
    .forEach(r => console.log(`   ${(r.category ?? '(aucune)').padEnd(26)} ${r._count._all}`));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
