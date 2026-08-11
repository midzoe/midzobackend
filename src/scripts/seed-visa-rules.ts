/**
 * Seed des fiches visa étudiant (story 4.7).
 *
 * 20 pays d'origine d'Afrique × les pays de la partie « études » validés.
 * Le contenu d'une fiche est piloté par la DESTINATION (dossier, ressources, langue,
 * procédure) ; seules quelques informations dépendent de l'origine — pour la France
 * par exemple, la procédure « Études en France » de Campus France n'est obligatoire
 * que dans les pays à procédure CEF.
 *
 * Toutes les fiches sont créées en BROUILLON (`isValidated: false`) et sans date de
 * vérification : les montants et frais officiels changent chaque année et doivent
 * être confirmés sur la source officielle de chaque fiche avant publication.
 *
 * Idempotent : une fiche déjà présente n'est pas écrasée (les corrections faites en
 * admin survivent à une nouvelle exécution).
 *
 * Lancer : npx tsx src/scripts/seed-visa-rules.ts
 */
import prisma from "../../lib/prisma";

/** Les 20 pays d'origine couverts : Afrique de l'Ouest et Centrale + grands marchés. */
const ORIGINS = [
  "Togo", "Benin", "Côte d'Ivoire", "Senegal", "Guinea", "Mali", "Burkina Faso",
  "Niger", "Cameroon", "Chad", "Gabon", "Republic of the Congo", "DR Congo",
  "Nigeria", "Ghana", "Kenya", "Morocco", "Tunisia", "Egypt", "South Africa",
];

/**
 * Pays où la procédure « Études en France » (Campus France / CEF) est obligatoire
 * avant toute demande de visa étudiant. Ailleurs, la demande se dépose directement
 * au consulat.
 */
const CAMPUS_FRANCE_CEF = new Set([
  "Togo", "Benin", "Côte d'Ivoire", "Senegal", "Guinea", "Mali", "Burkina Faso",
  "Niger", "Cameroon", "Chad", "Gabon", "Republic of the Congo", "DR Congo",
  "Nigeria", "Morocco", "Tunisia", "Egypt",
]);

interface Fiche {
  visaRequired: boolean;
  processingTime: string;
  cost: number | null;
  currency: string;
  visaValidity: string;
  entriesType: string;
  maxStay: string;
  documentsRequired: string[];
  passportValidity: string;
  photoSpec: string | null;
  applicationFormUrl: string | null;
  fundsAmount: string | null;
  proofOfFunds: string;
  accommodationProof: string | null;
  insuranceRequired: boolean;
  insuranceMinCoverage: string | null;
  languageRequirement: string;
  admissionLetterRequired: boolean;
  guarantorRequired: boolean;
  criminalRecordRequired: boolean;
  medicalExamRequired: boolean;
  vaccinations: string | null;
  returnTicketRequired: boolean;
  whereToApply: string;
  appointmentUrl: string | null;
  biometricsRequired: boolean;
  interviewRequired: boolean;
  applicationSteps: string[];
  commonRefusalReasons: string[];
  notes: string;
  officialSourceUrl: string;
}

const DESTINATIONS: Record<string, Fiche> = {
  France: {
    visaRequired: true,
    processingTime: "2 à 4 semaines après le dépôt — la procédure Campus France doit démarrer 6 à 9 mois avant la rentrée",
    cost: 50,
    currency: "EUR",
    visaValidity: "VLS-TS de 4 à 12 mois, à valider en ligne dans les 3 mois suivant l'arrivée",
    entriesType: "Entrées multiples",
    maxStay: "Année universitaire, renouvelable par titre de séjour étudiant",
    documentsRequired: [
      "Passeport en cours de validité",
      "Formulaire France-Visas imprimé, daté et signé",
      "Attestation Campus France (procédure « Études en France »)",
      "Attestation d'admission ou de pré-inscription de l'établissement",
      "Justificatif de ressources pour toute la durée du séjour",
      "Justificatif de logement en France",
      "Diplômes et relevés de notes",
      "Photos d'identité aux normes",
      "Attestation d'assurance maladie pour les premiers mois",
      "Justificatif de paiement des frais de dossier",
    ],
    passportValidity: "Valide au moins 3 mois après la fin du séjour prévu, avec 2 pages vierges",
    photoSpec: "35 × 45 mm, fond clair uni, de face, tête nue, moins de 6 mois",
    applicationFormUrl: "https://france-visas.gouv.fr",
    fundsAmount: "615 € par mois, soit environ 7 380 € pour l'année universitaire",
    proofOfFunds: "Relevés bancaires des 3 derniers mois, attestation de bourse, ou attestation de prise en charge d'un garant accompagnée de ses justificatifs de revenus",
    accommodationProof: "Attestation de logement CROUS, contrat de bail, attestation d'hébergement ou réservation couvrant les premiers mois",
    insuranceRequired: true,
    insuranceMinCoverage: "Couverture des soins pour les 3 premiers mois, puis affiliation gratuite à la Sécurité sociale étudiante",
    languageRequirement: "B2 en français (DELF, DALF, TCF, TEF) pour un cursus en français ; IELTS ou TOEFL pour un cursus en anglais",
    admissionLetterRequired: true,
    guarantorRequired: false,
    criminalRecordRequired: false,
    medicalExamRequired: false,
    vaccinations: null,
    returnTicketRequired: false,
    whereToApply: "Espace Campus France de votre pays, puis dépôt du dossier chez VFS Global ou TLScontact",
    appointmentUrl: "https://www.campusfrance.org/fr/etudes-en-france-procedure",
    biometricsRequired: true,
    interviewRequired: true,
    applicationSteps: [
      "Créer son dossier sur la plateforme « Études en France » de Campus France",
      "Saisir son projet d'études et candidater aux formations",
      "Passer l'entretien Campus France",
      "Obtenir l'attestation Campus France après acceptation",
      "Créer sa demande sur France-Visas et payer les frais de dossier",
      "Prendre rendez-vous chez VFS Global ou TLScontact",
      "Déposer le dossier complet et donner ses empreintes",
      "Récupérer le passeport, puis valider le VLS-TS en ligne dans les 3 mois suivant l'arrivée",
    ],
    commonRefusalReasons: [
      "Ressources financières insuffisantes ou mal justifiées",
      "Projet d'études incohérent avec le parcours antérieur",
      "Entretien Campus France peu convaincant",
      "Documents non authentifiés ou traduction assermentée manquante",
      "Absence de justificatif de logement",
    ],
    notes:
      "La visite médicale OFII est organisée après l'arrivée en France, pas avant le visa. Le montant mensuel exigé et les frais de dossier sont révisés régulièrement : les confirmer sur france-visas.gouv.fr avant de publier cette fiche.",
    officialSourceUrl: "https://france-visas.gouv.fr",
  },

  Belgium: {
    visaRequired: true,
    processingTime: "4 à 8 semaines, jusqu'à 3 mois selon le poste diplomatique",
    cost: null,
    currency: "EUR",
    visaValidity: "Visa D valable 90 jours, à convertir en titre de séjour après l'arrivée",
    entriesType: "Entrées multiples",
    maxStay: "Durée des études, par renouvellement annuel du titre de séjour",
    documentsRequired: [
      "Passeport en cours de validité",
      "Formulaire de demande de visa long séjour",
      "Attestation d'inscription ou d'admission dans un établissement reconnu",
      "Annexe 32 (engagement de prise en charge) ou preuve de ressources",
      "Certificat médical établi par un médecin agréé",
      "Extrait de casier judiciaire légalisé",
      "Diplômes et relevés de notes légalisés",
      "Attestation d'assurance maladie",
      "Photos d'identité aux normes",
    ],
    passportValidity: "Valide au moins 12 mois après la date de départ",
    photoSpec: "35 × 45 mm, fond blanc, moins de 6 mois",
    applicationFormUrl: "https://dofi.ibz.be",
    fundsAmount: "Environ 800 € par mois pour l'année académique (montant réévalué chaque année)",
    proofOfFunds: "Annexe 32 signée par un garant avec ses justificatifs de revenus, bourse d'études reconnue, ou compte bloqué auprès d'un établissement belge",
    accommodationProof: "Contrat de bail ou attestation de logement étudiant",
    insuranceRequired: true,
    insuranceMinCoverage: "Couverture des soins de santé et du rapatriement",
    languageRequirement: "B2 en français ou en néerlandais selon la communauté ; IELTS ou TOEFL pour un cursus en anglais",
    admissionLetterRequired: true,
    guarantorRequired: true,
    criminalRecordRequired: true,
    medicalExamRequired: true,
    vaccinations: null,
    returnTicketRequired: false,
    whereToApply: "Ambassade de Belgique ou centre VFS Global compétent pour votre pays de résidence",
    appointmentUrl: "https://visaonweb.diplomatie.be",
    biometricsRequired: true,
    interviewRequired: false,
    applicationSteps: [
      "Obtenir l'attestation d'inscription d'un établissement reconnu",
      "Faire légaliser les diplômes et actes d'état civil (apostille ou légalisation consulaire)",
      "Réunir l'annexe 32 ou la preuve de ressources",
      "Passer la visite médicale chez un médecin agréé et demander le casier judiciaire",
      "Introduire la demande sur Visa on Web et prendre rendez-vous",
      "Déposer le dossier et donner ses empreintes",
      "Après l'arrivée, s'inscrire à la commune pour obtenir la carte de séjour",
    ],
    commonRefusalReasons: [
      "Moyens de subsistance insuffisants ou annexe 32 incomplète",
      "Documents non légalisés ou non traduits",
      "Inscription dans un établissement non reconnu",
      "Projet d'études jugé incohérent avec le parcours",
      "Certificat médical ou casier judiciaire manquant",
    ],
    notes:
      "La légalisation des diplômes et actes d'état civil est le point qui bloque le plus souvent : l'anticiper de plusieurs mois. Les frais de visa et la redevance administrative n'ont pas été renseignés ici — les relever sur dofi.ibz.be avant publication.",
    officialSourceUrl: "https://dofi.ibz.be",
  },

  Germany: {
    visaRequired: true,
    processingTime: "6 à 12 semaines, davantage en haute saison — le rendez-vous à l'ambassade peut demander plusieurs mois d'attente",
    cost: 75,
    currency: "EUR",
    visaValidity: "Visa national de 3 à 6 mois, à convertir en titre de séjour étudiant après l'arrivée",
    entriesType: "Entrées multiples",
    maxStay: "Durée des études via le titre de séjour",
    documentsRequired: [
      "Passeport en cours de validité",
      "Formulaire VIDEX imprimé et signé",
      "Lettre d'admission d'une université allemande (Zulassungsbescheid)",
      "Preuve d'ouverture et d'alimentation d'un compte bloqué",
      "Attestation d'assurance maladie reconnue en Allemagne",
      "Diplômes et relevés de notes",
      "Certificat de langue",
      "CV et lettre de motivation détaillant le projet d'études",
      "Photos biométriques",
    ],
    passportValidity: "Valide au moins 12 mois, avec 2 pages vierges",
    photoSpec: "35 × 45 mm, biométrique, fond clair, moins de 6 mois",
    applicationFormUrl: "https://videx.diplo.de",
    fundsAmount: "11 904 € sur un compte bloqué (Sperrkonto), soit 992 € par mois",
    proofOfFunds: "Compte bloqué (Fintiba, Expatrio, Coracle…), attestation de prise en charge (Verpflichtungserklärung), ou bourse reconnue",
    accommodationProof: "Contrat de bail, place en résidence étudiante ou attestation d'hébergement",
    insuranceRequired: true,
    insuranceMinCoverage: "Assurance maladie allemande obligatoire (publique type TK, AOK, ou privée équivalente)",
    languageRequirement: "B2 ou C1 en allemand (TestDaF, DSH, Goethe) pour un cursus en allemand ; IELTS 6.0 ou TOEFL 80 pour un cursus en anglais",
    admissionLetterRequired: true,
    guarantorRequired: false,
    criminalRecordRequired: false,
    medicalExamRequired: false,
    vaccinations: null,
    returnTicketRequired: false,
    whereToApply: "Ambassade ou consulat d'Allemagne compétent pour votre pays de résidence",
    appointmentUrl: "https://service2.diplo.de",
    biometricsRequired: true,
    interviewRequired: true,
    applicationSteps: [
      "Obtenir la lettre d'admission (Zulassungsbescheid) d'une université allemande",
      "Ouvrir un compte bloqué et y verser le montant exigé",
      "Souscrire une assurance maladie reconnue en Allemagne",
      "Remplir le formulaire VIDEX et prendre rendez-vous à l'ambassade",
      "Déposer le dossier, payer les frais et donner ses empreintes",
      "Passer l'entretien consulaire",
      "Après l'arrivée, faire l'Anmeldung en mairie et demander le titre de séjour",
    ],
    commonRefusalReasons: [
      "Compte bloqué non alimenté au montant exigé",
      "Niveau de langue insuffisant pour le cursus visé",
      "Admission conditionnelle jugée insuffisante",
      "Projet d'études incohérent lors de l'entretien",
      "Assurance maladie non conforme aux exigences allemandes",
    ],
    notes:
      "Le montant du compte bloqué est réévalué chaque année par les autorités allemandes : le vérifier avant publication. Le délai d'obtention d'un rendez-vous à l'ambassade est souvent le vrai goulot d'étranglement — lancer la démarche dès l'admission.",
    officialSourceUrl: "https://www.auswaertiges-amt.de/en/visa-service",
  },

  Netherlands: {
    visaRequired: true,
    processingTime: "2 à 4 semaines après dépôt par l'établissement (délai légal maximum de 90 jours)",
    cost: 228,
    currency: "EUR",
    visaValidity: "Visa MVV valable 90 jours, suivi du titre de séjour étudiant",
    entriesType: "Entrées multiples",
    maxStay: "Durée des études, plus 3 mois",
    documentsRequired: [
      "Passeport en cours de validité",
      "Lettre d'admission de l'établissement",
      "Preuve de paiement des frais de scolarité",
      "Preuve de ressources pour l'année",
      "Acte de naissance légalisé",
      "Déclaration d'antécédents (antecedentenverklaring)",
      "Résultat du test de tuberculose si votre nationalité l'exige",
      "Photos d'identité aux normes",
    ],
    passportValidity: "Valide pendant toute la durée du séjour demandé",
    photoSpec: "35 × 45 mm, fond clair, moins de 6 mois",
    applicationFormUrl: "https://ind.nl",
    fundsAmount: "Environ 1 200 € par mois, montant fixé chaque année par l'IND",
    proofOfFunds: "Relevé bancaire à votre nom, virement des fonds sur le compte de l'établissement, ou attestation de bourse",
    accommodationProof: "Logement souvent réservé par l'établissement ; attestation à présenter à l'arrivée",
    insuranceRequired: true,
    insuranceMinCoverage: "Assurance santé néerlandaise à souscrire dès l'arrivée",
    languageRequirement: "IELTS 6.0 à 6.5 ou TOEFL 80 à 90 pour un cursus en anglais ; examen NT2 pour un cursus en néerlandais",
    admissionLetterRequired: true,
    guarantorRequired: false,
    criminalRecordRequired: false,
    medicalExamRequired: true,
    vaccinations: null,
    returnTicketRequired: false,
    whereToApply: "L'établissement néerlandais dépose la demande auprès de l'IND ; le visa MVV se retire ensuite à l'ambassade des Pays-Bas",
    appointmentUrl: "https://ind.nl/en/residence-permits/study",
    biometricsRequired: true,
    interviewRequired: false,
    applicationSteps: [
      "Être admis dans un établissement reconnu « sponsor » par l'IND",
      "Transmettre les pièces à l'établissement, qui dépose la demande TEV auprès de l'IND",
      "Payer les frais et justifier des ressources exigées",
      "Passer le test de tuberculose si votre nationalité l'exige",
      "Retirer le visa MVV à l'ambassade des Pays-Bas après accord de l'IND",
      "Retirer le titre de séjour auprès de l'IND après l'arrivée",
    ],
    commonRefusalReasons: [
      "Ressources insuffisantes ou fonds non détenus à votre nom",
      "Frais de scolarité non réglés dans les délais",
      "Établissement non reconnu par l'IND",
      "Dossier transmis incomplet à l'établissement",
    ],
    notes:
      "Aux Pays-Bas, c'est l'établissement qui dépose la demande : tout commence par l'admission, et le calendrier dépend de son service international. Le montant mensuel exigé et les frais IND sont revus chaque année.",
    officialSourceUrl: "https://ind.nl/en/residence-permits/study",
  },

  Italy: {
    visaRequired: true,
    processingTime: "3 à 6 semaines après le dépôt",
    cost: 50,
    currency: "EUR",
    visaValidity: "Visa D valable 1 an ; permis de séjour à demander dans les 8 jours suivant l'arrivée",
    entriesType: "Entrées multiples",
    maxStay: "Durée des études, par renouvellement du permesso di soggiorno",
    documentsRequired: [
      "Passeport en cours de validité",
      "Formulaire de demande de visa national",
      "Préinscription validée sur le portail Universitaly",
      "Lettre d'admission de l'université",
      "Preuve de ressources pour l'année",
      "Justificatif de logement en Italie",
      "Attestation d'assurance maladie",
      "Diplômes traduits et légalisés (Dichiarazione di Valore ou attestation CIMEA)",
      "Photos d'identité aux normes",
    ],
    passportValidity: "Valide au moins 3 mois après la fin du séjour prévu",
    photoSpec: "35 × 45 mm, fond clair, moins de 6 mois",
    applicationFormUrl: "https://vistoperitalia.esteri.it",
    fundsAmount: "Environ 6 300 € pour l'année universitaire",
    proofOfFunds: "Relevés bancaires, attestation de bourse, ou attestation de prise en charge d'un garant",
    accommodationProof: "Contrat de bail, place en résidence universitaire ou attestation d'hébergement",
    insuranceRequired: true,
    insuranceMinCoverage: "Couverture des soins et de l'hospitalisation, minimum 30 000 €",
    languageRequirement: "B2 en italien pour un cursus en italien ; IELTS 6.0 ou TOEFL 80 pour un cursus en anglais",
    admissionLetterRequired: true,
    guarantorRequired: false,
    criminalRecordRequired: false,
    medicalExamRequired: false,
    vaccinations: null,
    returnTicketRequired: false,
    whereToApply: "Ambassade ou consulat d'Italie compétent, souvent via un centre VFS Global",
    appointmentUrl: "https://vistoperitalia.esteri.it",
    biometricsRequired: true,
    interviewRequired: false,
    applicationSteps: [
      "Se préinscrire sur le portail Universitaly",
      "Obtenir la lettre d'admission de l'université",
      "Faire traduire et légaliser les diplômes (Dichiarazione di Valore ou CIMEA)",
      "Remplir la demande sur Visto per Italia et prendre rendez-vous au consulat",
      "Déposer le dossier et donner ses empreintes",
      "Après l'arrivée, demander le permesso di soggiorno dans les 8 jours",
    ],
    commonRefusalReasons: [
      "Préinscription Universitaly absente ou non validée",
      "Reconnaissance des diplômes incomplète",
      "Ressources financières insuffisantes",
      "Justificatif de logement manquant",
    ],
    notes:
      "La préinscription sur Universitaly est obligatoire avant la demande de visa. La reconnaissance des diplômes (Dichiarazione di Valore ou CIMEA) prend plusieurs semaines : l'engager dès l'admission.",
    officialSourceUrl: "https://vistoperitalia.esteri.it",
  },

  Spain: {
    visaRequired: true,
    processingTime: "1 à 3 mois",
    cost: 80,
    currency: "EUR",
    visaValidity: "Visa valable 90 jours pour un séjour de plus de 6 mois ; carte TIE à demander dans le mois suivant l'arrivée",
    entriesType: "Entrées multiples",
    maxStay: "Durée des études, par renouvellement de la carte de séjour",
    documentsRequired: [
      "Passeport en cours de validité",
      "Formulaire national de demande de visa",
      "Lettre d'admission d'un établissement agréé",
      "Preuve de ressources pour toute la durée du séjour",
      "Assurance maladie sans franchise ni délai de carence",
      "Certificat médical",
      "Extrait de casier judiciaire légalisé (séjour de plus de 6 mois)",
      "Justificatif de logement",
      "Photos d'identité aux normes",
    ],
    passportValidity: "Valide au moins 12 mois, avec 2 pages vierges",
    photoSpec: "32 × 26 mm, fond clair, de face, moins de 6 mois",
    applicationFormUrl: "https://www.exteriores.gob.es",
    fundsAmount: "100 % de l'IPREM par mois, soit environ 600 € par mois ou 7 200 € par an",
    proofOfFunds: "Relevés bancaires, attestation de bourse, ou attestation de prise en charge d'un garant avec ses revenus",
    accommodationProof: "Contrat de bail, résidence universitaire ou attestation d'hébergement",
    insuranceRequired: true,
    insuranceMinCoverage: "Assurance publique ou privée agréée en Espagne, sans franchise ni délai de carence",
    languageRequirement: "B2 en espagnol (DELE, SIELE) pour un cursus en espagnol ; IELTS ou TOEFL pour un cursus en anglais",
    admissionLetterRequired: true,
    guarantorRequired: false,
    criminalRecordRequired: true,
    medicalExamRequired: true,
    vaccinations: null,
    returnTicketRequired: false,
    whereToApply: "Consulat d'Espagne compétent pour votre pays de résidence, parfois via BLS International",
    appointmentUrl: "https://www.exteriores.gob.es",
    biometricsRequired: true,
    interviewRequired: false,
    applicationSteps: [
      "Obtenir la lettre d'admission d'un établissement agréé",
      "Faire établir le certificat médical et le casier judiciaire, puis les faire légaliser",
      "Souscrire une assurance conforme aux exigences espagnoles",
      "Prendre rendez-vous au consulat et déposer la demande",
      "Donner ses empreintes et retirer le visa",
      "Après l'arrivée, demander la carte TIE dans le mois",
    ],
    commonRefusalReasons: [
      "Assurance comportant une franchise ou un délai de carence",
      "Ressources inférieures au seuil IPREM",
      "Casier judiciaire ou certificat médical non conforme",
      "Documents non traduits par un traducteur assermenté",
    ],
    notes:
      "Le montant exigé est indexé sur l'IPREM et réévalué chaque année. L'assurance est un motif de refus classique : elle doit être sans franchise ni délai de carence, ce qui exclut la plupart des assurances voyage standard.",
    officialSourceUrl: "https://www.exteriores.gob.es",
  },

  Portugal: {
    visaRequired: true,
    processingTime: "Environ 60 jours",
    cost: 90,
    currency: "EUR",
    visaValidity: "Visa D valable 4 mois, puis titre de séjour délivré par l'AIMA",
    entriesType: "Entrées multiples",
    maxStay: "Durée des études, par renouvellement du titre de séjour",
    documentsRequired: [
      "Passeport en cours de validité",
      "Formulaire de demande de visa national",
      "Lettre d'admission de l'établissement",
      "Preuve de ressources pour la durée du séjour",
      "Justificatif de logement au Portugal",
      "Assurance santé et rapatriement",
      "Extrait de casier judiciaire",
      "Autorisation de consultation du casier judiciaire portugais",
      "Photos d'identité aux normes",
    ],
    passportValidity: "Valide au moins 3 mois après la fin du séjour prévu",
    photoSpec: "35 × 45 mm, fond clair, moins de 6 mois",
    applicationFormUrl: "https://vistos.mne.gov.pt",
    fundsAmount: "Environ 820 € par mois, montant indexé sur le salaire minimum portugais",
    proofOfFunds: "Relevés bancaires, attestation de bourse, ou attestation de prise en charge",
    accommodationProof: "Contrat de bail, résidence universitaire ou attestation d'hébergement",
    insuranceRequired: true,
    insuranceMinCoverage: "Couverture des soins de santé et du rapatriement",
    languageRequirement: "B2 en portugais pour un cursus en portugais ; IELTS ou TOEFL pour un cursus en anglais",
    admissionLetterRequired: true,
    guarantorRequired: false,
    criminalRecordRequired: true,
    medicalExamRequired: false,
    vaccinations: null,
    returnTicketRequired: false,
    whereToApply: "Consulat du Portugal ou centre VFS Global compétent pour votre pays",
    appointmentUrl: "https://vistos.mne.gov.pt",
    biometricsRequired: true,
    interviewRequired: false,
    applicationSteps: [
      "Obtenir la lettre d'admission de l'établissement portugais",
      "Réunir les preuves de ressources et de logement",
      "Demander l'extrait de casier judiciaire et le faire légaliser",
      "Prendre rendez-vous au consulat et déposer la demande",
      "Donner ses empreintes et retirer le visa",
      "Après l'arrivée, se présenter à l'AIMA pour le titre de séjour",
    ],
    commonRefusalReasons: [
      "Ressources insuffisantes au regard du salaire minimum portugais",
      "Justificatif de logement absent",
      "Casier judiciaire non légalisé",
      "Assurance ne couvrant pas le rapatriement",
    ],
    notes:
      "Le montant exigé suit le salaire minimum portugais, révisé chaque année. Les délais de rendez-vous à l'AIMA après l'arrivée peuvent être longs : anticiper le renouvellement.",
    officialSourceUrl: "https://vistos.mne.gov.pt",
  },

  Luxembourg: {
    visaRequired: true,
    processingTime: "Environ 3 mois pour l'autorisation de séjour, puis 2 à 4 semaines pour le visa",
    cost: 50,
    currency: "EUR",
    visaValidity: "Visa D valable 90 jours, puis titre de séjour étudiant",
    entriesType: "Entrées multiples",
    maxStay: "Durée des études, par renouvellement du titre de séjour",
    documentsRequired: [
      "Passeport en cours de validité",
      "Demande d'autorisation de séjour temporaire adressée à la Direction de l'immigration",
      "Lettre d'admission de l'établissement luxembourgeois",
      "Preuve de ressources pour l'année",
      "Extrait de casier judiciaire",
      "Copie intégrale de l'acte de naissance",
      "Diplômes et relevés de notes",
      "Photos d'identité aux normes",
    ],
    passportValidity: "Valide au moins 3 mois après la fin du séjour prévu",
    photoSpec: "35 × 45 mm, fond clair, moins de 6 mois",
    applicationFormUrl: "https://guichet.public.lu",
    fundsAmount: "Environ 900 € par mois, montant lié au revenu social minimum luxembourgeois",
    proofOfFunds: "Relevés bancaires, attestation de bourse, ou attestation de prise en charge d'un garant",
    accommodationProof: "Contrat de bail ou attestation de logement étudiant",
    insuranceRequired: true,
    insuranceMinCoverage: "Couverture des soins de santé pour toute la durée du séjour",
    languageRequirement: "B2 en français, allemand ou anglais selon le programme",
    admissionLetterRequired: true,
    guarantorRequired: false,
    criminalRecordRequired: true,
    medicalExamRequired: false,
    vaccinations: null,
    returnTicketRequired: false,
    whereToApply: "Direction de l'immigration du Luxembourg pour l'autorisation de séjour, puis ambassade de Belgique ou du Luxembourg pour le visa",
    appointmentUrl: "https://guichet.public.lu",
    biometricsRequired: true,
    interviewRequired: false,
    applicationSteps: [
      "Obtenir la lettre d'admission d'un établissement luxembourgeois",
      "Envoyer la demande d'autorisation de séjour temporaire à la Direction de l'immigration",
      "Attendre l'accord de principe de la Direction de l'immigration",
      "Demander le visa D auprès de l'ambassade compétente",
      "Après l'arrivée, faire la déclaration d'arrivée à la commune et demander le titre de séjour",
    ],
    commonRefusalReasons: [
      "Demande de visa déposée sans autorisation de séjour préalable",
      "Ressources insuffisantes",
      "Acte de naissance ou casier judiciaire non légalisé",
      "Admission dans un établissement non reconnu",
    ],
    notes:
      "Particularité importante : au Luxembourg, l'autorisation de séjour temporaire se demande AVANT le visa, par courrier auprès de la Direction de l'immigration. Le Luxembourg n'ayant pas d'ambassade dans la plupart des pays d'Afrique, le visa est fréquemment délivré par l'ambassade de Belgique.",
    officialSourceUrl: "https://guichet.public.lu",
  },

  Switzerland: {
    visaRequired: true,
    processingTime: "8 à 12 semaines — la décision revient au canton de l'établissement",
    cost: null,
    currency: "CHF",
    visaValidity: "Visa D valable 90 jours, puis permis de séjour B délivré par le canton",
    entriesType: "Entrées multiples",
    maxStay: "Durée des études, par renouvellement du permis cantonal",
    documentsRequired: [
      "Passeport en cours de validité",
      "Formulaires de demande de visa long séjour en plusieurs exemplaires",
      "Lettre d'admission de l'établissement suisse",
      "Preuve de ressources pour toute la durée des études",
      "CV et lettre de motivation détaillant le projet d'études",
      "Engagement écrit de quitter la Suisse à la fin des études",
      "Diplômes et relevés de notes",
      "Photos d'identité aux normes",
    ],
    passportValidity: "Valide au moins 3 mois après la fin du séjour prévu",
    photoSpec: "35 × 45 mm, fond clair, moins de 6 mois",
    applicationFormUrl: "https://www.sem.admin.ch",
    fundsAmount: "Environ 21 000 CHF par an, montant fixé par le canton d'accueil",
    proofOfFunds: "Relevés bancaires, attestation de bourse, ou attestation de prise en charge d'un garant résidant en Suisse",
    accommodationProof: "Contrat de bail, logement étudiant ou attestation d'hébergement",
    insuranceRequired: true,
    insuranceMinCoverage: "Assurance maladie suisse obligatoire dans les 3 mois suivant l'arrivée",
    languageRequirement: "B2 en français, allemand ou italien selon le canton ; IELTS ou TOEFL pour un cursus en anglais",
    admissionLetterRequired: true,
    guarantorRequired: false,
    criminalRecordRequired: false,
    medicalExamRequired: false,
    vaccinations: null,
    returnTicketRequired: false,
    whereToApply: "Ambassade ou consulat de Suisse compétent ; le dossier est transmis au canton de l'établissement, qui décide",
    appointmentUrl: "https://www.sem.admin.ch",
    biometricsRequired: true,
    interviewRequired: true,
    applicationSteps: [
      "Obtenir la lettre d'admission d'un établissement suisse",
      "Réunir les preuves de ressources et rédiger la lettre de motivation",
      "Signer l'engagement de quitter la Suisse à la fin des études",
      "Déposer le dossier à l'ambassade de Suisse",
      "Attendre la décision du canton, transmise à l'ambassade",
      "Retirer le visa, puis demander le permis de séjour auprès du canton après l'arrivée",
    ],
    commonRefusalReasons: [
      "Projet d'études jugé peu crédible ou lettre de motivation faible",
      "Ressources financières insuffisantes",
      "Doute sur l'intention de quitter la Suisse à la fin des études",
      "Admission dans un établissement non reconnu par le canton",
    ],
    notes:
      "La décision est cantonale : délais, montants exigés et pièces demandées varient d'un canton à l'autre. La lettre de motivation et l'engagement de départ pèsent lourd dans la décision. Les frais de visa n'ont pas été renseignés ici — les relever auprès de l'ambassade compétente.",
    officialSourceUrl: "https://www.sem.admin.ch",
  },

  Sweden: {
    visaRequired: true,
    processingTime: "1 à 3 mois",
    cost: 1500,
    currency: "SEK",
    visaValidity: "Titre de séjour pour études délivré pour la durée du programme, renouvelable chaque année",
    entriesType: "Entrées multiples",
    maxStay: "Durée du programme d'études",
    documentsRequired: [
      "Passeport en cours de validité",
      "Lettre d'admission d'une université suédoise",
      "Preuve de paiement des frais de scolarité de la première année",
      "Preuve de ressources pour toute la durée des études",
      "Attestation d'assurance maladie si les études durent moins d'un an",
      "Photos d'identité aux normes",
    ],
    passportValidity: "Valide pendant toute la durée du séjour demandé",
    photoSpec: "35 × 45 mm, fond clair, moins de 6 mois",
    applicationFormUrl: "https://www.migrationsverket.se",
    fundsAmount: "Environ 10 300 SEK par mois, pendant 10 mois par année d'études",
    proofOfFunds: "Relevé bancaire à votre nom, attestation de bourse, ou preuve de revenus réguliers",
    accommodationProof: "Attestation de logement étudiant ou contrat de bail",
    insuranceRequired: true,
    insuranceMinCoverage: "Assurance obligatoire si les études durent moins d'un an ; au-delà, inscription au registre suédois de la population",
    languageRequirement: "IELTS 6.5 ou TOEFL 90 pour un cursus en anglais",
    admissionLetterRequired: true,
    guarantorRequired: false,
    criminalRecordRequired: false,
    medicalExamRequired: false,
    vaccinations: null,
    returnTicketRequired: false,
    whereToApply: "Demande en ligne auprès de Migrationsverket, puis biométrie à l'ambassade de Suède compétente pour votre pays",
    appointmentUrl: "https://www.migrationsverket.se",
    biometricsRequired: true,
    interviewRequired: false,
    applicationSteps: [
      "Être admis dans une université suédoise et régler les frais de la première année",
      "Créer un compte et déposer la demande en ligne sur Migrationsverket",
      "Payer les frais de dossier",
      "Se rendre à l'ambassade de Suède pour la biométrie",
      "Retirer la carte de séjour après décision",
    ],
    commonRefusalReasons: [
      "Frais de scolarité de la première année non réglés",
      "Ressources insuffisantes pour toute la durée des études",
      "Fonds non détenus au nom du demandeur",
    ],
    notes:
      "La Suède exige la preuve des ressources pour TOUTE la durée du programme, pas seulement la première année : c'est le point qui bloque le plus souvent. Le montant mensuel et les frais de dossier sont revus chaque année par Migrationsverket.",
    officialSourceUrl: "https://www.migrationsverket.se",
  },

  "United Kingdom": {
    visaRequired: true,
    processingTime: "Environ 3 semaines (service prioritaire payant possible)",
    cost: 490,
    currency: "GBP",
    visaValidity: "Durée du cursus, plus 4 mois",
    entriesType: "Entrées multiples",
    maxStay: "Durée du cursus",
    documentsRequired: [
      "Passeport en cours de validité",
      "CAS (Confirmation of Acceptance for Studies) délivré par l'établissement",
      "Preuve de ressources détenues 28 jours consécutifs",
      "Certificat de langue SELT (IELTS for UKVI)",
      "Résultat du test de tuberculose",
      "Diplômes et relevés de notes mentionnés sur le CAS",
      "Consentement parental et acte de naissance si vous êtes mineur",
    ],
    passportValidity: "Valide pendant toute la durée du séjour demandé, avec une page vierge",
    photoSpec: "Photo numérique prise au centre de demande",
    applicationFormUrl: "https://www.gov.uk/student-visa",
    fundsAmount: "Frais de scolarité de la première année, plus 1 483 £ par mois à Londres ou 1 136 £ hors Londres, pendant 9 mois",
    proofOfFunds: "Fonds détenus 28 jours consécutifs sur un compte à votre nom, à celui de vos parents (avec acte de naissance) ou d'un sponsor officiel",
    accommodationProof: "Non exigé pour la demande, mais utile à l'arrivée",
    insuranceRequired: true,
    insuranceMinCoverage: "Immigration Health Surcharge (IHS) à payer lors de la demande, donnant accès au NHS",
    languageRequirement: "IELTS for UKVI, niveau B2 minimum (généralement 6.0 avec 5.5 par section)",
    admissionLetterRequired: true,
    guarantorRequired: false,
    criminalRecordRequired: false,
    medicalExamRequired: true,
    vaccinations: null,
    returnTicketRequired: false,
    whereToApply: "Centre de demande de visa TLScontact ou VFS Global de votre pays",
    appointmentUrl: "https://www.gov.uk/student-visa",
    biometricsRequired: true,
    interviewRequired: true,
    applicationSteps: [
      "Obtenir une offre puis le CAS de l'établissement britannique",
      "Constituer et immobiliser les fonds pendant 28 jours consécutifs",
      "Passer le test de tuberculose dans un centre agréé",
      "Remplir la demande en ligne sur gov.uk et payer les frais ainsi que l'IHS",
      "Prendre rendez-vous au centre TLScontact ou VFS Global pour la biométrie",
      "Passer l'entretien de crédibilité si vous y êtes convoqué",
      "Retirer le passeport et récupérer le titre de séjour après l'arrivée",
    ],
    commonRefusalReasons: [
      "Fonds non détenus 28 jours consécutifs ou relevé daté de plus de 31 jours",
      "Relevé bancaire ne mentionnant pas le solde le plus bas de la période",
      "Entretien de crédibilité peu convaincant sur le projet d'études",
      "Test de tuberculose manquant",
      "CAS retiré ou expiré au moment du dépôt",
    ],
    notes:
      "La règle des 28 jours consécutifs est le premier motif de refus : le relevé doit couvrir 28 jours pleins, dater de moins de 31 jours au dépôt et ne jamais descendre sous le montant exigé. Le test de tuberculose est obligatoire pour la plupart des pays d'Afrique. Frais de visa et surtaxe santé (IHS) sont réévalués régulièrement.",
    officialSourceUrl: "https://www.gov.uk/student-visa",
  },

  "United States": {
    visaRequired: true,
    processingTime: "Variable — le délai d'obtention d'un rendez-vous consulaire peut dépasser plusieurs mois selon le poste",
    cost: 185,
    currency: "USD",
    visaValidity: "Visa F-1 délivré pour la durée du programme (statut « D/S », duration of status)",
    entriesType: "Entrées multiples",
    maxStay: "Durée du programme, plus 60 jours",
    documentsRequired: [
      "Passeport en cours de validité",
      "Formulaire I-20 délivré par l'établissement certifié SEVP",
      "Page de confirmation du formulaire DS-160",
      "Reçu de paiement des frais SEVIS I-901",
      "Reçu de paiement des frais de dossier consulaire (MRV)",
      "Photo aux normes américaines",
      "Preuve de ressources couvrant le montant indiqué sur le I-20",
      "Preuve de liens durables avec le pays d'origine",
      "Diplômes, relevés de notes et résultats TOEFL, IELTS, SAT, GRE ou GMAT",
    ],
    passportValidity: "Valide au moins 6 mois au-delà de la période de séjour prévue",
    photoSpec: "5 × 5 cm (2 × 2 pouces), fond blanc, de face, moins de 6 mois",
    applicationFormUrl: "https://ceac.state.gov/genniv/",
    fundsAmount: "Montant total figurant sur le formulaire I-20 : frais de scolarité et frais de subsistance de la première année",
    proofOfFunds: "Relevés bancaires, attestation de bourse, ou affidavit of support d'un garant accompagné de ses justificatifs de revenus",
    accommodationProof: "Non exigé pour l'entretien, mais utile à présenter",
    insuranceRequired: true,
    insuranceMinCoverage: "Assurance santé exigée par la plupart des établissements, souvent incluse dans les frais universitaires",
    languageRequirement: "TOEFL 80 ou IELTS 6.5 en général — le seuil exact est fixé par l'établissement",
    admissionLetterRequired: true,
    guarantorRequired: false,
    criminalRecordRequired: false,
    medicalExamRequired: false,
    vaccinations: "Vaccinations exigées par l'établissement à l'inscription (rougeole, méningite selon les campus)",
    returnTicketRequired: false,
    whereToApply: "Ambassade ou consulat des États-Unis de votre pays — l'entretien consulaire est obligatoire",
    appointmentUrl: "https://ceac.state.gov/genniv/",
    biometricsRequired: true,
    interviewRequired: true,
    applicationSteps: [
      "Être admis dans un établissement certifié SEVP et recevoir le formulaire I-20",
      "Payer les frais SEVIS I-901 et conserver le reçu",
      "Remplir le formulaire DS-160 en ligne et imprimer la page de confirmation",
      "Payer les frais de dossier consulaire (MRV)",
      "Prendre rendez-vous pour l'entretien consulaire",
      "Se présenter à l'entretien avec l'ensemble du dossier",
      "Récupérer le passeport avec le visa et se présenter au bureau des étudiants internationaux à l'arrivée",
    ],
    commonRefusalReasons: [
      "Article 214(b) : liens jugés insuffisants avec le pays d'origine, doute sur le retour",
      "Ressources financières non prouvées ou origine des fonds inexpliquée",
      "Incohérence entre le projet d'études et le parcours antérieur",
      "Réponses imprécises ou contradictoires lors de l'entretien",
      "Établissement choisi jugé peu crédible au regard du profil",
    ],
    notes:
      "Le motif de refus le plus fréquent est l'article 214(b) : il faut démontrer des attaches fortes avec le pays d'origine (famille, biens, engagement professionnel) et une intention claire de rentrer. Préparer l'entretien est aussi important que le dossier. Les frais MRV et SEVIS sont réévalués régulièrement.",
    officialSourceUrl: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
  },

  Canada: {
    visaRequired: true,
    processingTime: "Variable selon le pays, souvent 8 à 16 semaines",
    cost: 150,
    currency: "CAD",
    visaValidity: "Permis d'études délivré pour la durée du programme, plus 90 jours",
    entriesType: "Entrées multiples",
    maxStay: "Durée du programme, plus 90 jours",
    documentsRequired: [
      "Passeport en cours de validité",
      "Lettre d'acceptation d'un établissement d'enseignement désigné (EED)",
      "Attestation provinciale d'attestation (PAL) ou territoriale",
      "Certificat d'acceptation du Québec (CAQ) pour des études au Québec",
      "Preuve de ressources pour la première année",
      "Lettre d'explication (statement of purpose)",
      "Résultats de la visite médicale auprès d'un médecin désigné",
      "Résultats du test de langue",
      "Photos d'identité aux normes",
    ],
    passportValidity: "Valide au moins pendant toute la durée du séjour demandé",
    photoSpec: "35 × 45 mm, fond clair, moins de 6 mois",
    applicationFormUrl: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes.html",
    fundsAmount: "Frais de scolarité de la première année, plus environ 20 600 CAD de frais de subsistance pour un étudiant seul (montant relevé chaque 1er janvier)",
    proofOfFunds: "Relevés bancaires des 4 derniers mois, certificat de placement garanti (CPG), preuve de bourse ou de prêt étudiant approuvé",
    accommodationProof: "Non exigé pour la demande, mais utile à présenter",
    insuranceRequired: true,
    insuranceMinCoverage: "Couverture santé exigée par la province d'accueil, souvent via un régime universitaire obligatoire",
    languageRequirement: "IELTS 6.0 en général pour un cursus en anglais, TEF ou TCF pour un cursus en français — seuil fixé par l'établissement",
    admissionLetterRequired: true,
    guarantorRequired: false,
    criminalRecordRequired: false,
    medicalExamRequired: true,
    vaccinations: null,
    returnTicketRequired: false,
    whereToApply: "Demande en ligne sur le portail IRCC, puis biométrie dans un centre de réception des demandes de visa (CRDV)",
    appointmentUrl: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes.html",
    biometricsRequired: true,
    interviewRequired: false,
    applicationSteps: [
      "Être admis dans un établissement d'enseignement désigné et obtenir la lettre d'acceptation",
      "Obtenir l'attestation provinciale (PAL), et le CAQ pour le Québec",
      "Réunir les preuves de ressources et rédiger la lettre d'explication",
      "Passer la visite médicale auprès d'un médecin désigné",
      "Déposer la demande en ligne sur le portail IRCC et payer les frais",
      "Donner ses empreintes dans un centre de réception des demandes",
      "Recevoir la lettre d'introduction et présenter le dossier à l'arrivée pour obtenir le permis",
    ],
    commonRefusalReasons: [
      "Ressources financières jugées insuffisantes ou mal documentées",
      "Lettre d'explication peu convaincante sur le choix du programme",
      "Doute sur l'intention de quitter le Canada à la fin des études",
      "Attestation provinciale (PAL) ou CAQ manquant",
      "Parcours antérieur sans lien avec le programme demandé",
    ],
    notes:
      "Depuis 2024, une attestation provinciale (PAL) est exigée en plus de la lettre d'acceptation ; pour le Québec, le CAQ doit être obtenu avant la demande fédérale. Le montant de subsistance exigé est relevé chaque 1er janvier. La lettre d'explication pèse lourd : elle doit relier le programme choisi au parcours et au projet de retour.",
    officialSourceUrl: "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes.html",
  },

  China: {
    visaRequired: true,
    processingTime: "4 à 10 jours ouvrés après dépôt — mais l'obtention du formulaire JW prend plusieurs semaines",
    cost: null,
    currency: "CNY",
    visaValidity: "Visa X1 pour un séjour de plus de 180 jours, à convertir en titre de séjour dans les 30 jours suivant l'arrivée ; visa X2 pour un séjour plus court",
    entriesType: "Entrée simple",
    maxStay: "Durée des études via le titre de séjour",
    documentsRequired: [
      "Passeport en cours de validité",
      "Formulaire de demande COVA imprimé et signé",
      "Lettre d'admission de l'université chinoise",
      "Formulaire JW201 (bourse publique) ou JW202 (autofinancement)",
      "Certificat médical sur le formulaire officiel « Foreigner Physical Examination Form » pour un séjour de plus de 6 mois",
      "Preuve de ressources ou attestation de bourse",
      "Photo aux normes chinoises",
    ],
    passportValidity: "Valide au moins 6 mois, avec 2 pages vierges",
    photoSpec: "33 × 48 mm, fond blanc, de face, moins de 6 mois",
    applicationFormUrl: "https://cova.mfa.gov.cn",
    fundsAmount: null,
    proofOfFunds: "Attestation de bourse (China Scholarship Council, Institut Confucius) ou preuve de prise en charge des frais de scolarité et de séjour",
    accommodationProof: "Logement en résidence universitaire généralement attribué par l'établissement",
    insuranceRequired: true,
    insuranceMinCoverage: "Assurance santé chinoise obligatoire, souvent souscrite à l'inscription à l'université",
    languageRequirement: "HSK 4 à 5 pour un cursus en chinois ; IELTS ou TOEFL pour un cursus en anglais",
    admissionLetterRequired: true,
    guarantorRequired: false,
    criminalRecordRequired: false,
    medicalExamRequired: true,
    vaccinations: null,
    returnTicketRequired: false,
    whereToApply: "Ambassade ou consulat de Chine, généralement via un Chinese Visa Application Service Center (CVASC)",
    appointmentUrl: "https://bio.visaforchina.cn",
    biometricsRequired: true,
    interviewRequired: false,
    applicationSteps: [
      "Être admis dans une université chinoise et recevoir la lettre d'admission",
      "Obtenir de l'université le formulaire JW201 ou JW202",
      "Passer la visite médicale sur le formulaire officiel pour un séjour de plus de 6 mois",
      "Remplir le formulaire COVA en ligne et prendre rendez-vous au centre de visa",
      "Déposer le dossier et donner ses empreintes",
      "Après l'arrivée, demander le titre de séjour dans les 30 jours",
    ],
    commonRefusalReasons: [
      "Formulaire JW201 ou JW202 absent",
      "Certificat médical non établi sur le formulaire officiel",
      "Lettre d'admission d'un établissement non habilité à accueillir des étudiants étrangers",
      "Incohérence entre la durée du programme et le type de visa demandé",
    ],
    notes:
      "Le formulaire JW201 ou JW202 est délivré par l'université chinoise : sans lui, la demande n'est pas recevable. Le certificat médical doit impérativement être rempli sur le formulaire officiel chinois. Les frais de visa varient selon la nationalité — les relever auprès du centre de visa compétent.",
    officialSourceUrl: "https://www.visaforchina.cn",
  },
};

/**
 * Ajustements dépendant du pays d'origine. Aujourd'hui, seule la France en a :
 * la procédure « Études en France » de Campus France n'est obligatoire que dans
 * les pays à procédure CEF.
 */
function applyOriginOverrides(destination: string, origin: string, fiche: Fiche): Fiche {
  if (destination !== "France" || CAMPUS_FRANCE_CEF.has(origin)) return fiche;

  return {
    ...fiche,
    documentsRequired: fiche.documentsRequired.filter(
      d => !d.startsWith("Attestation Campus France")
    ),
    whereToApply: "Consulat de France, ou centre VFS Global / TLScontact de votre pays",
    interviewRequired: false,
    applicationSteps: [
      "Obtenir l'attestation d'admission ou de pré-inscription de l'établissement français",
      "Créer sa demande sur France-Visas et payer les frais de dossier",
      "Prendre rendez-vous chez VFS Global ou TLScontact",
      "Déposer le dossier complet et donner ses empreintes",
      "Récupérer le passeport, puis valider le VLS-TS en ligne dans les 3 mois suivant l'arrivée",
    ],
    commonRefusalReasons: fiche.commonRefusalReasons.filter(
      r => !r.startsWith("Entretien Campus France")
    ),
    notes:
      "La procédure « Études en France » de Campus France ne s'applique pas à ce pays : la demande se dépose directement auprès du consulat. La visite médicale OFII est organisée après l'arrivée. Le montant mensuel exigé et les frais de dossier sont révisés régulièrement : les confirmer sur france-visas.gouv.fr avant de publier cette fiche.",
  };
}

async function main() {
  // Une fiche ne peut viser qu'une destination validée : c'est aussi ce que contrôle l'API.
  const validatedStudyCountries = new Set(
    (await prisma.studyCountry.findMany({ where: { isValidated: true }, select: { name: true } }))
      .map(c => c.name)
  );
  // L'ambassade n'est volontairement PAS rattachée : les enregistrements actuels sont
  // situés dans leur propre capitale (« Ambassade de France — Paris »), ce qui n'est
  // pas la représentation compétente pour un demandeur africain. Tant que le catalogue
  // Embassy ne contient pas les vraies représentations (France à Lomé, à Dakar…), le
  // champ « Où déposer » de la fiche est la seule indication fiable.

  let created = 0;
  let skipped = 0;
  const ignored: string[] = [];

  for (const [destination, base] of Object.entries(DESTINATIONS)) {
    if (!validatedStudyCountries.has(destination)) {
      ignored.push(destination);
      continue;
    }

    for (const origin of ORIGINS) {
      if (origin === destination) continue;

      const existing = await prisma.visa.findUnique({
        where: {
          originCountry_destinationCountry_visaType: {
            originCountry: origin,
            destinationCountry: destination,
            visaType: "Étudiant",
          },
        },
        select: { id: true },
      });
      if (existing) {
        skipped++;
        continue;
      }

      const fiche = applyOriginOverrides(destination, origin, base);
      await prisma.visa.create({
        data: {
          originCountry: origin,
          destinationCountry: destination,
          visaType: "Étudiant",
          embassyId: null,
          ...fiche,
          documentsRequired: fiche.documentsRequired,
          applicationSteps: fiche.applicationSteps,
          commonRefusalReasons: fiche.commonRefusalReasons,
          // Brouillon, sans date de vérification : les montants doivent être
          // confirmés sur la source officielle avant toute publication.
          isValidated: false,
          lastVerifiedAt: null,
        },
      });
      created++;
    }
  }

  console.log(`Fiches créées   : ${created}`);
  console.log(`Déjà présentes  : ${skipped}`);
  if (ignored.length) {
    console.log(`Destinations ignorées (pays d'étude non validé) : ${ignored.join(", ")}`);
  }
  console.log(`Total en base   : ${await prisma.visa.count()}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
