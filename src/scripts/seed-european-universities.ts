import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const europeanUniversitiesData = [
  // FRANCE
  {
    name: 'Sorbonne Université',
    city: 'Paris',
    website: 'www.sorbonne-universite.fr',
    applicationUrl: 'www.sorbonne-universite.fr/formation/candidater-et-sinscrire',
    country: 'France',
    bachelorsPrograms: [
      'Médecine',
      'Sciences biologiques',
      'Physique',
      'Chimie',
      'Mathématiques',
      'Informatique',
      'Sciences de la Terre',
      'Histoire',
      'Littérature française',
      'Philosophie',
      'Langues étrangères appliquées',
      'Arts'
    ],
    mastersPrograms: [
      'Master en Neurosciences',
      'Master en Sciences biomédicales',
      'Master en Physique théorique',
      'Master en Chimie moléculaire',
      'Master en Intelligence artificielle',
      'Master en Sciences du climat',
      'Master en Histoire contemporaine',
      'Master en Littératures comparées',
      'Master en Musicologie',
      'Master en Archéologie'
    ],
    speciality: 'Prestige historique, excellence en sciences et lettres'
  },
  {
    name: 'École Normale Supérieure (ENS)',
    city: 'Paris',
    website: 'www.ens.psl.eu',
    applicationUrl: 'www.ens.psl.eu/admission',
    country: 'France',
    bachelorsPrograms: [
      'Sciences (sélection par concours)',
      'Lettres et sciences humaines',
      'Sciences sociales',
      'Arts',
      'Langues',
      'Mathématiques',
      'Physique',
      'Chimie',
      'Biologie',
      'Informatique',
      'Philosophie',
      'Histoire'
    ],
    mastersPrograms: [
      'Master en Sciences cognitives',
      'Master en Physique théorique',
      'Master en Mathématiques fondamentales',
      'Master en Biologie quantitative',
      'Master en Sciences sociales',
      'Master en Philosophie',
      'Master en Histoire',
      'Master en Littérature',
      'Master en Linguistique',
      'Master en Arts'
    ],
    speciality: 'Institution d\'élite, formation des futurs chercheurs et enseignants'
  },
  {
    name: 'Université Paris-Saclay',
    city: 'Saclay (région parisienne)',
    website: 'www.universite-paris-saclay.fr',
    applicationUrl: 'www.universite-paris-saclay.fr/admission',
    country: 'France',
    bachelorsPrograms: [
      'Sciences et technologies',
      'Mathématiques',
      'Informatique',
      'Physique',
      'Chimie',
      'Biologie',
      'Sciences de l\'ingénieur',
      'Économie-gestion',
      'Droit',
      'Sciences politiques',
      'STAPS',
      'Psychologie'
    ],
    mastersPrograms: [
      'Master en Data Science',
      'Master en Intelligence artificielle',
      'Master en Nanotechnologies',
      'Master en Biotechnologies',
      'Master en Énergies renouvelables',
      'Master en Aéronautique',
      'Master en Finance quantitative',
      'Master en Entrepreneuriat',
      'Master en Innovation',
      'Master en Développement durable'
    ],
    speciality: 'Pôle scientifique et technologique de premier plan'
  },
  {
    name: 'École Polytechnique',
    city: 'Palaiseau',
    website: 'www.polytechnique.edu',
    applicationUrl: 'www.polytechnique.edu/admission',
    country: 'France',
    bachelorsPrograms: [
      'Programme Bachelor of Science (3 ans)',
      'Double diplôme international',
      'Sciences appliquées',
      'Mathématiques appliquées',
      'Informatique',
      'Physique',
      'Chimie',
      'Biologie',
      'Économie',
      'Sciences sociales',
      'Langues',
      'Arts'
    ],
    mastersPrograms: [
      'Master en Science and Technology',
      'Master en Data Science',
      'Master en Cybersecurity',
      'Master en Renewable Energy',
      'Master en Economics',
      'Master en Applied Mathematics',
      'Master en Environmental Engineering',
      'Master en Entrepreneurship',
      'Master en Innovation Management',
      'Master en Artificial Intelligence'
    ],
    speciality: 'Grande école d\'ingénieurs de renommée mondiale'
  },
  {
    name: 'Sciences Po Paris',
    city: 'Paris',
    website: 'www.sciencespo.fr',
    applicationUrl: 'www.sciencespo.fr/admissions',
    country: 'France',
    bachelorsPrograms: [
      'Sciences politiques',
      'Relations internationales',
      'Économie',
      'Droit',
      'Sociologie',
      'Histoire',
      'Journalisme',
      'Communication',
      'Arts et culture',
      'Langues',
      'Études européennes',
      'Études urbaines'
    ],
    mastersPrograms: [
      'Master en Relations internationales',
      'Master en Politique publique',
      'Master en Journalisme',
      'Master en Communication',
      'Master en Management culturel',
      'Master en Droits de l\'homme',
      'Master en Finance et stratégie',
      'Master en Marketing',
      'Master en Développement durable',
      'Master en Études européennes'
    ],
    speciality: 'Excellence en sciences politiques et relations internationales'
  },
  {
    name: 'Université Claude Bernard Lyon 1',
    city: 'Lyon',
    website: 'www.univ-lyon1.fr',
    applicationUrl: 'www.univ-lyon1.fr/formation/candidater-et-sinscrire',
    country: 'France',
    bachelorsPrograms: [
      'Médecine',
      'Pharmacie',
      'Odontologie',
      'Sciences biologiques',
      'Chimie',
      'Physique',
      'Mathématiques',
      'Informatique',
      'Sciences de la Terre',
      'STAPS',
      'Sciences et technologies',
      'Génie civil'
    ],
    mastersPrograms: [
      'Master en Biotechnologies',
      'Master en Neurosciences',
      'Master en Sciences pharmaceutiques',
      'Master en Physique médicale',
      'Master en Informatique',
      'Master en Mathématiques appliquées',
      'Master en Sciences de l\'environnement',
      'Master en Génie biomédical',
      'Master en Sciences du sport',
      'Master en Nutrition'
    ],
    speciality: 'Excellence en sciences de la santé et sciences exactes'
  },
  {
    name: 'Université Grenoble Alpes',
    city: 'Grenoble',
    website: 'www.univ-grenoble-alpes.fr',
    applicationUrl: 'www.univ-grenoble-alpes.fr/formation/candidater-et-sinscrire',
    country: 'France',
    bachelorsPrograms: [
      'Sciences et technologies',
      'Mathématiques',
      'Informatique',
      'Physique',
      'Chimie',
      'Biologie',
      'Sciences de la Terre',
      'Langues étrangères',
      'Économie-gestion',
      'Droit',
      'Lettres et arts',
      'Psychologie'
    ],
    mastersPrograms: [
      'Master en Sciences des matériaux',
      'Master en Énergies renouvelables',
      'Master en Nanosciences',
      'Master en Informatique',
      'Master en Physique subatomique',
      'Master en Géologie alpine',
      'Master en Management technologique',
      'Master en Innovation',
      'Master en Tourisme',
      'Master en Langues appliquées'
    ],
    speciality: 'Excellence en sciences et technologies, cadre alpin'
  },
  {
    name: 'Université Aix-Marseille',
    city: 'Marseille/Aix-en-Provence',
    website: 'www.univ-amu.fr',
    applicationUrl: 'www.univ-amu.fr/formation/candidatures-inscriptions',
    country: 'France',
    bachelorsPrograms: [
      'Médecine',
      'Droit',
      'Économie-gestion',
      'Sciences biologiques',
      'Chimie',
      'Physique',
      'Mathématiques',
      'Informatique',
      'Sciences de la mer',
      'Lettres et langues',
      'Histoire',
      'Sociologie'
    ],
    mastersPrograms: [
      'Master en Sciences marines',
      'Master en Biodiversité',
      'Master en Neurosciences',
      'Master en Droit international',
      'Master en Management',
      'Master en Finance',
      'Master en Archéologie',
      'Master en Histoire de l\'art',
      'Master en Langues et civilisations',
      'Master en Santé publique'
    ],
    speciality: 'Excellence en sciences marines, cadre méditerranéen'
  },

  // ITALIE
  {
    name: 'Università Bocconi',
    city: 'Milan',
    website: 'www.unibocconi.it',
    applicationUrl: 'www.unibocconi.it/admission',
    country: 'Italy',
    bachelorsPrograms: [
      'Economia',
      'Business Administration',
      'International Economics',
      'Finance',
      'Management',
      'Scienze politiche',
      'Relazioni internazionali',
      'Marketing',
      'Economia aziendale',
      'Statistica',
      'Data Science',
      'Diritto'
    ],
    mastersPrograms: [
      'Master in Management',
      'Master in Finance',
      'Master in Marketing',
      'Master in Economics',
      'Master in International Business',
      'Master in Data Science',
      'Master in Digital Marketing',
      'Master in Luxury Brand Management',
      'Master in Public Administration',
      'Master in Sustainable Business'
    ],
    speciality: 'Excellence en économie, business et finance'
  },
  {
    name: 'Università degli Studi di Milano',
    city: 'Milan',
    website: 'www.unimi.it',
    applicationUrl: 'www.unimi.it/en/study/enrolment-procedures',
    country: 'Italy',
    bachelorsPrograms: [
      'Medicina e chirurgia',
      'Scienze biologiche',
      'Chimica',
      'Fisica',
      'Matematica',
      'Informatica',
      'Scienze naturali',
      'Giurisprudenza',
      'Economia',
      'Scienze politiche',
      'Lettere e filosofia',
      'Lingue e letterature straniere'
    ],
    mastersPrograms: [
      'Master in Biotecnologie',
      'Master in Neurosciences',
      'Master in Environmental Sciences',
      'Master in Computer Science',
      'Master in Mathematics',
      'Master in Physics',
      'Master in Chemistry',
      'Master in International Relations',
      'Master in European Studies',
      'Master in Cultural Heritage'
    ],
    speciality: 'Université complète de premier plan, forte recherche'
  },
  {
    name: 'Università di Bologna',
    city: 'Bologne',
    website: 'www.unibo.it',
    applicationUrl: 'www.unibo.it/en/teaching/enrolment-transfer-and-final-examination',
    country: 'Italy',
    bachelorsPrograms: [
      'Medicina e chirurgia',
      'Ingegneria',
      'Scienze biologiche',
      'Chimica',
      'Fisica',
      'Matematica',
      'Informatica',
      'Economia',
      'Giurisprudenza',
      'Lettere e beni culturali',
      'Lingue e letterature straniere',
      'Scienze della comunicazione'
    ],
    mastersPrograms: [
      'Master in Biomedical Engineering',
      'Master in Computer Science',
      'Master in Environmental Engineering',
      'Master in Economics',
      'Master in International Relations',
      'Master in Cultural Heritage',
      'Master in Digital Humanities',
      'Master in Food Science',
      'Master in Architecture',
      'Master in Sustainable Development'
    ],
    speciality: 'Plus ancienne université d\'Europe (1088), tradition académique'
  },
  {
    name: 'Politecnico di Milano',
    city: 'Milan',
    website: 'www.polimi.it',
    applicationUrl: 'www.polimi.it/en/international-admissions',
    country: 'Italy',
    bachelorsPrograms: [
      'Ingegneria aeronautica',
      'Ingegneria civile',
      'Ingegneria elettrica',
      'Ingegneria meccanica',
      'Ingegneria informatica',
      'Architettura',
      'Design industriale',
      'Ingegneria gestionale',
      'Ingegneria dei materiali',
      'Ingegneria ambientale',
      'Ingegneria energetica',
      'Design della comunicazione'
    ],
    mastersPrograms: [
      'Master in Aerospace Engineering',
      'Master in Computer Science Engineering',
      'Master in Mechanical Engineering',
      'Master in Architecture',
      'Master in Product Design',
      'Master in Environmental Engineering',
      'Master in Energy Engineering',
      'Master in Management Engineering',
      'Master in Materials Engineering',
      'Master in Urban Planning'
    ],
    speciality: 'Excellence en ingénierie, architecture et design'
  },
  {
    name: 'Università La Sapienza Roma',
    city: 'Rome',
    website: 'www.uniroma1.it',
    applicationUrl: 'www.uniroma1.it/en/node/4618',
    country: 'Italy',
    bachelorsPrograms: [
      'Medicina e chirurgia',
      'Giurisprudenza',
      'Economia',
      'Ingegneria',
      'Architettura',
      'Scienze biologiche',
      'Chimica',
      'Fisica',
      'Matematica',
      'Informatica',
      'Lettere e filosofia',
      'Scienze politiche'
    ],
    mastersPrograms: [
      'Master in Medicine',
      'Master in Engineering',
      'Master in Architecture',
      'Master in Economics',
      'Master in Law',
      'Master in Biology',
      'Master in Physics',
      'Master in Computer Science',
      'Master in Archaeology',
      'Master in International Relations'
    ],
    speciality: 'Plus grande université d\'Europe, excellence pluridisciplinaire'
  },
  {
    name: 'Università di Padova',
    city: 'Padoue',
    website: 'www.unipd.it',
    applicationUrl: 'www.unipd.it/en/international-admissions',
    country: 'Italy',
    bachelorsPrograms: [
      'Medicina e chirurgia',
      'Ingegneria',
      'Scienze biologiche',
      'Chimica',
      'Fisica',
      'Matematica',
      'Informatica',
      'Economia',
      'Giurisprudenza',
      'Lettere e filosofia',
      'Psicologia',
      'Scienze dell\'educazione'
    ],
    mastersPrograms: [
      'Master in Biomedical Sciences',
      'Master in Engineering',
      'Master in Computer Science',
      'Master in Physics',
      'Master in Mathematics',
      'Master in Chemistry',
      'Master in Psychology',
      'Master in Education',
      'Master in Economics',
      'Master in Philosophy'
    ],
    speciality: 'Tradition scientifique historique (Galilée y enseigna)'
  },

  // BELGIQUE
  {
    name: 'Université catholique de Louvain (UCLouvain)',
    city: 'Louvain-la-Neuve',
    website: 'www.uclouvain.be',
    applicationUrl: 'www.uclouvain.be/inscription',
    country: 'Belgium',
    bachelorsPrograms: [
      'Médecine',
      'Ingénieur civil',
      'Sciences biologiques',
      'Chimie',
      'Physique',
      'Mathématiques',
      'Informatique',
      'Sciences économiques',
      'Droit',
      'Sciences politiques',
      'Philosophie',
      'Histoire'
    ],
    mastersPrograms: [
      'Master en Biotechnologies',
      'Master en Ingénieur civil',
      'Master en Sciences biomédicales',
      'Master en Physique',
      'Master en Mathématiques',
      'Master en Informatique',
      'Master en Sciences de gestion',
      'Master en Relations internationales',
      'Master en Développement durable',
      'Master en Santé publique'
    ],
    speciality: 'Université catholique de renommée internationale'
  },
  {
    name: 'Université libre de Bruxelles (ULB)',
    city: 'Bruxelles',
    website: 'www.ulb.be',
    applicationUrl: 'www.ulb.be/admission',
    country: 'Belgium',
    bachelorsPrograms: [
      'Médecine',
      'Sciences biologiques',
      'Chimie',
      'Physique',
      'Mathématiques',
      'Informatique',
      'Ingénieur civil',
      'Sciences économiques',
      'Droit',
      'Sciences politiques',
      'Sociologie',
      'Philosophie'
    ],
    mastersPrograms: [
      'Master en Sciences biomédicales',
      'Master en Neurosciences',
      'Master en Informatique',
      'Master en Physique',
      'Master en Ingénierie',
      'Master en Économie',
      'Master en Relations internationales',
      'Master en Études européennes',
      'Master en Santé publique',
      'Master en Gestion culturelle'
    ],
    speciality: 'Principe du libre examen, excellence en recherche'
  },
  {
    name: 'KU Leuven',
    city: 'Louvain',
    website: 'www.kuleuven.be',
    applicationUrl: 'www.kuleuven.be/admission',
    country: 'Belgium',
    bachelorsPrograms: [
      'Medicine',
      'Engineering',
      'Biological Sciences',
      'Chemistry',
      'Physics',
      'Mathematics',
      'Computer Science',
      'Economics',
      'Law',
      'Political Science',
      'Philosophy',
      'Psychology'
    ],
    mastersPrograms: [
      'Master in Biomedical Sciences',
      'Master in Engineering',
      'Master in Computer Science',
      'Master in Physics',
      'Master in Mathematics',
      'Master in Chemistry',
      'Master in Economics',
      'Master in European Studies',
      'Master in Psychology',
      'Master in Philosophy'
    ],
    speciality: 'Université flamande de premier plan, forte recherche'
  },
  {
    name: 'Universiteit Gent',
    city: 'Gand',
    website: 'www.ugent.be',
    applicationUrl: 'www.ugent.be/admission',
    country: 'Belgium',
    bachelorsPrograms: [
      'Medicine',
      'Engineering',
      'Biological Sciences',
      'Chemistry',
      'Physics',
      'Mathematics',
      'Computer Science',
      'Economics',
      'Law',
      'Political Science',
      'Psychology',
      'Veterinary Medicine'
    ],
    mastersPrograms: [
      'Master in Biomedical Sciences',
      'Master in Engineering',
      'Master in Computer Science',
      'Master in Physics',
      'Master in Biotechnology',
      'Master in Environmental Sciences',
      'Master in Economics',
      'Master in Psychology',
      'Master in Veterinary Medicine',
      'Master in Marine Sciences'
    ],
    speciality: 'Excellence en sciences vétérinaires et biotechnologies'
  },

  // LUXEMBOURG
  {
    name: 'Université du Luxembourg',
    city: 'Luxembourg (Esch-sur-Alzette, Luxembourg-Kirchberg, Belval)',
    website: 'www.uni.lu',
    applicationUrl: 'www.uni.lu/admission',
    country: 'Luxembourg',
    bachelorsPrograms: [
      'Sciences et ingénierie',
      'Sciences de la vie',
      'Informatique',
      'Mathématiques',
      'Physique',
      'Sciences économiques',
      'Droit',
      'Sciences sociales',
      'Psychologie',
      'Éducation',
      'Langues et littératures',
      'Histoire'
    ],
    mastersPrograms: [
      'Master en Finance',
      'Master en Banking and Finance',
      'Master en Information Security',
      'Master en Software Engineering',
      'Master en Sustainable Development',
      'Master en European Governance',
      'Master en Psychology',
      'Master en Education',
      'Master en Contemporary History',
      'Master en Migration Studies'
    ],
    speciality: 'Université multilingue (français, allemand, anglais), centre financier européen'
  }
];

async function seedEuropeanUniversities() {
  console.log('🌱 Starting European universities seeding...');
  
  try {
    console.log('📚 Creating European universities...');
    
    for (const universityData of europeanUniversitiesData) {
      // Create the university first
      const university = await prisma.university.create({
        data: {
          name: universityData.name,
          city: universityData.city,
          website: universityData.website,
          applicationUrl: universityData.applicationUrl,
          country: universityData.country,
          specialty: universityData.speciality
        }
      });
      
      console.log(`✅ Created university: ${universityData.name}`);
      
      // Create bachelor programs (avoid duplicates)
      for (const program of universityData.bachelorsPrograms) {
        await prisma.universityProgram.upsert({
          where: {
            universityId_name_level: {
              universityId: university.id,
              name: program,
              level: 'Bachelor'
            }
          },
          update: {},
          create: {
            universityId: university.id,
            name: program,
            level: 'Bachelor'
          }
        });
      }
      
      // Create master programs (avoid duplicates)
      for (const program of universityData.mastersPrograms) {
        await prisma.universityProgram.upsert({
          where: {
            universityId_name_level: {
              universityId: university.id,
              name: program,
              level: 'Master'
            }
          },
          update: {},
          create: {
            universityId: university.id,
            name: program,
            level: 'Master'
          }
        });
      }
      
      console.log(`✅ Created ${universityData.bachelorsPrograms.length} bachelor and ${universityData.mastersPrograms.length} master programs for ${universityData.name}`);
    }
    
    console.log('🎉 European universities seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding European universities:', error);
    throw error;
  }
}

// Main execution function
async function main() {
  try {
    await seedEuropeanUniversities();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding directly
main();

export { seedEuropeanUniversities };