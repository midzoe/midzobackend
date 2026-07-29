import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * Conditions d'admission du catalogue universitaire (story 5.13).
 *
 * Trois choses sont posées ici :
 *   1. `applicationUrl` — depuis un fichier de pages **vérifiées en HTTP** (200 +
 *      titre cohérent). Aucune URL n'est écrite sans avoir été résolue.
 *   2. `requiredLanguage` / `requiredLanguageLevel` — y compris sur les 49 fiches
 *      d'origine qui n'en avaient aucune.
 *   3. `minimumGrade` / `admissionRequirements` — le profil attendu d'un candidat.
 *
 * Sur quoi reposent les valeurs de langue et de note :
 * elles décrivent le **système d'admission du pays**, qui est documenté et stable
 * (Numerus Clausus allemand, UCAS et A-levels britanniques, GPA américain,
 * Parcoursup français, Studielink et numerus fixus néerlandais, nota de corte
 * espagnole, HSK chinois…), complété par des surcharges pour les établissements
 * dont la sélectivité est publiquement connue.
 *
 * Ce ne sont donc PAS les exigences d'un programme précis. Une filière peut être
 * plus stricte, ou enseignée dans une autre langue que celle du pays. Le contrôle
 * de langue côté public (story 5.3) compare ces valeurs au profil de l'étudiant :
 * elles doivent être affinées au cas par cas depuis l'admin.
 */

type Profile = {
  requiredLanguage: string;
  requiredLanguageLevel: string;
  minimumGrade: string;
  admissionRequirements: string;
};

/** Référentiel par pays — le socle appliqué à toutes les fiches du pays. */
const BY_COUNTRY: Record<string, Profile> = {
  Germany: {
    requiredLanguage: 'Allemand',
    requiredLanguageLevel: 'C1',
    minimumGrade: 'Abitur équivalent — NC (Numerus Clausus) selon la filière',
    admissionRequirements: 'DSH-2 ou TestDaF 4 ; Studienkolleg si diplôme non équivalent ; dossier via uni-assist',
  },
  France: {
    requiredLanguage: 'Français',
    requiredLanguageLevel: 'B2',
    minimumGrade: 'Baccalauréat — mention Bien (14/20) attendue en filière sélective',
    admissionRequirements: 'Parcoursup ou Études en France ; DELF B2 ou TCF',
  },
  'United Kingdom': {
    requiredLanguage: 'Anglais',
    requiredLanguageLevel: 'B2',
    minimumGrade: 'A-levels AAB à A*AA (ou équivalent international)',
    admissionRequirements: 'UCAS ; personal statement + références académiques ; IELTS 6.5',
  },
  'United States': {
    requiredLanguage: 'Anglais',
    requiredLanguageLevel: 'C1',
    minimumGrade: 'GPA 3.5 à 4.0 sur 4.0',
    admissionRequirements: 'Common Application ; SAT ou ACT, essais et lettres de recommandation ; TOEFL 90+',
  },
  Canada: {
    requiredLanguage: 'Anglais',
    requiredLanguageLevel: 'B2',
    minimumGrade: 'Moyenne de 75 à 85 % au secondaire',
    admissionRequirements: 'Dossier ; relevés de notes et preuve de langue (IELTS 6.5) ; CAQ + permis d’études',
  },
  Netherlands: {
    requiredLanguage: 'Anglais',
    requiredLanguageLevel: 'B2',
    minimumGrade: 'Diplôme équivalent au VWO néerlandais',
    admissionRequirements: 'Studielink ; numerus fixus au 15 janvier sur les filières à capacité limitée ; IELTS 6.0-6.5',
  },
  Spain: {
    requiredLanguage: 'Espagnol',
    requiredLanguageLevel: 'B2',
    minimumGrade: 'Nota de corte sur 14 — variable chaque année selon la filière',
    admissionRequirements: 'UNEDasiss et EvAU pour un diplôme étranger ; DELE B2',
  },
  Sweden: {
    requiredLanguage: 'Anglais',
    requiredLanguageLevel: 'B2',
    minimumGrade: 'Diplôme secondaire complet + « English 6 » suédois ou équivalent',
    admissionRequirements: 'Candidature centralisée universityadmissions.se au 15 janvier ; IELTS 6.5',
  },
  Switzerland: {
    requiredLanguage: 'Allemand',
    requiredLanguageLevel: 'C1',
    minimumGrade: 'Maturité suisse ou diplôme étranger reconnu par swissuniversities',
    admissionRequirements: 'Examen complémentaire si diplôme non reconnu ; médecine sur test d’aptitude',
  },
  Italy: {
    requiredLanguage: 'Italien',
    requiredLanguageLevel: 'B2',
    minimumGrade: 'Diplôme secondaire — test TOLC selon la filière',
    admissionRequirements: 'Préinscription Universitaly + validation consulaire ; CILS ou CELI B2',
  },
  Portugal: {
    requiredLanguage: 'Portugais',
    requiredLanguageLevel: 'B2',
    minimumGrade: 'Nota de candidatura sur 200 — variable selon la filière',
    admissionRequirements: 'Concurso Nacional de Acesso ou concours étudiant international ; CAPLE B2',
  },
  China: {
    requiredLanguage: 'Chinois',
    requiredLanguageLevel: 'B2',
    minimumGrade: 'HSK 4 à 5 selon la filière — Gaokao pour les cursus nationaux',
    admissionRequirements: 'Dossier direct ou bourse CSC ; certificat HSK et relevés de notes',
  },
  Belgium: {
    requiredLanguage: 'Français',
    requiredLanguageLevel: 'B2',
    minimumGrade: 'CESS ou diplôme équivalent — examen d’entrée en médecine et sciences de l’ingénieur',
    admissionRequirements: 'Demande d’équivalence auprès de la Fédération Wallonie-Bruxelles',
  },
  Luxembourg: {
    requiredLanguage: 'Français',
    requiredLanguageLevel: 'B2',
    minimumGrade: 'Diplôme de fin d’études secondaires reconnu',
    admissionRequirements: 'Cursus multilingue : français, allemand et anglais souvent exigés ensemble',
  },
};

/**
 * Surcharges par établissement, là où la sélectivité ou la langue s'écartent
 * nettement du socle national et sont publiquement documentées.
 */
const OVERRIDES: Record<string, Partial<Profile>> = {
  // ── Royaume-Uni : les plus sélectives publient des offres A*AA et plus.
  'Oxford University': { requiredLanguageLevel: 'C1', minimumGrade: 'A-levels A*A*A à AAA selon la filière', admissionRequirements: 'UCAS au 15 octobre ; test d’admission écrit puis entretien ; IELTS 7.0-7.5' },
  'University of Cambridge': { requiredLanguageLevel: 'C1', minimumGrade: 'A-levels A*A*A à A*AA', admissionRequirements: 'UCAS au 15 octobre ; test d’admission puis entretien ; IELTS 7.5' },
  'Imperial College London': { requiredLanguageLevel: 'C1', minimumGrade: 'A-levels A*A*A à AAA (matières scientifiques)', admissionRequirements: 'UCAS ; test d’admission en médecine et mathématiques ; IELTS 7.0' },
  'London School of Economics and Political Science (LSE)': { requiredLanguageLevel: 'C1', minimumGrade: 'A-levels A*AA à AAA', admissionRequirements: 'UCAS ; personal statement déterminant ; IELTS 7.0' },
  'University College London (UCL)': { requiredLanguageLevel: 'C1', minimumGrade: 'A-levels A*AA à AAB', admissionRequirements: 'UCAS ; IELTS 6.5-7.5 selon la faculté' },
  "King's College London": { requiredLanguageLevel: 'C1', minimumGrade: 'A-levels A*AA à AAB', admissionRequirements: 'UCAS ; UCAT en médecine ; IELTS 7.0' },
  'University of St Andrews': { requiredLanguageLevel: 'C1', minimumGrade: 'A-levels AAA à AAB', admissionRequirements: 'UCAS ; IELTS 7.0' },

  // ── États-Unis : sélectivité inférieure à 10 % pour ce groupe.
  'Massachusetts Institute of Technology (MIT)': { minimumGrade: 'GPA 3.9 à 4.0 sur 4.0', admissionRequirements: 'Admission très sélective (moins de 5 %) ; SAT/ACT, essais, entretien ; TOEFL 100+' },
  'Stanford University': { minimumGrade: 'GPA 3.9 à 4.0 sur 4.0', admissionRequirements: 'Admission très sélective (moins de 5 %) ; Common App, essais, recommandations ; TOEFL 100+' },
  'Harvard University': { minimumGrade: 'GPA 3.9 à 4.0 sur 4.0', admissionRequirements: 'Admission très sélective (moins de 5 %) ; Common App, essais, entretien ; TOEFL 100+' },
  'California Institute of Technology (Caltech)': { minimumGrade: 'GPA 3.9 à 4.0 sur 4.0', admissionRequirements: 'Admission très sélective ; dossier scientifique très fort exigé ; TOEFL 100+' },
  'Princeton University': { minimumGrade: 'GPA 3.9 à 4.0 sur 4.0', admissionRequirements: 'Admission très sélective (moins de 6 %) ; Common App et essais ; TOEFL 100+' },
  'Yale University': { minimumGrade: 'GPA 3.9 à 4.0 sur 4.0', admissionRequirements: 'Admission très sélective (moins de 6 %) ; Common App, essais, entretien ; TOEFL 100+' },
  'Columbia University': { minimumGrade: 'GPA 3.8 à 4.0 sur 4.0', admissionRequirements: 'Admission très sélective ; Common App, essais et recommandations ; TOEFL 100+' },
  'University of Chicago': { minimumGrade: 'GPA 3.8 à 4.0 sur 4.0', admissionRequirements: 'Admission très sélective ; essais réputés atypiques ; TOEFL 100+' },
  'University of Pennsylvania': { minimumGrade: 'GPA 3.8 à 4.0 sur 4.0', admissionRequirements: 'Admission très sélective ; Common App et essais ; TOEFL 100+' },
  'Johns Hopkins University': { minimumGrade: 'GPA 3.8 à 4.0 sur 4.0', admissionRequirements: 'Admission très sélective ; dossier scientifique fort en filière santé ; TOEFL 100+' },
  'Duke University': { minimumGrade: 'GPA 3.8 à 4.0 sur 4.0', admissionRequirements: 'Admission très sélective ; Common App et essais ; TOEFL 100+' },

  // ── France : concours et grandes écoles, distincts de Parcoursup.
  'École Polytechnique': { minimumGrade: 'Mention Très Bien (16/20) — concours d’entrée', admissionRequirements: 'Concours après classe préparatoire, ou admission internationale sur dossier et entretien' },
  'École Normale Supérieure (ENS)': { minimumGrade: 'Mention Très Bien (16/20) — concours d’entrée', admissionRequirements: 'Concours après classe préparatoire ; sélection internationale sur dossier' },
  'CentraleSupélec': { minimumGrade: 'Mention Très Bien (16/20) — concours Centrale-Supélec', admissionRequirements: 'Concours après classe préparatoire ; admission internationale sur dossier' },
  'Sciences Po Paris': { minimumGrade: 'Mention Très Bien (16/20)', admissionRequirements: 'Procédure propre hors Parcoursup pour l’international : dossier, écrits et entretien' },

  // ── Établissements enseignant dans une autre langue que celle du pays.
  'IE University': { requiredLanguage: 'Anglais', requiredLanguageLevel: 'B2', admissionRequirements: 'Admission propre sur dossier et entretien ; cursus en anglais ; IELTS 6.5' },
  'Université de Sherbrooke': { requiredLanguage: 'Français' },
  'Université de Montréal': { requiredLanguage: 'Français' },
  'Université Laval': { requiredLanguage: 'Français' },
  'Université de Lausanne': { requiredLanguage: 'Français', requiredLanguageLevel: 'B2' },
  'Université de Genève': { requiredLanguage: 'Français', requiredLanguageLevel: 'B2' },
  'Université de Neuchâtel': { requiredLanguage: 'Français', requiredLanguageLevel: 'B2' },
  'Université de Fribourg': { requiredLanguage: 'Français', requiredLanguageLevel: 'B2' },
  'École polytechnique fédérale de Lausanne (EPFL)': { requiredLanguage: 'Français', requiredLanguageLevel: 'B2' },
  'Haute école spécialisée de Suisse occidentale (HES-SO)': { requiredLanguage: 'Français', requiredLanguageLevel: 'B2' },
  'Università della Svizzera italiana (USI)': { requiredLanguage: 'Italien', requiredLanguageLevel: 'B2' },
  'Scuola universitaria professionale della Svizzera italiana (SUPSI)': { requiredLanguage: 'Italien', requiredLanguageLevel: 'B2' },

  // ── Chine et Italie : cursus d'élite à sélection nationale.
  'Tsinghua University': { minimumGrade: 'HSK 5 ; score Gaokao au niveau national le plus élevé', admissionRequirements: 'Admission internationale sur dossier et entretien ; HSK 5 exigé' },
  'Peking University': { minimumGrade: 'HSK 5 ; score Gaokao au niveau national le plus élevé', admissionRequirements: 'Admission internationale sur dossier et entretien ; HSK 5 exigé' },
  'Scuola Normale Superiore di Pisa': { minimumGrade: 'Concours d’entrée national très sélectif', admissionRequirements: 'Concours écrit et oral ; effectifs très restreints' },
  'Università Bocconi': { minimumGrade: 'Diplôme secondaire — test d’admission Bocconi', admissionRequirements: 'Admission propre sur test et dossier ; nombreux cursus en anglais' },
};

async function main() {
  const urlsPath = path.resolve(process.argv[2] ?? '');
  const verified: { id: number; name: string; found: string }[] = urlsPath && fs.existsSync(urlsPath)
    ? JSON.parse(fs.readFileSync(urlsPath, 'utf8')).filter((r: any) => r.found)
    : [];
  const urlById = new Map(verified.map(r => [r.id, r.found]));
  console.log(`Pages de candidature vérifiées fournies : ${urlById.size}`);

  const all = await prisma.university.findMany({ select: { id: true, name: true, country: true, applicationUrl: true } });
  let profiled = 0;
  let urlsSet = 0;
  const unknownCountries = new Set<string>();

  for (const u of all) {
    const base = BY_COUNTRY[u.country];
    if (!base) { unknownCountries.add(u.country); continue; }

    const data: any = { ...base, ...(OVERRIDES[u.name] ?? {}) };

    const url = urlById.get(u.id);
    if (url && !u.applicationUrl) { data.applicationUrl = url; urlsSet++; }

    await prisma.university.update({ where: { id: u.id }, data });
    profiled++;
  }

  console.log(`✅ ${profiled} fiches complétées (langue + note + sélection).`);
  console.log(`   dont ${urlsSet} pages de candidature posées.`);
  if (unknownCountries.size) console.log('⚠️ pays sans référentiel :', [...unknownCountries].join(', '));
}

main()
  .catch(e => { console.error('❌', e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
