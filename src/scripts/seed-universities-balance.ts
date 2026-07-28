import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Rééquilibrage du catalogue universitaire (story 5.12).
 *
 * Après la story 5.11, les 12 pays d'études étaient tous couverts mais très
 * inégalement : Germany 27, France 9, et 6 partout ailleurs. Ce script porte
 * chacun des 11 pays hors Allemagne à **20 universités**.
 *
 * Conventions reprises du catalogue existant :
 *   - format `{ name, city, country, website, specialty, programs: [{name, level}] }` ;
 *   - intitulés de filières en français, préfixe « Master en » pour les Masters —
 *     c'est ce préfixe qui détermine le `level` (cf. `toPrograms`), et c'est aussi
 *     ce qui rend les filières classables par `universitySectors` (story 5.10).
 *
 * Deux partis pris assumés, à corriger depuis l'admin :
 *
 * 1. `applicationUrl` n'est **pas** renseigné pour ce lot. Les pages de candidature
 *    de 151 établissements ne se devinent pas, et un lien faux envoie l'étudiant
 *    sur une 404 : mieux vaut un champ vide, visible comme tel dans l'admin.
 *    Le `website` officiel, lui, est renseigné.
 *
 * 2. `requiredLanguage` / `requiredLanguageLevel` portent la langue principale
 *    d'enseignement et un plancher indicatif (B2 ≈ IELTS 6.0-6.5, C1 ≈ IELTS 7.0+),
 *    pas l'exigence officielle d'un programme donné. Le contrôle de langue côté
 *    public (story 5.3) compare ces valeurs au profil de l'étudiant : une valeur
 *    fausse a un effet réel, elle doit être confirmée établissement par établissement.
 */

/** Un intitulé préfixé « Master » est un Master ; sinon c'est un Bachelor. */
const toPrograms = (names: string[]) =>
  names.map(name => ({ name, level: name.startsWith('Master') ? 'Master' : 'Bachelor' }));

type Entry = {
  name: string;
  city: string;
  website: string;
  specialty: string;
  programs: string[];
  /** Surcharge quand l'établissement n'enseigne pas dans la langue par défaut du pays. */
  requiredLanguage?: string;
  requiredLanguageLevel?: string;
};

type Block = {
  country: string;
  requiredLanguage: string;
  requiredLanguageLevel: string;
  entries: Entry[];
};

const BLOCKS: Block[] = [
  // ─── FRANCE (+11 → 20) ────────────────────────────────────────────────────
  {
    country: 'France',
    requiredLanguage: 'Français',
    requiredLanguageLevel: 'B2',
    entries: [
      { name: 'Université PSL', city: 'Paris', website: 'https://psl.eu', specialty: 'Regroupement d’écoles et laboratoires d’excellence', programs: ['Mathématiques', 'Physique', 'Informatique', 'Économie', 'Master en Intelligence artificielle'] },
      { name: 'Université Paris Cité', city: 'Paris', website: 'https://u-paris.fr', specialty: 'Santé, sciences et sciences humaines', programs: ['Médecine', 'Biologie', 'Informatique', 'Psychologie', 'Master en Santé publique'] },
      { name: 'Université de Strasbourg', city: 'Strasbourg', website: 'https://www.unistra.fr', specialty: 'Chimie, droit européen et sciences de la vie', programs: ['Chimie', 'Droit', 'Médecine', 'Langues étrangères', 'Master en Droit international'] },
      { name: 'Université de Bordeaux', city: 'Bordeaux', website: 'https://www.u-bordeaux.fr', specialty: 'Santé, œnologie et sciences de l’environnement', programs: ['Médecine', 'Biologie', 'Droit', 'Sciences de l’environnement', 'Master en Développement durable'] },
      { name: 'Université de Lille', city: 'Lille', website: 'https://www.univ-lille.fr', specialty: 'Sciences humaines, santé et droit', programs: ['Droit', 'Histoire', 'Médecine', 'Sociologie', 'Master en Politique publique'] },
      { name: 'Université de Montpellier', city: 'Montpellier', website: 'https://www.umontpellier.fr', specialty: 'Médecine, agronomie et sciences de l’eau', programs: ['Médecine', 'Agronomie', 'Biologie', 'Chimie', 'Master en Sciences du climat'] },
      { name: 'Université de Toulouse', city: 'Toulouse', website: 'https://www.univ-toulouse.fr', specialty: 'Aéronautique, spatial et mathématiques', programs: ['Mathématiques', 'Informatique', 'Physique', 'Génie mécanique', 'Master en Aéronautique'] },
      { name: 'Nantes Université', city: 'Nantes', website: 'https://www.univ-nantes.fr', specialty: 'Sciences de la mer, santé et droit', programs: ['Biologie marine', 'Médecine', 'Droit', 'Informatique', 'Master en Développement durable'] },
      { name: 'INSA Lyon', city: 'Villeurbanne', website: 'https://www.insa-lyon.fr', specialty: 'École d’ingénieurs pluridisciplinaire', programs: ['Génie civil', 'Génie mécanique', 'Informatique', 'Sciences des matériaux', 'Master en Ingénierie'] },
      { name: 'CentraleSupélec', city: 'Gif-sur-Yvette', website: 'https://www.centralesupelec.fr', specialty: 'Ingénierie généraliste et systèmes complexes', programs: ['Génie électrique', 'Informatique', 'Mathématiques appliquées', 'Master en Ingénierie', 'Master en Data Science'] },
      { name: 'Université de Rennes', city: 'Rennes', website: 'https://www.univ-rennes.fr', specialty: 'Droit, sciences politiques et numérique', programs: ['Droit', 'Sciences politiques', 'Informatique', 'Chimie', 'Master en Cybersecurity'] },
    ],
  },

  // ─── UNITED KINGDOM (+14 → 20) ────────────────────────────────────────────
  {
    country: 'United Kingdom',
    requiredLanguage: 'Anglais',
    requiredLanguageLevel: 'B2',
    entries: [
      { name: "King's College London", city: 'Londres', website: 'https://www.kcl.ac.uk', specialty: 'Médecine, droit et relations internationales', programs: ['Médecine', 'Droit', 'Relations internationales', 'Psychologie', 'Master en Santé publique'], requiredLanguageLevel: 'C1' },
      { name: 'University of Manchester', city: 'Manchester', website: 'https://www.manchester.ac.uk', specialty: 'Ingénierie, sciences des matériaux et sciences sociales', programs: ['Génie mécanique', 'Sciences des matériaux', 'Informatique', 'Économie', 'Master en Ingénierie'] },
      { name: 'University of Bristol', city: 'Bristol', website: 'https://www.bristol.ac.uk', specialty: 'Aéronautique, sciences de la Terre et droit', programs: ['Génie aéronautique', 'Géologie', 'Droit', 'Informatique', 'Master en Aéronautique'] },
      { name: 'University of Warwick', city: 'Coventry', website: 'https://warwick.ac.uk', specialty: 'Mathématiques, économie et management', programs: ['Mathématiques', 'Économie', 'Informatique', 'Administration des affaires', 'Master en Management'] },
      { name: 'University of Glasgow', city: 'Glasgow', website: 'https://www.gla.ac.uk', specialty: 'Médecine, vétérinaire et sciences humaines', programs: ['Médecine', 'Médecine vétérinaire', 'Droit', 'Histoire', 'Master en Santé publique'] },
      { name: 'University of Birmingham', city: 'Birmingham', website: 'https://www.birmingham.ac.uk', specialty: 'Ingénierie, santé et sciences sociales', programs: ['Génie civil', 'Médecine', 'Économie', 'Psychologie', 'Master en Ingénierie'] },
      { name: 'University of Leeds', city: 'Leeds', website: 'https://www.leeds.ac.uk', specialty: 'Textile, environnement et communication', programs: ['Sciences de l’environnement', 'Design industriel', 'Communication', 'Informatique', 'Master en Développement durable'] },
      { name: 'University of Sheffield', city: 'Sheffield', website: 'https://www.sheffield.ac.uk', specialty: 'Métallurgie, architecture et robotique', programs: ['Sciences des matériaux', 'Architecture', 'Génie mécanique', 'Informatique', 'Master en Robotique'] },
      { name: 'University of Nottingham', city: 'Nottingham', website: 'https://www.nottingham.ac.uk', specialty: 'Pharmacie, agronomie et ingénierie', programs: ['Sciences pharmaceutiques', 'Agronomie', 'Génie civil', 'Économie', 'Master en Sciences pharmaceutiques'] },
      { name: 'University of Southampton', city: 'Southampton', website: 'https://www.southampton.ac.uk', specialty: 'Océanographie et ingénierie navale', programs: ['Biologie marine', 'Génie mécanique', 'Informatique', 'Médecine', 'Master en Ingénierie'] },
      { name: 'Durham University', city: 'Durham', website: 'https://www.durham.ac.uk', specialty: 'Théologie, archéologie et physique', programs: ['Archéologie', 'Physique', 'Droit', 'Histoire', 'Master en Archéologie'] },
      { name: 'University of St Andrews', city: 'St Andrews', website: 'https://www.st-andrews.ac.uk', specialty: 'Philosophie, relations internationales et physique', programs: ['Philosophie', 'Relations internationales', 'Physique', 'Littérature', 'Master en Relations internationales'], requiredLanguageLevel: 'C1' },
      { name: 'Queen Mary University of London', city: 'Londres', website: 'https://www.qmul.ac.uk', specialty: 'Droit, médecine et sciences des données', programs: ['Droit', 'Médecine', 'Informatique', 'Économie', 'Master en Data Science'] },
      { name: 'University of Exeter', city: 'Exeter', website: 'https://www.exeter.ac.uk', specialty: 'Sciences du climat et management', programs: ['Sciences de l’environnement', 'Administration des affaires', 'Psychologie', 'Géologie', 'Master en Sciences du climat'] },
    ],
  },

  // ─── UNITED STATES (+14 → 20) ─────────────────────────────────────────────
  {
    country: 'United States',
    requiredLanguage: 'Anglais',
    requiredLanguageLevel: 'C1',
    entries: [
      { name: 'Princeton University', city: 'Princeton (New Jersey)', website: 'https://www.princeton.edu', specialty: 'Mathématiques, physique et affaires publiques', programs: ['Mathématiques', 'Physique', 'Économie', 'Sciences politiques', 'Master en Politique publique'] },
      { name: 'Yale University', city: 'New Haven (Connecticut)', website: 'https://www.yale.edu', specialty: 'Droit, arts et sciences humaines', programs: ['Droit', 'Histoire', 'Arts', 'Économie', 'Master en Droit international'] },
      { name: 'California Institute of Technology (Caltech)', city: 'Pasadena (Californie)', website: 'https://www.caltech.edu', specialty: 'Physique, astronomie et ingénierie spatiale', programs: ['Physique', 'Astronomie', 'Chimie', 'Informatique', 'Master en Physique théorique'] },
      { name: 'University of Chicago', city: 'Chicago (Illinois)', website: 'https://www.uchicago.edu', specialty: 'Économie, sociologie et sciences politiques', programs: ['Économie', 'Sociologie', 'Sciences politiques', 'Mathématiques', 'Master en Économie'] },
      { name: 'University of Pennsylvania', city: 'Philadelphie (Pennsylvanie)', website: 'https://www.upenn.edu', specialty: 'Business, médecine et sciences sociales', programs: ['Administration des affaires', 'Médecine', 'Sciences infirmières', 'Économie', 'Master en Finance'] },
      { name: 'Cornell University', city: 'Ithaca (New York)', website: 'https://www.cornell.edu', specialty: 'Agronomie, hôtellerie et ingénierie', programs: ['Agronomie', 'Génie mécanique', 'Informatique', 'Biologie', 'Master en Ingénierie'] },
      { name: 'Johns Hopkins University', city: 'Baltimore (Maryland)', website: 'https://www.jhu.edu', specialty: 'Médecine et santé publique', programs: ['Médecine', 'Sciences biomédicales', 'Sciences infirmières', 'Biologie', 'Master en Santé publique'] },
      { name: 'Duke University', city: 'Durham (Caroline du Nord)', website: 'https://www.duke.edu', specialty: 'Médecine, droit et politiques publiques', programs: ['Médecine', 'Droit', 'Économie', 'Sciences de l’environnement', 'Master en Politique publique'] },
      { name: 'Northwestern University', city: 'Evanston (Illinois)', website: 'https://www.northwestern.edu', specialty: 'Journalisme, management et ingénierie', programs: ['Journalisme', 'Administration des affaires', 'Génie électrique', 'Psychologie', 'Master en Journalisme'] },
      { name: 'University of California, Los Angeles (UCLA)', city: 'Los Angeles (Californie)', website: 'https://www.ucla.edu', specialty: 'Cinéma, médecine et sciences sociales', programs: ['Arts', 'Médecine', 'Psychologie', 'Informatique', 'Master en Santé publique'] },
      { name: 'New York University (NYU)', city: 'New York', website: 'https://www.nyu.edu', specialty: 'Arts, finance et sciences sociales', programs: ['Arts', 'Économie', 'Informatique', 'Sciences politiques', 'Master en Finance'] },
      { name: 'Carnegie Mellon University', city: 'Pittsburgh (Pennsylvanie)', website: 'https://www.cmu.edu', specialty: 'Informatique, robotique et arts numériques', programs: ['Informatique', 'Génie électrique', 'Design industriel', 'Arts', 'Master en Robotique'] },
      { name: 'University of Washington', city: 'Seattle (Washington)', website: 'https://www.washington.edu', specialty: 'Santé globale, informatique et océanographie', programs: ['Informatique', 'Médecine', 'Biologie marine', 'Sciences de l’environnement', 'Master en Santé publique'], requiredLanguageLevel: 'B2' },
      { name: 'Georgia Institute of Technology', city: 'Atlanta (Géorgie)', website: 'https://www.gatech.edu', specialty: 'Ingénierie et informatique appliquée', programs: ['Génie mécanique', 'Génie électrique', 'Informatique', 'Génie civil', 'Master en Ingénierie'], requiredLanguageLevel: 'B2' },
    ],
  },

  // ─── CANADA (+14 → 20) ────────────────────────────────────────────────────
  {
    country: 'Canada',
    requiredLanguage: 'Anglais',
    requiredLanguageLevel: 'B2',
    entries: [
      { name: 'University of Alberta', city: 'Edmonton', website: 'https://www.ualberta.ca', specialty: 'Énergie, agronomie et santé', programs: ['Agronomie', 'Médecine', 'Génie mécanique', 'Informatique', 'Master en Renewable Energy'] },
      { name: 'McMaster University', city: 'Hamilton (Ontario)', website: 'https://www.mcmaster.ca', specialty: 'Médecine et ingénierie biomédicale', programs: ['Médecine', 'Sciences biomédicales', 'Génie électrique', 'Sciences infirmières', 'Master en Génie biomédical'] },
      { name: "Queen's University", city: 'Kingston (Ontario)', website: 'https://www.queensu.ca', specialty: 'Droit, commerce et ingénierie minière', programs: ['Droit', 'Commerce', 'Génie civil', 'Géologie', 'Master en Management'] },
      { name: 'University of Calgary', city: 'Calgary', website: 'https://www.ucalgary.ca', specialty: 'Géosciences, énergie et médecine vétérinaire', programs: ['Géologie', 'Médecine vétérinaire', 'Génie mécanique', 'Économie', 'Master en Renewable Energy'] },
      { name: 'Western University', city: 'London (Ontario)', website: 'https://www.uwo.ca', specialty: 'Médecine, droit et sciences de la santé', programs: ['Médecine', 'Droit', 'Sciences infirmières', 'Psychologie', 'Master en Santé publique'] },
      { name: 'University of Ottawa', city: 'Ottawa', website: 'https://www.uottawa.ca', specialty: 'Université bilingue, droit et sciences politiques', programs: ['Droit', 'Sciences politiques', 'Médecine', 'Informatique', 'Master en Droit international'] },
      { name: 'Simon Fraser University', city: 'Burnaby (Colombie-Britannique)', website: 'https://www.sfu.ca', specialty: 'Informatique, criminologie et communication', programs: ['Informatique', 'Communication', 'Sociologie', 'Économie', 'Master en Data Science'] },
      { name: 'Dalhousie University', city: 'Halifax (Nouvelle-Écosse)', website: 'https://www.dal.ca', specialty: 'Océanographie, médecine et droit maritime', programs: ['Biologie marine', 'Médecine', 'Droit', 'Génie civil', 'Master en Développement durable'] },
      { name: 'Université de Sherbrooke', city: 'Sherbrooke', website: 'https://www.usherbrooke.ca', specialty: 'Formation en alternance, génie et médecine', programs: ['Génie électrique', 'Médecine', 'Droit', 'Informatique', 'Master en Ingénierie'], requiredLanguage: 'Français' },
      { name: 'York University', city: 'Toronto', website: 'https://www.yorku.ca', specialty: 'Droit, beaux-arts et sciences sociales', programs: ['Droit', 'Arts', 'Sociologie', 'Administration des affaires', 'Master en Management'] },
      { name: 'Concordia University', city: 'Montréal', website: 'https://www.concordia.ca', specialty: 'Cinéma, design et génie logiciel', programs: ['Arts', 'Design industriel', 'Génie logiciel', 'Administration des affaires', 'Master en Informatique'] },
      { name: 'University of Victoria', city: 'Victoria (Colombie-Britannique)', website: 'https://www.uvic.ca', specialty: 'Sciences océaniques et droit autochtone', programs: ['Biologie marine', 'Droit', 'Informatique', 'Sciences de l’environnement', 'Master en Sciences du climat'] },
      { name: 'University of Manitoba', city: 'Winnipeg', website: 'https://umanitoba.ca', specialty: 'Agronomie, médecine et ingénierie', programs: ['Agronomie', 'Médecine', 'Génie civil', 'Sciences infirmières', 'Master en Agronomie'] },
      { name: 'University of Saskatchewan', city: 'Saskatoon', website: 'https://www.usask.ca', specialty: 'Agronomie, vétérinaire et sciences nucléaires', programs: ['Agronomie', 'Médecine vétérinaire', 'Physique', 'Biologie', 'Master en Agronomie'] },
    ],
  },

  // ─── NETHERLANDS (+14 → 20) ───────────────────────────────────────────────
  {
    country: 'Netherlands',
    requiredLanguage: 'Anglais',
    requiredLanguageLevel: 'B2',
    entries: [
      { name: 'Vrije Universiteit Amsterdam', city: 'Amsterdam', website: 'https://vu.nl/en', specialty: 'Sciences de la vie, théologie et droit', programs: ['Médecine', 'Droit', 'Biologie', 'Psychologie', 'Master en Santé publique'] },
      { name: 'University of Groningen', city: 'Groningue', website: 'https://www.rug.nl/en/', specialty: 'Énergie, droit et sciences du comportement', programs: ['Droit', 'Psychologie', 'Physique', 'Économie', 'Master en Renewable Energy'] },
      { name: 'Radboud University', city: 'Nimègue', website: 'https://www.ru.nl/en', specialty: 'Neurosciences, linguistique et médecine', programs: ['Médecine', 'Linguistique', 'Psychologie', 'Biologie', 'Master en Neurosciences'] },
      { name: 'Maastricht University', city: 'Maastricht', website: 'https://www.maastrichtuniversity.nl/', specialty: 'Apprentissage par problèmes, santé et études européennes', programs: ['Médecine', 'Économie', 'Droit', 'Relations internationales', 'Master en European Studies'] },
      { name: 'Tilburg University', city: 'Tilburg', website: 'https://www.tilburguniversity.edu', specialty: 'Économie, droit et sciences des données', programs: ['Économie', 'Droit', 'Sociologie', 'Informatique', 'Master en Data Science'] },
      { name: 'University of Twente', city: 'Enschede', website: 'https://www.utwente.nl/en/', specialty: 'Technologies et sciences sociales combinées', programs: ['Génie électrique', 'Informatique', 'Génie mécanique', 'Administration des affaires', 'Master en Robotique'] },
      { name: 'Wageningen University & Research', city: 'Wageningen', website: 'https://www.wur.nl/en.htm', specialty: 'Référence mondiale en agronomie et alimentation', programs: ['Agronomie', 'Sciences de l’environnement', 'Biologie', 'Nutrition', 'Master en Développement durable'] },
      { name: 'Open Universiteit', city: 'Heerlen', website: 'https://www.ou.nl/en/', specialty: 'Enseignement à distance accrédité', programs: ['Informatique', 'Droit', 'Psychologie', 'Administration des affaires', 'Master en Management'] },
      { name: 'Amsterdam University of Applied Sciences', city: 'Amsterdam', website: 'https://www.amsterdamuas.com', specialty: 'Formations professionnalisantes en ville', programs: ['Administration des affaires', 'Informatique', 'Communication', 'Sciences infirmières', 'Master en Innovation'] },
      { name: 'Rotterdam University of Applied Sciences', city: 'Rotterdam', website: 'https://www.rotterdamuas.com', specialty: 'Logistique portuaire et entrepreneuriat', programs: ['Commerce', 'Génie civil', 'Informatique', 'Communication', 'Master en Entrepreneuriat'] },
      { name: 'The Hague University of Applied Sciences', city: 'La Haye', website: 'https://www.thuas.com', specialty: 'Droit international et sécurité', programs: ['Droit', 'Relations internationales', 'Commerce', 'Informatique', 'Master en Information Security'] },
      { name: 'Fontys University of Applied Sciences', city: 'Eindhoven', website: 'https://www.fontys.edu', specialty: 'Technologies appliquées et arts', programs: ['Génie électrique', 'Informatique', 'Design industriel', 'Arts', 'Master en Innovation'] },
      { name: 'Saxion University of Applied Sciences', city: 'Enschede', website: 'https://www.saxion.edu', specialty: 'Sciences appliquées et design', programs: ['Informatique', 'Génie mécanique', 'Design industriel', 'Administration des affaires', 'Master en Innovation'] },
      { name: 'Hanze University of Applied Sciences', city: 'Groningue', website: 'https://www.hanze.nl/eng', specialty: 'Énergies renouvelables et santé', programs: ['Sciences infirmières', 'Génie électrique', 'Commerce', 'Communication', 'Master en Renewable Energy'] },
    ],
  },

  // ─── SPAIN (+14 → 20) ─────────────────────────────────────────────────────
  {
    country: 'Spain',
    requiredLanguage: 'Espagnol',
    requiredLanguageLevel: 'B2',
    entries: [
      { name: 'Universidad Politécnica de Madrid', city: 'Madrid', website: 'https://www.upm.es', specialty: 'Première université technique espagnole', programs: ['Génie civil', 'Architecture', 'Informatique', 'Génie aéronautique', 'Master en Ingénierie'] },
      { name: 'Universidad Carlos III de Madrid', city: 'Madrid', website: 'https://www.uc3m.es/home', specialty: 'Économie, droit et ingénierie', programs: ['Économie', 'Droit', 'Informatique', 'Génie électrique', 'Master en Finance'] },
      { name: 'Universitat Politècnica de Catalunya', city: 'Barcelone', website: 'https://www.upc.edu/en', specialty: 'Architecture, télécommunications et aéronautique', programs: ['Architecture', 'Génie électrique', 'Informatique', 'Génie civil', 'Master en Ingénierie'] },
      { name: 'Universitat Pompeu Fabra', city: 'Barcelone', website: 'https://www.upf.edu/en/', specialty: 'Économie, communication et biomédecine', programs: ['Économie', 'Communication', 'Sciences biomédicales', 'Droit', 'Master en Économie'] },
      { name: 'Universidad de Granada', city: 'Grenade', website: 'https://www.ugr.es', specialty: 'Traduction, sciences humaines et pharmacie', programs: ['Traduction', 'Sciences pharmaceutiques', 'Histoire', 'Médecine', 'Master en Traduction'] },
      { name: 'Universidad de Sevilla', city: 'Séville', website: 'https://www.us.es', specialty: 'Ingénierie, architecture et sciences humaines', programs: ['Génie civil', 'Architecture', 'Médecine', 'Histoire', 'Master en Ingénierie'] },
      { name: 'Universidad de Salamanca', city: 'Salamanque', website: 'https://www.usal.es', specialty: 'Plus ancienne université d’Espagne, langues et droit', programs: ['Langues étrangères', 'Droit', 'Histoire', 'Traduction', 'Master en Langues appliquées'] },
      { name: 'Universitat de València', city: 'Valence', website: 'https://www.uv.es/uvweb/college/en/', specialty: 'Sciences de la santé et sciences sociales', programs: ['Médecine', 'Sciences pharmaceutiques', 'Psychologie', 'Économie', 'Master en Santé publique'] },
      { name: 'Universidad de Zaragoza', city: 'Saragosse', website: 'https://www.unizar.es', specialty: 'Nanosciences, vétérinaire et ingénierie', programs: ['Médecine vétérinaire', 'Physique', 'Génie mécanique', 'Chimie', 'Master en Nanosciences'] },
      { name: 'Universidad del País Vasco', city: 'Bilbao', website: 'https://www.ehu.eus/en/en-home', specialty: 'Ingénierie industrielle et sciences sociales', programs: ['Génie mécanique', 'Économie', 'Sociologie', 'Informatique', 'Master en Ingénierie'] },
      { name: 'Universidade de Santiago de Compostela', city: 'Saint-Jacques-de-Compostelle', website: 'https://www.usc.gal/en', specialty: 'Pharmacie, vétérinaire et sciences de la mer', programs: ['Sciences pharmaceutiques', 'Médecine vétérinaire', 'Biologie marine', 'Chimie', 'Master en Sciences pharmaceutiques'] },
      { name: 'Universidad de Alicante', city: 'Alicante', website: 'https://www.ua.es/en/', specialty: 'Tourisme, droit et sciences de la mer', programs: ['Tourisme', 'Droit', 'Biologie marine', 'Informatique', 'Master en Tourisme'] },
      { name: 'Universidad de Málaga', city: 'Malaga', website: 'https://www.uma.es/?set_language=en', specialty: 'Télécommunications, tourisme et santé', programs: ['Génie électrique', 'Tourisme', 'Médecine', 'Informatique', 'Master en Data Science'] },
      { name: 'IE University', city: 'Ségovie', website: 'https://www.ie.edu', specialty: 'Business, droit et architecture, enseignement en anglais', programs: ['Administration des affaires', 'Droit', 'Architecture', 'Communication', 'Master en Management'], requiredLanguage: 'Anglais' },
    ],
  },

  // ─── SWEDEN (+14 → 20) ────────────────────────────────────────────────────
  {
    country: 'Sweden',
    requiredLanguage: 'Anglais',
    requiredLanguageLevel: 'B2',
    entries: [
      { name: 'University of Gothenburg', city: 'Göteborg', website: 'https://www.gu.se/en', specialty: 'Sciences de la mer, économie et arts', programs: ['Biologie marine', 'Économie', 'Arts', 'Médecine', 'Master en Sciences du climat'] },
      { name: 'Linköping University', city: 'Linköping', website: 'https://liu.se/en', specialty: 'Ingénierie, informatique et médecine', programs: ['Informatique', 'Génie électrique', 'Médecine', 'Économie', 'Master en Intelligence artificielle'] },
      { name: 'Umeå University', city: 'Umeå', website: 'https://www.umu.se/en/', specialty: 'Design, écologie arctique et médecine', programs: ['Design industriel', 'Sciences de l’environnement', 'Médecine', 'Informatique', 'Master en Sciences du climat'] },
      { name: 'Örebro University', city: 'Örebro', website: 'https://www.oru.se/english/', specialty: 'Santé, droit et sciences du sport', programs: ['Médecine', 'Droit', 'Sciences du sport', 'Psychologie', 'Master en Santé publique'] },
      { name: 'Linnaeus University', city: 'Växjö', website: 'https://lnu.se/en/', specialty: 'Foresterie, design et entrepreneuriat', programs: ['Sciences de l’environnement', 'Design industriel', 'Administration des affaires', 'Informatique', 'Master en Entrepreneuriat'] },
      { name: 'Karlstad University', city: 'Karlstad', website: 'https://www.kau.se/en', specialty: 'Sciences des services et ingénierie', programs: ['Génie mécanique', 'Informatique', 'Économie', 'Communication', 'Master en Innovation'] },
      { name: 'Luleå University of Technology', city: 'Luleå', website: 'https://www.ltu.se/en', specialty: 'Technologies minières et spatiales', programs: ['Géologie', 'Génie mécanique', 'Informatique', 'Physique', 'Master en Ingénierie'] },
      { name: 'Mid Sweden University', city: 'Sundsvall', website: 'https://www.miun.se/en/', specialty: 'Sciences des matériaux et tourisme', programs: ['Sciences des matériaux', 'Tourisme', 'Informatique', 'Communication', 'Master en Développement durable'] },
      { name: 'Malmö University', city: 'Malmö', website: 'https://mau.se/en/', specialty: 'Odontologie, migration et santé', programs: ['Odontologie', 'Sciences infirmières', 'Sociologie', 'Informatique', 'Master en Migration Studies'] },
      { name: 'Jönköping University', city: 'Jönköping', website: 'https://ju.se/en', specialty: 'Business international et éducation', programs: ['Administration des affaires', 'Éducation', 'Informatique', 'Génie mécanique', 'Master en Management'] },
      { name: 'Swedish University of Agricultural Sciences (SLU)', city: 'Uppsala', website: 'https://www.slu.se/en/', specialty: 'Agronomie, foresterie et vétérinaire', programs: ['Agronomie', 'Médecine vétérinaire', 'Sciences de l’environnement', 'Biologie', 'Master en Développement durable'] },
      { name: 'Södertörn University', city: 'Stockholm', website: 'https://www.sh.se/english', specialty: 'Sciences sociales et études baltiques', programs: ['Sociologie', 'Sciences politiques', 'Journalisme', 'Histoire', 'Master en Relations internationales'] },
      { name: 'Mälardalen University', city: 'Västerås', website: 'https://www.mdu.se/en/', specialty: 'Robotique, énergie et santé', programs: ['Génie électrique', 'Informatique', 'Sciences infirmières', 'Économie', 'Master en Robotique'] },
      { name: 'Halmstad University', city: 'Halmstad', website: 'https://www.hh.se/english', specialty: 'Innovation, santé numérique et mécatronique', programs: ['Informatique', 'Génie mécanique', 'Sciences infirmières', 'Administration des affaires', 'Master en Innovation'] },
    ],
  },

  // ─── SWITZERLAND (+14 → 20) ───────────────────────────────────────────────
  {
    country: 'Switzerland',
    requiredLanguage: 'Allemand',
    requiredLanguageLevel: 'C1',
    entries: [
      { name: 'Université de Lausanne', city: 'Lausanne', website: 'https://www.unil.ch', specialty: 'Médecine, droit et sciences sociales', programs: ['Médecine', 'Droit', 'Psychologie', 'Sciences politiques', 'Master en Santé publique'], requiredLanguage: 'Français', requiredLanguageLevel: 'B2' },
      { name: 'Universität Bern', city: 'Berne', website: 'https://www.unibe.ch/index_eng.html', specialty: 'Sciences du climat, médecine et droit', programs: ['Médecine', 'Droit', 'Sciences de l’environnement', 'Physique', 'Master en Sciences du climat'] },
      { name: 'Universität St. Gallen (HSG)', city: 'Saint-Gall', website: 'https://www.unisg.ch/en/', specialty: 'Management, finance et économie', programs: ['Administration des affaires', 'Économie', 'Droit', 'Informatique', 'Master en Finance'] },
      { name: 'Université de Neuchâtel', city: 'Neuchâtel', website: 'https://www.unine.ch', specialty: 'Droit, biologie et sciences de la migration', programs: ['Droit', 'Biologie', 'Économie', 'Langues étrangères', 'Master en Migration Studies'], requiredLanguage: 'Français', requiredLanguageLevel: 'B2' },
      { name: 'Université de Fribourg', city: 'Fribourg', website: 'https://www.unifr.ch/home/en/', specialty: 'Université bilingue français-allemand', programs: ['Droit', 'Médecine', 'Économie', 'Histoire', 'Master en Droit international'], requiredLanguage: 'Français', requiredLanguageLevel: 'B2' },
      { name: 'Universität Luzern', city: 'Lucerne', website: 'https://www.unilu.ch/en/', specialty: 'Droit, théologie et sciences de la santé', programs: ['Droit', 'Sociologie', 'Histoire', 'Sciences politiques', 'Master en Santé publique'] },
      { name: 'Zürcher Hochschule für Angewandte Wissenschaften (ZHAW)', city: 'Winterthour', website: 'https://www.zhaw.ch/en/university/', specialty: 'Sciences appliquées, santé et ingénierie', programs: ['Génie mécanique', 'Informatique', 'Sciences infirmières', 'Administration des affaires', 'Master en Innovation'] },
      { name: 'Haute école spécialisée de Suisse occidentale (HES-SO)', city: 'Delémont', website: 'https://www.hes-so.ch', specialty: 'Réseau romand de hautes écoles professionnelles', programs: ['Génie électrique', 'Sciences infirmières', 'Arts', 'Administration des affaires', 'Master en Ingénierie'], requiredLanguage: 'Français', requiredLanguageLevel: 'B2' },
      { name: 'Fachhochschule Nordwestschweiz (FHNW)', city: 'Windisch', website: 'https://www.fhnw.ch/en/', specialty: 'Ingénierie, pédagogie et arts appliqués', programs: ['Génie électrique', 'Informatique', 'Éducation', 'Design industriel', 'Master en Ingénierie'] },
      { name: 'Hochschule Luzern (HSLU)', city: 'Lucerne', website: 'https://www.hslu.ch/en/', specialty: 'Musique, design et technologies du bâtiment', programs: ['Arts', 'Design industriel', 'Génie civil', 'Informatique', 'Master en Design'] },
      { name: 'Berner Fachhochschule (BFH)', city: 'Berne', website: 'https://www.bfh.ch/en/', specialty: 'Agronomie, santé et ingénierie du bois', programs: ['Agronomie', 'Sciences infirmières', 'Génie mécanique', 'Informatique', 'Master en Développement durable'] },
      { name: 'Ostschweizer Fachhochschule (OST)', city: 'Rapperswil', website: 'https://www.ost.ch/en/', specialty: 'Technologies environnementales et mécatronique', programs: ['Sciences de l’environnement', 'Génie mécanique', 'Informatique', 'Génie civil', 'Master en Renewable Energy'] },
      { name: 'Scuola universitaria professionale della Svizzera italiana (SUPSI)', city: 'Lugano', website: 'https://www.supsi.ch/home_en.html', specialty: 'Sciences appliquées en Suisse italienne', programs: ['Informatique', 'Génie civil', 'Sciences infirmières', 'Arts', 'Master en Innovation'], requiredLanguage: 'Italien', requiredLanguageLevel: 'B2' },
      { name: 'Fachhochschule Graubünden', city: 'Coire', website: 'https://www.fhgr.ch/en/', specialty: 'Tourisme, multimédia et sciences de l’information', programs: ['Tourisme', 'Communication', 'Informatique', 'Administration des affaires', 'Master en Tourisme'] },
    ],
  },

  // ─── ITALY (+14 → 20) ─────────────────────────────────────────────────────
  {
    country: 'Italy',
    requiredLanguage: 'Italien',
    requiredLanguageLevel: 'B2',
    entries: [
      { name: 'Università di Napoli Federico II', city: 'Naples', website: 'https://www.unina.it/en_GB/home', specialty: 'Plus ancienne université publique laïque au monde', programs: ['Droit', 'Médecine', 'Génie civil', 'Architecture', 'Master en Ingénierie'] },
      { name: 'Università di Torino', city: 'Turin', website: 'https://en.unito.it', specialty: 'Sciences humaines, droit et agroalimentaire', programs: ['Droit', 'Économie', 'Agronomie', 'Psychologie', 'Master en Économie'] },
      { name: 'Politecnico di Torino', city: 'Turin', website: 'https://www.polito.it/en', specialty: 'Ingénierie automobile et aérospatiale', programs: ['Génie mécanique', 'Génie aéronautique', 'Informatique', 'Architecture', 'Master en Ingénierie'] },
      { name: 'Università di Firenze', city: 'Florence', website: 'https://www.unifi.it/changelang-eng.html', specialty: 'Restauration d’art, architecture et agronomie', programs: ['Arts', 'Architecture', 'Agronomie', 'Histoire', 'Master en Cultural Heritage'] },
      { name: 'Università di Pisa', city: 'Pise', website: 'https://www.unipi.it/index.php/english', specialty: 'Informatique, physique et vétérinaire', programs: ['Informatique', 'Physique', 'Médecine vétérinaire', 'Mathématiques', 'Master en Informatique'] },
      { name: 'Scuola Normale Superiore di Pisa', city: 'Pise', website: 'https://www.sns.it/en', specialty: 'École d’élite en sciences et lettres', programs: ['Physique', 'Mathématiques', 'Philosophie', 'Littérature', 'Master en Physique théorique'] },
      { name: "Università Ca' Foscari Venezia", city: 'Venise', website: 'https://www.unive.it/pag/13526/', specialty: 'Langues orientales, économie et patrimoine', programs: ['Langues étrangères', 'Économie', 'Histoire', 'Sciences de l’environnement', 'Master en Cultural Heritage'] },
      { name: 'Università di Genova', city: 'Gênes', website: 'https://unige.it/en', specialty: 'Ingénierie navale et robotique', programs: ['Génie mécanique', 'Informatique', 'Biologie marine', 'Génie électrique', 'Master en Robotique'] },
      { name: 'Università di Pavia', city: 'Pavie', website: 'https://web.unipv.it/en/', specialty: 'Médecine, pharmacie et droit', programs: ['Médecine', 'Sciences pharmaceutiques', 'Droit', 'Biologie', 'Master en Sciences pharmaceutiques'] },
      { name: 'Università Cattolica del Sacro Cuore', city: 'Milan', website: 'https://www.unicatt.it/landing-pages/en/home.html', specialty: 'Économie, médecine et sciences de l’éducation', programs: ['Économie', 'Médecine', 'Éducation', 'Psychologie', 'Master en Management'] },
      { name: 'Università di Trento', city: 'Trente', website: 'https://www.unitn.it/en', specialty: 'Informatique, cognition et sociologie', programs: ['Informatique', 'Sociologie', 'Physique', 'Droit', 'Master en Data Science'] },
      { name: 'Università di Bari Aldo Moro', city: 'Bari', website: 'https://www.uniba.it/en', specialty: 'Agroalimentaire, droit et pharmacie', programs: ['Agronomie', 'Droit', 'Sciences pharmaceutiques', 'Médecine', 'Master en Agronomie'] },
      { name: 'Università di Catania', city: 'Catane', website: 'https://www.unict.it/en', specialty: 'Volcanologie, patrimoine et médecine', programs: ['Géologie', 'Médecine', 'Histoire', 'Agronomie', 'Master en Géologie'] },
      { name: 'Università di Verona', city: 'Vérone', website: 'https://www.univr.it/en/', specialty: 'Œnologie, médecine et sciences économiques', programs: ['Agronomie', 'Médecine', 'Économie', 'Langues étrangères', 'Master en Management'] },
    ],
  },

  // ─── PORTUGAL (+14 → 20) ──────────────────────────────────────────────────
  {
    country: 'Portugal',
    requiredLanguage: 'Portugais',
    requiredLanguageLevel: 'B2',
    entries: [
      { name: 'ISCTE – Instituto Universitário de Lisboa', city: 'Lisbonne', website: 'https://www.iscte-iul.pt/', specialty: 'Sciences sociales, gestion et technologies', programs: ['Sociologie', 'Administration des affaires', 'Informatique', 'Économie', 'Master en Management'] },
      { name: 'Universidade Católica Portuguesa', city: 'Lisbonne', website: 'https://www.ucp.pt/en', specialty: 'Droit, économie et santé', programs: ['Droit', 'Économie', 'Sciences infirmières', 'Psychologie', 'Master en Droit international'] },
      { name: 'Universidade da Beira Interior', city: 'Covilhã', website: 'https://www.ubi.pt/en/', specialty: 'Aéronautique, médecine et textile', programs: ['Génie aéronautique', 'Médecine', 'Sciences des matériaux', 'Informatique', 'Master en Aéronautique'] },
      { name: 'Universidade de Évora', city: 'Évora', website: 'https://www.uevora.pt/en', specialty: 'Agronomie, patrimoine et sciences de la Terre', programs: ['Agronomie', 'Histoire', 'Géologie', 'Arts', 'Master en Cultural Heritage'] },
      { name: 'Universidade dos Açores', city: 'Ponta Delgada', website: 'https://www.uac.pt', specialty: 'Sciences de la mer et volcanologie', programs: ['Biologie marine', 'Géologie', 'Tourisme', 'Sciences de l’environnement', 'Master en Sciences du climat'] },
      { name: 'Universidade da Madeira', city: 'Funchal', website: 'https://www.uma.pt', specialty: 'Tourisme, biodiversité et informatique', programs: ['Tourisme', 'Biologie', 'Informatique', 'Économie', 'Master en Tourisme'] },
      { name: 'Universidade de Trás-os-Montes e Alto Douro', city: 'Vila Real', website: 'https://www.utad.pt/en/', specialty: 'Viticulture, vétérinaire et agronomie', programs: ['Agronomie', 'Médecine vétérinaire', 'Sciences de l’environnement', 'Informatique', 'Master en Agronomie'] },
      { name: 'Universidade do Algarve', city: 'Faro', website: 'https://www.ualg.pt/en', specialty: 'Sciences de la mer, tourisme et biotechnologies', programs: ['Biologie marine', 'Tourisme', 'Médecine', 'Sciences de l’environnement', 'Master en Biotechnologies'] },
      { name: 'Universidade Aberta', city: 'Lisbonne', website: 'https://portal.uab.pt/en/', specialty: 'Université publique d’enseignement à distance', programs: ['Informatique', 'Administration des affaires', 'Histoire', 'Éducation', 'Master en Éducation'] },
      { name: 'Instituto Politécnico de Lisboa', city: 'Lisbonne', website: 'https://www.ipl.pt', specialty: 'Formations professionnalisantes, santé et arts', programs: ['Sciences infirmières', 'Arts', 'Communication', 'Administration des affaires', 'Master en Design'] },
      { name: 'Instituto Politécnico do Porto', city: 'Porto', website: 'https://www.ipp.pt/?set_language=en', specialty: 'Ingénierie appliquée, santé et musique', programs: ['Génie électrique', 'Informatique', 'Sciences infirmières', 'Arts', 'Master en Ingénierie'] },
      { name: 'Instituto Politécnico de Coimbra', city: 'Coimbra', website: 'https://www.ipc.pt', specialty: 'Agronomie, santé et gestion', programs: ['Agronomie', 'Sciences infirmières', 'Administration des affaires', 'Informatique', 'Master en Agronomie'] },
      { name: 'Instituto Politécnico de Leiria', city: 'Leiria', website: 'https://www.ipleiria.pt/en/', specialty: 'Design, tourisme et sciences de la mer', programs: ['Design industriel', 'Tourisme', 'Biologie marine', 'Informatique', 'Master en Design'] },
      { name: 'Instituto Politécnico de Setúbal', city: 'Setúbal', website: 'https://www.ips.pt', specialty: 'Technologies, santé et gestion', programs: ['Génie mécanique', 'Sciences infirmières', 'Administration des affaires', 'Informatique', 'Master en Innovation'] },
    ],
  },

  // ─── CHINA (+14 → 20) ─────────────────────────────────────────────────────
  {
    country: 'China',
    requiredLanguage: 'Chinois',
    requiredLanguageLevel: 'B2',
    entries: [
      { name: 'Nanjing University', city: 'Nankin', website: 'https://www.nju.edu.cn/en/', specialty: 'Sciences fondamentales et sciences humaines', programs: ['Physique', 'Chimie', 'Histoire', 'Économie', 'Master en Physique théorique'] },
      { name: 'Wuhan University', city: 'Wuhan', website: 'https://en.whu.edu.cn', specialty: 'Géomatique, droit et sciences de l’eau', programs: ['Géologie', 'Droit', 'Informatique', 'Génie civil', 'Master en Développement durable'] },
      { name: 'Sun Yat-sen University', city: 'Canton', website: 'https://www.sysu.edu.cn/en/', specialty: 'Médecine, océanographie et management', programs: ['Médecine', 'Biologie marine', 'Administration des affaires', 'Informatique', 'Master en Santé publique'] },
      { name: 'Harbin Institute of Technology', city: 'Harbin', website: 'http://en.hit.edu.cn', specialty: 'Aérospatiale, robotique et matériaux', programs: ['Génie aéronautique', 'Génie mécanique', 'Sciences des matériaux', 'Informatique', 'Master en Robotique'] },
      { name: "Xi'an Jiaotong University", city: "Xi'an", website: 'http://en.xjtu.edu.cn', specialty: 'Énergie, mécanique et management', programs: ['Génie électrique', 'Génie mécanique', 'Administration des affaires', 'Informatique', 'Master en Renewable Energy'] },
      { name: 'Beijing Normal University', city: 'Pékin', website: 'https://english.bnu.edu.cn', specialty: 'Sciences de l’éducation et psychologie', programs: ['Éducation', 'Psychologie', 'Langues étrangères', 'Histoire', 'Master en Éducation'] },
      { name: 'Tongji University', city: 'Shanghai', website: 'https://en.tongji.edu.cn', specialty: 'Architecture, urbanisme et génie civil', programs: ['Architecture', 'Génie civil', 'Design industriel', 'Sciences de l’environnement', 'Master en Urban Planning'] },
      { name: 'Nankai University', city: 'Tianjin', website: 'https://en.nankai.edu.cn', specialty: 'Chimie, économie et histoire', programs: ['Chimie', 'Économie', 'Histoire', 'Mathématiques', 'Master en Économie'] },
      { name: 'Tianjin University', city: 'Tianjin', website: 'http://www.tju.edu.cn/english/index.htm', specialty: 'Génie chimique et construction', programs: ['Génie civil', 'Chimie', 'Génie mécanique', 'Architecture', 'Master en Ingénierie'] },
      { name: 'Sichuan University', city: 'Chengdu', website: 'https://en.scu.edu.cn', specialty: 'Médecine, matériaux et sciences humaines', programs: ['Médecine', 'Sciences des matériaux', 'Littérature', 'Informatique', 'Master en Sciences pharmaceutiques'] },
      { name: 'Shandong University', city: 'Jinan', website: 'https://www.en.sdu.edu.cn', specialty: 'Mathématiques, médecine et littérature', programs: ['Mathématiques', 'Médecine', 'Littérature', 'Économie', 'Master en Mathématiques'] },
      { name: 'Xiamen University', city: 'Xiamen', website: 'https://en.xmu.edu.cn', specialty: 'Océanographie, économie et comptabilité', programs: ['Biologie marine', 'Économie', 'Comptabilité', 'Chimie', 'Master en Finance'] },
      { name: 'Beihang University', city: 'Pékin', website: 'https://ev.buaa.edu.cn', specialty: 'Aéronautique et astronautique', programs: ['Génie aéronautique', 'Génie électrique', 'Informatique', 'Sciences des matériaux', 'Master en Aéronautique'] },
      { name: 'Southeast University', city: 'Nankin', website: 'https://www.seu.edu.cn/english/', specialty: 'Architecture, transport et électronique', programs: ['Architecture', 'Génie civil', 'Génie électrique', 'Informatique', 'Master en Urban Planning'] },
    ],
  },
];

async function seedBalance() {
  try {
    console.log('🌱 Rééquilibrage du catalogue universitaire — démarrage…');
    let total = 0;
    let programsTotal = 0;

    for (const block of BLOCKS) {
      console.log(`\n── ${block.country} (${block.entries.length} ajouts) ──`);

      for (const e of block.entries) {
        const university = {
          name: e.name,
          city: e.city,
          country: block.country,
          website: e.website,
          specialty: e.specialty,
          requiredLanguage: e.requiredLanguage ?? block.requiredLanguage,
          requiredLanguageLevel: e.requiredLanguageLevel ?? block.requiredLanguageLevel,
        };

        // Upsert par nom (contrainte @unique) : le script est rejouable sans doublon.
        const created = await prisma.university.upsert({
          where: { name: university.name },
          update: university,
          create: university,
        });
        total++;

        for (const program of toPrograms(e.programs)) {
          await prisma.universityProgram.upsert({
            where: {
              universityId_name_level: {
                universityId: created.id,
                name: program.name,
                level: program.level,
              },
            },
            update: program,
            create: { ...program, universityId: created.id },
          });
          programsTotal++;
        }

        console.log(`  ✓ ${e.name}`);
      }
    }

    console.log(`\n✅ ${total} universités et ${programsTotal} filières traitées.`);
  } catch (error) {
    console.error('❌ Échec du seed :', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedBalance();
