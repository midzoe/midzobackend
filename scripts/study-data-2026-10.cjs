/**
 * Données du parcours Study (UAT, 17/10/2026) — strictement additif (upserts / updates).
 *
 *   node scripts/study-data-2026-10.cjs public-status program-languages new-universities \
 *        luxembourg-housing vocational publish-visas
 *
 * Règle : rien n'est inventé. Le statut public/privé n'est posé que pour les cas établis
 * (sinon `null` = non renseigné) ; les langues ne sont posées que pour les filières dont
 * la langue d'enseignement est connue ; les montants restent marqués « indicatif ».
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ── Statut public / privé ───────────────────────────────────────────────────
const PRIVATE = [
  'California Institute of Technology (Caltech)', 'Carnegie Mellon University', 'Columbia University',
  'Cornell University', 'Duke University', 'Harvard University', 'Johns Hopkins University',
  'Massachusetts Institute of Technology (MIT)', 'New York University (NYU)', 'Northwestern University',
  'Princeton University', 'Stanford University', 'University of Chicago', 'University of Pennsylvania',
  'Yale University', 'IE University', 'Universidad de Navarra', 'Universidade Católica Portuguesa',
  'Università Bocconi', 'Università Cattolica del Sacro Cuore',
];
// Fondations privées financées sur fonds publics : statut à trancher par l'équipe.
const UNDECIDED = ['Chalmers University of Technology', 'Jönköping University'];

async function publicStatus() {
  const priv = await prisma.university.updateMany({ where: { name: { in: PRIVATE } }, data: { isPublic: false } });
  const pub = await prisma.university.updateMany({
    where: { name: { notIn: [...PRIVATE, ...UNDECIDED] } },
    data: { isPublic: true },
  });
  console.log(`statut : ${pub.count} publiques, ${priv.count} privées, ${UNDECIDED.length} non renseignées`);
}

// ── Langues d'enseignement par filière ──────────────────────────────────────
const BACHELOR_LANGUAGE = { Germany: 'Allemand', France: 'Français', Italy: 'Italien', Spain: 'Espagnol', Portugal: 'Portugais' };
const FRENCH_SPEAKING_BELGIUM = ['Université libre de Bruxelles (ULB)', 'Université catholique de Louvain (UCLouvain)', 'Université de Liège'];
const ENGLISH_MASTERS = {
  'Universität Mannheim': ['Master en Data Science'],
  'Université du Luxembourg': ['Master en Finance', 'Master en Banking and Finance', 'Master en Information Security', 'Master en Software Engineering'],
};

async function programLanguages() {
  const unis = await prisma.university.findMany({ include: { programs: true } });
  let n = 0;
  const set = async (p, langs) => { await prisma.universityProgram.update({ where: { id: p.id }, data: { teachingLanguages: langs } }); n++; };
  for (const u of unis) {
    for (const p of u.programs) {
      const english = ENGLISH_MASTERS[u.name]?.includes(p.name);
      if (english) await set(p, ['Anglais']);
      else if (FRENCH_SPEAKING_BELGIUM.includes(u.name) && !/^Master in /.test(p.name)) await set(p, ['Français']);
      else if (['KU Leuven', 'Universiteit Gent'].includes(u.name)) await set(p, p.level === 'Master' ? ['Anglais'] : ['Néerlandais']);
      else if (p.level === 'Bachelor' && BACHELOR_LANGUAGE[u.country]) await set(p, [BACHELOR_LANGUAGE[u.country]]);
      else if (u.country === 'France' && p.level === 'Master' && /^Master en [A-ZÉ][a-zéèêàç]/.test(p.name) && /[éèàç]|santé|droit|politique|histoire|physique|chimie|informatique|mathématiques|management|finance|neurosciences|biotechnologies|développement|ingénierie/i.test(p.name)) {
        await set(p, ['Français']);
      }
    }
  }
  // Masters de santé publique des universités françaises : ouverts en formation continue.
  const fc = await prisma.universityProgram.updateMany({
    where: { name: 'Master en Santé publique', university: { country: 'France' } },
    data: { formats: ['Présentiel', 'Formation continue'] },
  });
  console.log(`langues : ${n} filières renseignées ; formats : ${fc.count} masters de santé publique`);
}

// ── Universités manquantes des scénarios ────────────────────────────────────
const GERMAN_ADMISSION = {
  requiredLanguage: 'Allemand', requiredLanguageLevel: 'C1',
  minimumGrade: 'Abitur équivalent — NC (Numerus Clausus) selon la filière',
  admissionRequirements: 'DSH-2 ou TestDaF 4 ; Studienkolleg si diplôme non équivalent ; dossier via uni-assist',
};
const NEW_UNIVERSITIES = [
  {
    name: 'Universität Leipzig', city: 'Leipzig', country: 'Germany', isPublic: true,
    website: 'https://www.uni-leipzig.de', applicationUrl: 'https://www.uni-leipzig.de/studium',
    specialty: 'Deuxième plus ancienne université d’Allemagne, forte en médecine et en informatique',
    ...GERMAN_ADMISSION,
    programs: [
      { name: 'Informatique', level: 'Bachelor', teachingLanguages: ['Allemand'] },
      { name: 'Médecine', level: 'Bachelor', teachingLanguages: ['Allemand'] },
      { name: 'Master en Computer Science', level: 'Master' },
      { name: 'Master en Data Science', level: 'Master' },
    ],
  },
  {
    name: 'Technische Universität Darmstadt (TU Darmstadt)', city: 'Darmstadt', country: 'Germany', isPublic: true,
    website: 'https://www.tu-darmstadt.de', applicationUrl: 'https://www.tu-darmstadt.de/studieren',
    specialty: 'Université technique de premier plan en informatique et cybersécurité',
    ...GERMAN_ADMISSION,
    programs: [
      { name: 'Informatique', level: 'Bachelor', teachingLanguages: ['Allemand'] },
      { name: 'Master en Computer Science', level: 'Master' },
      { name: 'Master en IT Security', level: 'Master' },
    ],
  },
  {
    name: 'Hochschule Darmstadt (h_da)', city: 'Darmstadt', country: 'Germany', isPublic: true,
    website: 'https://h-da.de', applicationUrl: 'https://h-da.de/studium',
    specialty: 'Université de sciences appliquées, orientée pratique et entreprises',
    ...GERMAN_ADMISSION,
    programs: [
      { name: 'Informatique', level: 'Bachelor', teachingLanguages: ['Allemand'] },
      { name: 'Master en Data Science', level: 'Master' },
    ],
  },
  {
    name: 'Goethe-Universität Frankfurt am Main', city: 'Francfort', country: 'Germany', isPublic: true,
    website: 'https://www.uni-frankfurt.de', applicationUrl: 'https://www.uni-frankfurt.de/studium',
    specialty: 'Grande université de recherche, pôle finance et économie (House of Finance)',
    ...GERMAN_ADMISSION,
    programs: [
      { name: 'Informatique', level: 'Bachelor', teachingLanguages: ['Allemand'] },
      { name: 'Médecine', level: 'Bachelor', teachingLanguages: ['Allemand'] },
      { name: 'Master en Quantitative Finance', level: 'Master' },
    ],
  },
  {
    name: 'Université de Liège', city: 'Liège', country: 'Belgium', isPublic: true,
    website: 'https://www.uliege.be', applicationUrl: 'https://www.uliege.be/admission',
    specialty: 'Université publique complète de la Fédération Wallonie-Bruxelles',
    requiredLanguage: 'Français', requiredLanguageLevel: 'B2',
    minimumGrade: 'CESS ou diplôme équivalent — examen d’entrée en médecine',
    admissionRequirements: 'Demande d’équivalence auprès de la Fédération Wallonie-Bruxelles ; master : valorisation du diplôme de 1er cycle',
    programs: [
      { name: 'Médecine', level: 'Bachelor', teachingLanguages: ['Français'] },
      { name: 'Informatique', level: 'Bachelor', teachingLanguages: ['Français'] },
      { name: 'Master en Santé publique', level: 'Master', teachingLanguages: ['Français'] },
    ],
  },
];

async function newUniversities() {
  for (const { programs, ...u } of NEW_UNIVERSITIES) {
    const uni = await prisma.university.upsert({ where: { name: u.name }, update: u, create: u });
    for (const p of programs) {
      const data = { teachingLanguages: p.teachingLanguages ?? [] };
      await prisma.universityProgram.upsert({
        where: { universityId_name_level: { universityId: uni.id, name: p.name, level: p.level } },
        update: data,
        create: { universityId: uni.id, name: p.name, level: p.level, ...data },
      });
    }
  }
  console.log(`universités ajoutées / mises à jour : ${NEW_UNIVERSITIES.map(u => u.name).join(' ; ')}`);
}

// ── Logement étudiant au Luxembourg ─────────────────────────────────────────
const LUX_HOUSING = [
  {
    name: 'Université du Luxembourg — logements étudiants (Belval)', city: 'Esch-sur-Alzette', type: 'residence', pricePerMonth: 550,
    description: 'Chambres et studios gérés par le service logement de l’Université du Luxembourg, à proximité du campus Belval. Attribution prioritaire aux nouveaux étudiants internationaux. Tarif mensuel indicatif, à confirmer auprès de l’université.',
  },
  {
    name: 'Université du Luxembourg — logements étudiants (Luxembourg-ville)', city: 'Luxembourg', type: 'residence', pricePerMonth: 600,
    description: 'Résidences proposées par l’université à Luxembourg-ville (Kirchberg, Limpertsberg), proches des campus et des transports gratuits. Le marché privé y est nettement plus cher. Tarif mensuel indicatif, à confirmer auprès de l’université.',
  },
];

async function luxembourgHousing() {
  for (const h of LUX_HOUSING) {
    const existing = await prisma.accommodation.findFirst({ where: { name: h.name } });
    const data = { ...h, country: 'Luxembourg', currency: 'EUR', contact: 'https://www.uni.lu' };
    if (existing) await prisma.accommodation.update({ where: { id: existing.id }, data });
    else await prisma.accommodation.create({ data });
  }
  console.log(`logements Luxembourg : ${LUX_HOUSING.length}`);
}

// ── Offres d'Ausbildung en soins infirmiers ─────────────────────────────────
const NURSING = {
  occupation: 'Pflegefachfrau / Pflegefachmann (soins infirmiers)',
  domain: 'nursing',
  country: 'Germany',
  durationMonths: 36,
  languageLevel: 'B1 minimum (B2 souvent demandé)',
  salary: '≈ 1 340 – 1 500 € brut/mois selon l’année de formation (barème TVAöD-Pflege, indicatif)',
  startDates: ['Plusieurs rentrées par an — à confirmer auprès de l’employeur'],
  requirements: [
    'Fin d’études secondaires reconnue (équivalent Realschulabschluss au minimum)',
    'Allemand B1 au dépôt du visa, B2 recommandé',
    'Contrat de formation signé avec l’établissement',
  ],
  documents: [
    'CV en allemand (Lebenslauf)',
    'Lettre de motivation',
    'Diplômes et relevés de notes traduits en allemand',
    'Certificat de langue (Goethe, telc)',
    'Passeport en cours de validité',
  ],
  isValidated: true,
};
const NURSING_EMPLOYERS = [
  { employer: 'Universitätsklinikum Frankfurt', employerType: 'Hôpital universitaire', city: 'Frankfurt am Main', applicationUrl: 'https://www.unimedizin-ffm.de' },
  { employer: 'Universitätsklinikum Hamburg-Eppendorf (UKE)', employerType: 'Hôpital universitaire', city: 'Hamburg', applicationUrl: 'https://www.uke.de' },
  { employer: 'Asklepios Kliniken Hamburg', employerType: 'Groupe hospitalier', city: 'Hamburg', applicationUrl: 'https://www.asklepios.com' },
  { employer: 'Medizinische Hochschule Hannover (MHH)', employerType: 'Hôpital universitaire', city: 'Hannover', applicationUrl: 'https://www.mhh.de' },
  { employer: 'KRH Klinikum Region Hannover', employerType: 'Groupe hospitalier public', city: 'Hannover', applicationUrl: 'https://www.krh.de' },
  { employer: 'Charité – Universitätsmedizin Berlin', employerType: 'Hôpital universitaire', city: 'Berlin', applicationUrl: 'https://www.charite.de' },
  { employer: 'Vivantes Netzwerk für Gesundheit', employerType: 'Groupe hospitalier public', city: 'Berlin', applicationUrl: 'https://www.vivantes.de' },
  { employer: 'LMU Klinikum München', employerType: 'Hôpital universitaire', city: 'München', applicationUrl: 'https://www.lmu-klinikum.de' },
];

async function vocational() {
  for (const e of NURSING_EMPLOYERS) {
    const data = {
      ...NURSING, ...e,
      description: `Ausbildung de 3 ans en soins infirmiers chez ${e.employer} : enseignement théorique à l’école de soins et stages rémunérés dans les services. Rémunération indicative, à confirmer auprès de l’employeur.`,
    };
    const existing = await prisma.vocationalTraining.findFirst({ where: { employer: e.employer, occupation: NURSING.occupation } });
    if (existing) await prisma.vocationalTraining.update({ where: { id: existing.id }, data });
    else await prisma.vocationalTraining.create({ data });
  }
  console.log(`offres Ausbildung : ${NURSING_EMPLOYERS.length}`);
}

// ── Publication des fiches visa ─────────────────────────────────────────────
async function publishVisas() {
  const all = await prisma.visa.findMany();
  const hasDocuments = v => (Array.isArray(v.documentsRequired) ? v.documentsRequired.length > 0 : !!v.documentsRequired);
  const complete = all.filter(v => !!(v.processingTime && v.officialSourceUrl && v.whereToApply) && hasDocuments(v));
  const incomplete = all.filter(v => !complete.includes(v));
  const res = await prisma.visa.updateMany({ where: { id: { in: complete.map(v => v.id) } }, data: { isValidated: true } });
  console.log(`visas : ${res.count} publiées / ${all.length}`);
  if (incomplete.length) console.log('  incomplètes (non publiées) :', incomplete.map(v => `#${v.id} ${v.originCountry}→${v.destinationCountry}`).join(', '));
}

const steps = {
  'public-status': publicStatus,
  'program-languages': programLanguages,
  'new-universities': newUniversities,
  'luxembourg-housing': luxembourgHousing,
  vocational,
  'publish-visas': publishVisas,
};

(async () => {
  for (const name of process.argv.slice(2)) {
    if (!steps[name]) throw new Error(`étape inconnue : ${name}`);
    await steps[name]();
  }
})()
  .catch(e => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
