import { PrismaClient } from '@prisma/client';
import { studyCountriesSeed } from './data/country-availability';

const prisma = new PrismaClient();

/**
 * Catalogue bancaire étudiant (`banks` + `bank_account_types`).
 *
 * Périmètre : les **12 pays d'études** de `studyCountriesSeed`
 * (src/scripts/data/country-availability.ts) — le même vocabulaire anglais que
 * `University.country`, `Accommodation.country` et le filtre pays de l'écran public
 * `BankAccount`. Un compte bancaire local n'a de sens que là où l'étudiant s'installe.
 *
 * Ce qui est **vérifiable** et constitue la valeur de la fiche : le nom réel de la banque,
 * l'existence de son offre jeune/étudiante, et surtout les **conditions d'ouverture**
 * (`requirements`) — quels documents la banque réclame au guichet. Ce sont elles qui
 * bloquent l'étudiant à l'arrivée (Anmeldung en Allemagne, BSN aux Pays-Bas, NIE en
 * Espagne, codice fiscale en Italie, NIF au Portugal, personnummer en Suède, numéro de
 * téléphone local en Chine) et elles bougent peu d'une année sur l'autre.
 *
 * Ce qui est **indicatif** : `monthlyFee`, `minimumDeposit`, `withdrawalLimit`. Une
 * grille tarifaire change chaque année et dépend de l'âge, du campus et parfois de
 * l'agence ; les valeurs posées sont l'ordre de grandeur public au moment du seed, dans
 * la devise locale. Chaque description le rappelle pour que la réserve reste visible côté
 * site, et l'admin permet de corriger.
 *
 * `image` est laissé vide : un logo bancaire est une marque déposée et une photo générique
 * ne représenterait pas l'agence.
 *
 * Rejouable : déduplication sur (name, country) ; les comptes d'une banque sont remplacés
 * en bloc à chaque passage (un diff partiel créerait des doublons silencieux).
 * Les trois banques fictives du seed d'origine (« UK Student Bank », « Deutsche Student
 * Bank », « Banque Étudiante ») sont supprimées : ce sont des noms inventés.
 */

type Account = {
  name: string;
  monthlyFee: string;
  cardType: string;
  minimumDeposit: string;
  withdrawalLimit: string;
  onlineBanking?: boolean;
  /** Ce que le compte apporte au quotidien. */
  features: string[];
  /** Conditions d'ouverture : les pièces à présenter. */
  requirements: string[];
  studentPerks: string[];
};

type BankSeed = { name: string; description: string; accounts: Account[] };
type Block = { country: string; banks: BankSeed[] };

const INDICATIF = 'Tarifs et plafonds indicatifs, à confirmer auprès de la banque.';

const catalog: Block[] = [
  /* ─────────────────────────── ROYAUME-UNI ───────────────────────────────── */
  {
    country: 'United Kingdom',
    banks: [
      {
        name: 'HSBC UK',
        description:
          "Banque de réseau disposant d'une offre dédiée aux étudiants internationaux : le compte peut être demandé depuis l'étranger avant l'arrivée, ce qui évite l'impasse « pas de compte sans adresse, pas d'adresse sans compte ». " +
          INDICATIF,
        accounts: [
          {
            name: 'International Student Bank Account',
            monthlyFee: '£0',
            cardType: 'Visa Debit',
            minimumDeposit: '£0',
            withdrawalLimit: '£300/jour',
            features: [
              'Ouverture possible avant l\'arrivée au Royaume-Uni',
              'Application mobile et virements Faster Payments',
              'Sort code et numéro de compte britanniques (salaire, loyer, factures)',
              'Conseillers en agence sur tout le pays',
            ],
            requirements: [
              'Passeport en cours de validité',
              'Visa étudiant (BRP ou eVisa share code)',
              "Lettre d'admission ou CAS de l'université",
              "Justificatif d'adresse au Royaume-Uni ou attestation de résidence universitaire",
              'Rendez-vous en agence ou dossier en ligne selon le profil',
            ],
            studentPerks: [
              'Pas de frais de tenue de compte pendant les études',
              'Virements internationaux entre comptes HSBC du groupe',
            ],
          },
          {
            name: 'HSBC Student Bank Account',
            monthlyFee: '£0',
            cardType: 'Visa Debit',
            minimumDeposit: '£0',
            withdrawalLimit: '£500/jour',
            features: [
              'Découvert autorisé sans intérêt, plafond croissant selon l\'année d\'études',
              'Application mobile avec catégorisation des dépenses',
              'Compte épargne associé',
            ],
            requirements: [
              'Inscription confirmée dans un établissement britannique',
              'Passeport ou pièce d\'identité',
              "Justificatif d'adresse au Royaume-Uni",
              'Historique de crédit non exigé',
            ],
            studentPerks: [
              'Découvert 0 % pendant la durée du cursus',
              'Offres partenaires réservées aux étudiants',
            ],
          },
        ],
      },
      {
        name: 'Barclays',
        description:
          "Grand réseau britannique dont le compte étudiant est l'un des plus répandus sur les campus, avec une application mobile complète et un découvert progressif. " +
          INDICATIF,
        accounts: [
          {
            name: 'Student Additions Account',
            monthlyFee: '£0',
            cardType: 'Visa Debit',
            minimumDeposit: '£0',
            withdrawalLimit: '£300/jour',
            features: [
              'Découvert sans intérêt accordé selon le dossier',
              'Paiement sans contact et Apple Pay / Google Pay',
              'Ouverture de compte en agence ou depuis l\'application',
            ],
            requirements: [
              'Preuve d\'inscription à un cursus de deux ans minimum',
              'Passeport et visa étudiant pour les non-résidents',
              "Justificatif d'adresse au Royaume-Uni",
              'Âge minimum 18 ans',
            ],
            studentPerks: [
              'Découvert échelonné sur les années d\'études',
              'Outils de suivi de budget dans l\'application',
            ],
          },
        ],
      },
      {
        name: 'Santander UK',
        description:
          "Filiale britannique du groupe Santander, connue pour son compte étudiant assorti d'une carte de transport ferroviaire. Le réseau accepte les dossiers sans historique de crédit britannique. " +
          INDICATIF,
        accounts: [
          {
            name: 'Edge Student Current Account',
            monthlyFee: '£0',
            cardType: 'Mastercard Debit',
            minimumDeposit: '£0',
            withdrawalLimit: '£300/jour',
            features: [
              'Découvert sans intérêt selon l\'année d\'études',
              'Application mobile et virements instantanés',
              'Rémunération des soldes créditeurs dans certaines limites',
            ],
            requirements: [
              'Justificatif d\'inscription en cursus supérieur au Royaume-Uni',
              'Passeport et visa étudiant',
              "Justificatif d'adresse au Royaume-Uni",
            ],
            studentPerks: [
              'Railcard 16-25 offerte pendant plusieurs années (offre récurrente, à vérifier)',
              'Réductions transport et commerces partenaires',
            ],
          },
          {
            name: 'Basic Current Account',
            monthlyFee: '£0',
            cardType: 'Visa Debit',
            minimumDeposit: '£0',
            withdrawalLimit: '£300/jour',
            features: [
              'Compte de base accessible sans historique de crédit',
              'Pas de découvert, donc pas d\'agios',
              'Prélèvements et virements réguliers acceptés',
            ],
            requirements: [
              'Passeport',
              "Justificatif d'adresse au Royaume-Uni",
              'Refus ou impossibilité d\'obtenir un compte courant classique',
            ],
            studentPerks: [
              'Solution de repli les premières semaines après l\'arrivée',
            ],
          },
        ],
      },
      {
        name: 'Monzo',
        description:
          "Banque mobile britannique agréée : ouverture en quelques minutes depuis le téléphone, sans agence. Souvent utilisée comme premier compte en attendant un dossier bancaire classique. " +
          INDICATIF,
        accounts: [
          {
            name: 'Monzo Current Account',
            monthlyFee: '£0',
            cardType: 'Mastercard Debit',
            minimumDeposit: '£0',
            withdrawalLimit: '£400/jour',
            features: [
              'Ouverture 100 % mobile avec vérification vidéo',
              'Notifications de paiement en temps réel',
              'Enveloppes budgétaires (Pots) et partage de dépenses en colocation',
              'Sort code et numéro de compte britanniques',
            ],
            requirements: [
              'Passeport ou carte d\'identité UE en cours de validité',
              'Selfie vidéo de vérification d\'identité',
              'Adresse au Royaume-Uni (résidence universitaire acceptée)',
              'Numéro de téléphone britannique recommandé',
            ],
            studentPerks: [
              'Retraits gratuits à l\'étranger dans une limite mensuelle',
              'Aucun frais de tenue de compte',
            ],
          },
        ],
      },
    ],
  },

  /* ─────────────────────────── ÉTATS-UNIS ────────────────────────────────── */
  {
    country: 'United States',
    banks: [
      {
        name: 'Bank of America',
        description:
          "Réseau national présent dans la plupart des villes universitaires. Les comptes sans découvert évitent les frais d'incident, fréquents aux États-Unis. " +
          INDICATIF,
        accounts: [
          {
            name: 'Advantage SafeBalance Banking',
            monthlyFee: '$4.95 (souvent offert aux moins de 25 ans en études)',
            cardType: 'Visa Debit',
            minimumDeposit: '$25',
            withdrawalLimit: '$500/jour',
            features: [
              'Aucun découvert possible, donc pas de frais d\'incident',
              'Application mobile et Zelle pour les virements entre particuliers',
              'Réseau d\'automates étendu',
            ],
            requirements: [
              'Passeport en cours de validité',
              'Visa F-1 ou J-1 et formulaire I-20 ou DS-2019',
              'Numéro de sécurité sociale (SSN) ou ITIN, ou justificatif de demande en cours',
              'Adresse aux États-Unis',
              'Dépôt initial à l\'ouverture',
            ],
            studentPerks: [
              'Frais mensuels annulés pour les étudiants de moins de 25 ans',
              'Programme de remises chez des commerçants partenaires',
            ],
          },
        ],
      },
      {
        name: 'Chase',
        description:
          "Premier réseau bancaire du pays, avec des agences sur ou près de nombreux campus et un compte spécifiquement étudiant. " +
          INDICATIF,
        accounts: [
          {
            name: 'College Checking',
            monthlyFee: '$0 pendant les études (justificatif requis)',
            cardType: 'Visa Debit',
            minimumDeposit: '$0',
            withdrawalLimit: '$500/jour',
            features: [
              'Frais mensuels annulés jusqu\'à cinq ans sur présentation du justificatif d\'inscription',
              'Zelle, dépôt de chèques par photo, application mobile',
              'Compte épargne associé sans frais',
            ],
            requirements: [
              'Passeport et visa étudiant (F-1 / J-1)',
              'Formulaire I-20 ou DS-2019',
              'SSN ou ITIN',
              'Justificatif d\'inscription universitaire',
              'Adresse aux États-Unis',
            ],
            studentPerks: [
              'Aucun frais de tenue de compte pendant le cursus',
              'Prime de bienvenue à l\'ouverture selon les périodes',
            ],
          },
        ],
      },
      {
        name: 'Wells Fargo',
        description:
          "Réseau national avec un compte d'entrée de gamme sans découvert, adapté à un premier compte américain. " +
          INDICATIF,
        accounts: [
          {
            name: 'Clear Access Banking',
            monthlyFee: '$5 (offert aux 13-24 ans)',
            cardType: 'Visa Debit',
            minimumDeposit: '$25',
            withdrawalLimit: '$300/jour',
            features: [
              'Compte sans possibilité de découvert',
              'Application mobile et alertes de solde',
              'Retraits gratuits aux automates du réseau',
            ],
            requirements: [
              'Passeport et visa étudiant',
              'I-20 ou DS-2019',
              'SSN ou ITIN',
              'Adresse aux États-Unis',
              'Ouverture en agence pour les nouveaux arrivants',
            ],
            studentPerks: [
              'Gratuité jusqu\'à 24 ans',
              'Pas de frais d\'incident en cas de solde insuffisant',
            ],
          },
        ],
      },
      {
        name: 'Capital One',
        description:
          "Banque en ligne sans agence pour l'essentiel, sans frais de tenue de compte ni minimum, une fois le SSN ou l'ITIN obtenu. " +
          INDICATIF,
        accounts: [
          {
            name: '360 Checking',
            monthlyFee: '$0',
            cardType: 'Mastercard Debit',
            minimumDeposit: '$0',
            withdrawalLimit: '$600/jour',
            features: [
              'Aucun frais mensuel ni solde minimum',
              'Ouverture en ligne',
              'Accès aux automates du réseau partenaire sans frais',
            ],
            requirements: [
              'SSN ou ITIN (obligatoire, pas d\'ouverture sans numéro fiscal)',
              'Passeport ou pièce d\'identité américaine',
              'Adresse aux États-Unis',
              'Âge minimum 18 ans',
            ],
            studentPerks: [
              'Compte épargne rémunéré associé sans condition',
            ],
          },
        ],
      },
    ],
  },

  /* ─────────────────────────── CANADA ────────────────────────────────────── */
  {
    country: 'Canada',
    banks: [
      {
        name: 'RBC Royal Bank',
        description:
          "Première banque canadienne, très présente auprès des étudiants internationaux, y compris via le certificat de placement garanti exigé par le volet direct pour les études. " +
          INDICATIF,
        accounts: [
          {
            name: 'Advantage Banking for Students',
            monthlyFee: '0 CAD avec preuve d\'inscription à temps plein',
            cardType: 'Débit Interac',
            minimumDeposit: '0 CAD',
            withdrawalLimit: '500 CAD/jour',
            features: [
              'Transactions illimitées sans frais pendant les études',
              'Virements Interac inclus',
              'Application mobile et dépôt de chèques par photo',
            ],
            requirements: [
              'Passeport',
              "Permis d'études ou lettre d'introduction de l'IRCC",
              "Lettre d'admission de l'établissement",
              'Adresse au Canada',
              'Numéro d\'assurance sociale (facultatif pour le compte, requis pour travailler)',
            ],
            studentPerks: [
              'Gratuité maintenue tant que le statut étudiant est justifié',
              'Offres de bienvenue selon les périodes',
            ],
          },
          {
            name: 'Programme CPG pour étudiants étrangers',
            monthlyFee: 'Frais de dossier ponctuels',
            cardType: 'Sans carte (compte de placement)',
            minimumDeposit: '20 635 CAD (montant du volet direct, révisé chaque année)',
            withdrawalLimit: 'Déblocage mensuel étalé sur 12 mois',
            features: [
              'Certificat de placement garanti accepté comme preuve de fonds pour le permis d\'études',
              'Attestation d\'achat fournie pour le dossier de visa',
              'Déblocage progressif après l\'arrivée au Canada',
            ],
            requirements: [
              "Lettre d'admission d'un établissement désigné",
              'Passeport',
              'Virement du montant depuis le pays d\'origine',
              'Dossier ouvert avant la demande de permis d\'études',
            ],
            studentPerks: [
              'Condition financière du volet direct pour les études satisfaite',
              'Compte courant ouvert en même temps que le placement',
            ],
          },
        ],
      },
      {
        name: 'TD Canada Trust',
        description:
          "Réseau aux horaires d'ouverture étendus, souvent choisi pour la facilité d'ouverture dès l'arrivée. " +
          INDICATIF,
        accounts: [
          {
            name: 'Compte-chèques Étudiant',
            monthlyFee: '0 CAD avec justificatif d\'inscription',
            cardType: 'Débit Interac / Visa Debit',
            minimumDeposit: '0 CAD',
            withdrawalLimit: '500 CAD/jour',
            features: [
              'Transactions illimitées',
              'Virements Interac inclus',
              'Agences ouvertes le week-end dans les grandes villes',
            ],
            requirements: [
              'Passeport',
              "Permis d'études ou lettre d'introduction",
              "Preuve d'inscription dans un établissement canadien",
              'Adresse au Canada',
            ],
            studentPerks: [
              'Aucun frais mensuel pendant les études',
              'Programme de CPG étudiant disponible pour le dossier de visa',
            ],
          },
        ],
      },
      {
        name: 'Scotiabank',
        description:
          "Banque très implantée auprès des étudiants internationaux, avec un programme de certificat de placement garanti reconnu dans les dossiers de permis d'études. " +
          INDICATIF,
        accounts: [
          {
            name: 'Forfait bancaire Avantage Étudiant',
            monthlyFee: '0 CAD',
            cardType: 'Débit Interac',
            minimumDeposit: '0 CAD',
            withdrawalLimit: '500 CAD/jour',
            features: [
              'Transactions illimitées sans frais',
              'Virements Interac inclus',
              'Ouverture possible depuis l\'étranger dans certains pays',
            ],
            requirements: [
              'Passeport',
              "Permis d'études ou lettre d'introduction de l'IRCC",
              "Lettre d'admission",
              'Adresse au Canada après l\'arrivée',
            ],
            studentPerks: [
              'Gratuité pendant toute la durée du cursus',
              'Programme CPG étudiant pour la preuve de fonds',
            ],
          },
        ],
      },
      {
        name: 'CIBC',
        description:
          "Réseau national proposant un compte étudiant sans frais et un accompagnement des nouveaux arrivants. " +
          INDICATIF,
        accounts: [
          {
            name: 'Compte Intelligent pour étudiants',
            monthlyFee: '0 CAD avec justificatif d\'inscription',
            cardType: 'Débit Interac',
            minimumDeposit: '0 CAD',
            withdrawalLimit: '500 CAD/jour',
            features: [
              'Frais mensuels annulés pour les étudiants',
              'Transactions illimitées',
              'Application mobile en français et en anglais',
            ],
            requirements: [
              'Passeport',
              "Permis d'études",
              "Preuve d'inscription à temps plein",
              'Adresse au Canada',
            ],
            studentPerks: [
              'Offre nouveaux arrivants cumulable',
              'Carte de crédit sans historique de crédit canadien sous conditions',
            ],
          },
        ],
      },
    ],
  },

  /* ─────────────────────────── ALLEMAGNE ─────────────────────────────────── */
  {
    country: 'Germany',
    banks: [
      {
        name: 'Deutsche Bank',
        description:
          "Principale banque privée allemande, dont le compte jeune est gratuit pour les étudiants. L'ouverture suppose d'avoir déjà fait l'Anmeldung (enregistrement du domicile). " +
          INDICATIF,
        accounts: [
          {
            name: 'Das Junge Konto',
            monthlyFee: '0 € pour les étudiants jusqu\'à 30 ans',
            cardType: 'Girocard + Visa Debit',
            minimumDeposit: '0 €',
            withdrawalLimit: '1 000 €/jour',
            features: [
              'Girocard indispensable pour de nombreux commerces et loyers allemands',
              'Retraits gratuits au réseau Cash Group',
              'Application mobile en anglais',
              'IBAN allemand pour le loyer, l\'assurance et le semestre',
            ],
            requirements: [
              'Passeport et visa ou titre de séjour',
              "Attestation d'enregistrement du domicile (Anmeldebestätigung)",
              "Certificat d'immatriculation universitaire (Immatrikulationsbescheinigung)",
              'Numéro fiscal (Steuer-Identifikationsnummer)',
              'Identification en agence ou par PostIdent / vidéo',
            ],
            studentPerks: [
              'Gratuité tant que le statut étudiant est justifié',
              'Découvert possible après quelques mois de relation',
            ],
          },
        ],
      },
      {
        name: 'Commerzbank',
        description:
          "Réseau national dont le compte courant est gratuit pour les étudiants, avec un accueil en anglais dans les villes universitaires. " +
          INDICATIF,
        accounts: [
          {
            name: 'Girokonto StartKonto',
            monthlyFee: '0 € pour les étudiants',
            cardType: 'Girocard (Visa Debit en option)',
            minimumDeposit: '0 €',
            withdrawalLimit: '1 000 €/jour',
            features: [
              'Compte courant gratuit sans condition de versement pour les étudiants',
              'Retraits gratuits au réseau Cash Group',
              'Banque en ligne et application mobile',
            ],
            requirements: [
              'Passeport et titre de séjour ou visa',
              'Anmeldebestätigung (enregistrement du domicile)',
              "Certificat d'immatriculation universitaire",
              'Numéro fiscal allemand',
            ],
            studentPerks: [
              'Prime de bienvenue selon les périodes',
              'Gratuité jusqu\'à la fin des études',
            ],
          },
        ],
      },
      {
        name: 'N26',
        description:
          "Banque mobile allemande agréée : ouverture depuis le téléphone en quelques minutes, sans agence ni rendez-vous. Utile quand l'Anmeldung n'est pas encore faite, la plupart des offres de réseau l'exigeant. " +
          INDICATIF,
        accounts: [
          {
            name: 'N26 Standard',
            monthlyFee: '0 €',
            cardType: 'Mastercard Debit',
            minimumDeposit: '0 €',
            withdrawalLimit: '2 500 €/jour',
            features: [
              'Ouverture 100 % mobile avec vidéo-identification',
              'IBAN allemand accepté pour le loyer et le salaire',
              'Notifications de paiement en temps réel',
              'Application en français, anglais et allemand',
            ],
            requirements: [
              'Passeport ou carte d\'identité en cours de validité',
              'Vidéo-identification depuis le téléphone',
              'Adresse de résidence dans un pays desservi',
              'Âge minimum 18 ans',
            ],
            studentPerks: [
              'Aucun frais de tenue de compte',
              'Paiements en devises sans commission de change',
            ],
          },
        ],
      },
      {
        name: 'Sparkasse',
        description:
          "Réseau de caisses d'épargne publiques, présent dans chaque ville, souvent le seul guichet disponible en petite ville universitaire. Conditions et tarifs varient d'une caisse régionale à l'autre. " +
          INDICATIF,
        accounts: [
          {
            name: 'Girokonto pour étudiants',
            monthlyFee: '0 € dans la plupart des caisses régionales',
            cardType: 'Girocard',
            minimumDeposit: '0 €',
            withdrawalLimit: '1 000 €/jour',
            features: [
              'Agence physique et conseiller dédié',
              'Densité d\'automates la plus forte du pays',
              'Compte accepté partout pour le loyer et les charges',
            ],
            requirements: [
              'Passeport et visa ou titre de séjour',
              'Anmeldebestätigung',
              "Certificat d'immatriculation universitaire",
              'Numéro fiscal allemand',
              'Ouverture en agence, sur rendez-vous',
            ],
            studentPerks: [
              'Gratuité pour les étudiants jusqu\'à 30 ans selon la caisse',
              'Accompagnement en présentiel, utile pour un premier compte',
            ],
          },
        ],
      },
      {
        name: 'Fintiba — compte bloqué (Sperrkonto)',
        description:
          "Compte bloqué reconnu par les consulats allemands : il prouve les ressources exigées pour le visa étudiant et libère une mensualité fixe après l'arrivée. Ce n'est pas un compte courant — il se double d'un compte classique sur place. Le montant annuel est fixé par la réglementation et révisé chaque année. " +
          INDICATIF,
        accounts: [
          {
            name: 'Fintiba Blocked Account',
            monthlyFee: 'Frais de dossier + frais mensuels de gestion',
            cardType: 'Sans carte (compte bloqué)',
            minimumDeposit: '≈ 11 904 € pour douze mois (montant réglementaire, à revérifier)',
            withdrawalLimit: '≈ 992 €/mois débloqués',
            features: [
              'Attestation de blocage acceptée par les ambassades et consulats allemands',
              'Ouverture en ligne avant le départ',
              'Virement mensuel automatique vers le compte courant allemand',
              'Assurance santé souvent proposée avec le compte',
            ],
            requirements: [
              'Passeport en cours de validité',
              "Lettre d'admission ou justificatif de candidature",
              'Virement du montant complet depuis le pays d\'origine',
              'Vidéo-identification en ligne',
            ],
            studentPerks: [
              'Condition financière du visa étudiant satisfaite',
              'Déblocage possible dès l\'ouverture du compte courant en Allemagne',
            ],
          },
        ],
      },
    ],
  },

  /* ─────────────────────────── FRANCE ────────────────────────────────────── */
  {
    country: 'France',
    banks: [
      {
        name: 'BNP Paribas',
        description:
          "Réseau national doté d'agences dédiées aux étudiants internationaux dans les villes universitaires. Le RIB français est indispensable pour la CAF, le loyer et l'assurance habitation. " +
          INDICATIF,
        accounts: [
          {
            name: 'Compte de dépôt étudiant',
            monthlyFee: '0 € (offre étudiante)',
            cardType: 'Carte bancaire Visa',
            minimumDeposit: '0 €',
            withdrawalLimit: '500 €/semaine',
            features: [
              'RIB français accepté pour la CAF, le loyer et l\'inscription universitaire',
              'Attestation de compte fournie pour le dossier de titre de séjour',
              'Application mobile et virements SEPA instantanés',
              'Agences dédiées aux internationaux dans les grandes villes',
            ],
            requirements: [
              'Passeport',
              'Visa long séjour VLS-TS ou titre de séjour',
              "Certificat de scolarité ou attestation d'inscription",
              "Justificatif de domicile de moins de trois mois (quittance, attestation d'hébergement, contrat de résidence)",
              'Rendez-vous en agence pour la signature',
            ],
            studentPerks: [
              'Cotisation carte offerte pendant les études',
              'Assurance des moyens de paiement incluse',
            ],
          },
        ],
      },
      {
        name: 'Société Générale',
        description:
          "Réseau proposant une offre jeune sans frais et un accompagnement des étudiants étrangers pour la constitution du dossier. " +
          INDICATIF,
        accounts: [
          {
            name: 'Offre Jeune (moins de 30 ans)',
            monthlyFee: '0 €',
            cardType: 'Carte bancaire Visa',
            minimumDeposit: '0 €',
            withdrawalLimit: '500 €/semaine',
            features: [
              'Compte et carte gratuits jusqu\'à 30 ans',
              'RIB français immédiat pour les démarches',
              'Application mobile avec plafonds modifiables',
            ],
            requirements: [
              'Passeport ou pièce d\'identité',
              'Titre de séjour ou visa VLS-TS',
              'Certificat de scolarité',
              'Justificatif de domicile en France',
            ],
            studentPerks: [
              'Prime de bienvenue selon les périodes',
              'Découvert autorisé après quelques mois',
            ],
          },
        ],
      },
      {
        name: 'Crédit Agricole',
        description:
          "Premier réseau d'agences de France, y compris dans les villes moyennes. Les conditions varient d'une caisse régionale à l'autre. " +
          INDICATIF,
        accounts: [
          {
            name: 'Compte étudiant / Globe-Trotter',
            monthlyFee: '0 à 2 € selon la caisse régionale',
            cardType: 'Carte bancaire Mastercard',
            minimumDeposit: '0 €',
            withdrawalLimit: '500 €/semaine',
            features: [
              'Maillage d\'agences le plus dense, utile hors des grandes métropoles',
              'Offre dédiée aux séjours à l\'étranger (retraits et paiements en devises)',
              'RIB français pour la CAF et le loyer',
            ],
            requirements: [
              'Passeport',
              'Visa VLS-TS ou titre de séjour',
              'Certificat de scolarité',
              'Justificatif de domicile en France',
              'Ouverture en agence',
            ],
            studentPerks: [
              'Tarifs réduits pour les moins de 25 ans',
              'Assurance habitation étudiante proposée avec le compte',
            ],
          },
        ],
      },
      {
        name: 'La Banque Postale',
        description:
          "Banque du réseau postal, souvent la plus accessible pour un premier compte : guichets dans tous les bureaux de poste et politique d'accueil large. " +
          INDICATIF,
        accounts: [
          {
            name: 'Compte courant jeune',
            monthlyFee: '0 à 2 € selon la formule',
            cardType: 'Carte Visa (à autorisation systématique possible)',
            minimumDeposit: '0 €',
            withdrawalLimit: '400 €/semaine',
            features: [
              'Guichets dans tous les bureaux de poste',
              'Carte à autorisation systématique, sans risque de découvert',
              'RIB français pour toutes les démarches administratives',
            ],
            requirements: [
              'Passeport',
              'Titre de séjour ou visa',
              'Certificat de scolarité',
              'Justificatif de domicile en France',
            ],
            studentPerks: [
              'Formule jeune à tarif réduit',
              'Droit au compte mobilisable en cas de refus ailleurs',
            ],
          },
        ],
      },
      {
        name: 'BoursoBank',
        description:
          "Banque en ligne sans agence, gratuite, à condition de disposer déjà d'une adresse et d'un justificatif de domicile en France. À réserver comme second compte plutôt que comme compte d'arrivée. " +
          INDICATIF,
        accounts: [
          {
            name: 'Offre Welcome',
            monthlyFee: '0 €',
            cardType: 'Carte Visa',
            minimumDeposit: '300 € à l\'ouverture (restitués)',
            withdrawalLimit: '1 000 €/semaine',
            features: [
              'Aucun frais de tenue de compte ni condition de revenus',
              'Ouverture en ligne avec signature électronique',
              'Paiements et retraits en devises sans commission sur certaines offres',
            ],
            requirements: [
              'Pièce d\'identité en cours de validité',
              'Justificatif de domicile en France de moins de trois mois',
              'RIB d\'un autre compte français pour le virement initial',
              'Résidence fiscale en France',
            ],
            studentPerks: [
              'Prime de bienvenue selon les périodes',
              'Gratuité totale si le compte est utilisé au moins une fois par mois',
            ],
          },
        ],
      },
    ],
  },

  /* ─────────────────────────── PAYS-BAS ──────────────────────────────────── */
  {
    country: 'Netherlands',
    banks: [
      {
        name: 'ING',
        description:
          "Première banque néerlandaise pour les étudiants, avec un service entièrement disponible en anglais. Le BSN (numéro de citoyen) obtenu à l'inscription en mairie conditionne l'ouverture. " +
          INDICATIF,
        accounts: [
          {
            name: 'Studentenrekening',
            monthlyFee: '0 € jusqu\'à 27 ans',
            cardType: 'Debit Mastercard',
            minimumDeposit: '0 €',
            withdrawalLimit: '1 000 €/jour',
            features: [
              'Compte gratuit pour les moins de 27 ans en études',
              'iDEAL, le moyen de paiement en ligne incontournable aux Pays-Bas',
              'Application et service client en anglais',
              'IBAN néerlandais pour le loyer et la bourse',
            ],
            requirements: [
              'Numéro BSN obtenu après inscription à la mairie (gemeente)',
              'Passeport ou carte d\'identité',
              "Preuve d'inscription universitaire",
              'Adresse aux Pays-Bas',
            ],
            studentPerks: [
              'Gratuité jusqu\'à 27 ans',
              'Découvert étudiant possible sous conditions',
            ],
          },
        ],
      },
      {
        name: 'ABN AMRO',
        description:
          "Réseau proposant un forfait jeune gratuit et un accompagnement en anglais des étudiants internationaux. " +
          INDICATIF,
        accounts: [
          {
            name: 'Jongerenpakket (forfait jeune)',
            monthlyFee: '0 € jusqu\'à 30 ans en études',
            cardType: 'Debit Mastercard',
            minimumDeposit: '0 €',
            withdrawalLimit: '1 250 €/jour',
            features: [
              'Forfait gratuit pour les étudiants',
              'iDEAL et Tikkie pour les paiements entre particuliers',
              'Rendez-vous en anglais en agence',
            ],
            requirements: [
              'BSN',
              'Passeport ou carte d\'identité',
              "Preuve d'inscription dans un établissement néerlandais",
              'Adresse aux Pays-Bas',
            ],
            studentPerks: [
              'Gratuité pendant les études',
              'Compte épargne associé sans frais',
            ],
          },
        ],
      },
      {
        name: 'Rabobank',
        description:
          "Banque coopérative bien implantée dans les villes universitaires de province, avec un compte étudiant gratuit. " +
          INDICATIF,
        accounts: [
          {
            name: 'Rabo StudentenRekening',
            monthlyFee: '0 € pendant les études',
            cardType: 'Debit Mastercard',
            minimumDeposit: '0 €',
            withdrawalLimit: '1 000 €/jour',
            features: [
              'Compte gratuit sur justificatif d\'inscription',
              'iDEAL inclus',
              'Application mobile en anglais',
            ],
            requirements: [
              'BSN',
              'Passeport ou carte d\'identité',
              "Preuve d'inscription universitaire",
              'Adresse aux Pays-Bas',
            ],
            studentPerks: [
              'Aucun frais pendant le cursus',
              'Conseil en agence dans les villes universitaires',
            ],
          },
        ],
      },
      {
        name: 'bunq',
        description:
          "Banque mobile néerlandaise agréée, dont l'ouverture ne dépend pas du BSN : elle sert de compte de transition les premières semaines, avant l'inscription en mairie. " +
          INDICATIF,
        accounts: [
          {
            name: 'bunq Easy Bank',
            monthlyFee: '0 à 3,99 € selon la formule',
            cardType: 'Mastercard Debit',
            minimumDeposit: '0 €',
            withdrawalLimit: '1 000 €/jour',
            features: [
              'Ouverture mobile sans BSN, avec passeport',
              'IBAN néerlandais immédiat',
              'Sous-comptes pour séparer loyer et dépenses courantes',
              'Application multilingue',
            ],
            requirements: [
              'Passeport ou carte d\'identité en cours de validité',
              'Vérification d\'identité en ligne',
              'Adresse de résidence dans un pays desservi',
              'Âge minimum 16 ans selon la formule',
            ],
            studentPerks: [
              'Solution de dépannage tant que le BSN n\'est pas délivré',
              'Paiements en devises à taux interbancaire selon la formule',
            ],
          },
        ],
      },
    ],
  },

  /* ─────────────────────────── ESPAGNE ───────────────────────────────────── */
  {
    country: 'Spain',
    banks: [
      {
        name: 'CaixaBank',
        description:
          "Premier réseau espagnol, partenaire de nombreuses universités. Les non-résidents peuvent ouvrir un compte avec un certificat de non-résidence en attendant le NIE. " +
          INDICATIF,
        accounts: [
          {
            name: 'Cuenta Estudiante',
            monthlyFee: '0 € pour les étudiants',
            cardType: 'Visa Debit',
            minimumDeposit: '0 €',
            withdrawalLimit: '600 €/jour',
            features: [
              'Compte sans commission pour les étudiants',
              'Bizum pour les paiements entre particuliers, très utilisé en Espagne',
              'Automates dans toutes les villes universitaires',
            ],
            requirements: [
              'NIE (numéro d\'identité d\'étranger) ou certificat de non-résidence',
              'Passeport',
              "Justificatif d'inscription universitaire (matrícula)",
              'Justificatif de domicile ou empadronamiento',
            ],
            studentPerks: [
              'Gratuité jusqu\'à 26 ans en études',
              'Offres de bourses et de mobilité du programme universités',
            ],
          },
        ],
      },
      {
        name: 'imagin (CaixaBank)',
        description:
          "Offre 100 % mobile du groupe CaixaBank destinée aux jeunes : ouverture depuis le téléphone, sans frais et sans passage en agence. " +
          INDICATIF,
        accounts: [
          {
            name: 'imaginBank',
            monthlyFee: '0 €',
            cardType: 'Visa Debit',
            minimumDeposit: '0 €',
            withdrawalLimit: '600 €/jour',
            features: [
              'Ouverture en ligne depuis l\'application',
              'Bizum inclus',
              'Aucune commission de tenue de compte',
            ],
            requirements: [
              'NIE ou DNI',
              'Passeport',
              'Âge compris entre 18 et 30 ans',
              'Adresse en Espagne',
            ],
            studentPerks: [
              'Réductions culture, concerts et transports',
              'Retraits gratuits au réseau CaixaBank',
            ],
          },
        ],
      },
      {
        name: 'BBVA',
        description:
          "Réseau national dont le compte en ligne est sans commission, avec une application souvent citée comme la plus complète du marché espagnol. " +
          INDICATIF,
        accounts: [
          {
            name: 'Cuenta Online sin comisiones',
            monthlyFee: '0 €',
            cardType: 'Visa Debit (Aqua)',
            minimumDeposit: '0 €',
            withdrawalLimit: '600 €/jour',
            features: [
              'Aucune commission de tenue ni de maintenance',
              'Ouverture en ligne avec vidéo-identification',
              'Bizum et virements SEPA instantanés',
            ],
            requirements: [
              'NIE ou passeport avec certificat de non-résidence',
              'Vidéo-identification ou passage en agence',
              'Adresse en Espagne',
              'Âge minimum 18 ans',
            ],
            studentPerks: [
              'Carte sans numéro imprimé, régénérable en cas de fraude',
              'Suivi budgétaire dans l\'application',
            ],
          },
        ],
      },
      {
        name: 'Banco Santander',
        description:
          "Réseau doté d'une division universitaire présente sur de nombreux campus espagnols, avec des bourses de mobilité associées. " +
          INDICATIF,
        accounts: [
          {
            name: 'Cuenta Smart / Santander Universidades',
            monthlyFee: '0 € pour les moins de 31 ans',
            cardType: 'Visa Debit',
            minimumDeposit: '0 €',
            withdrawalLimit: '600 €/jour',
            features: [
              'Gratuité pour les moins de 31 ans',
              'Bizum inclus',
              'Bureaux sur ou près des campus partenaires',
            ],
            requirements: [
              'NIE ou certificat de non-résidence',
              'Passeport',
              "Justificatif d'inscription universitaire",
              'Adresse en Espagne',
            ],
            studentPerks: [
              'Accès aux bourses Santander Universidades',
              'Retraits gratuits au réseau du groupe',
            ],
          },
        ],
      },
    ],
  },

  /* ─────────────────────────── SUÈDE ─────────────────────────────────────── */
  {
    country: 'Sweden',
    banks: [
      {
        name: 'SEB',
        description:
          "Grande banque suédoise. Comme partout en Suède, l'ouverture dépend du personnummer délivré par le Skatteverket, réservé aux séjours de plus d'un an — les échanges d'un semestre en sont exclus et gardent leur compte d'origine. " +
          INDICATIF,
        accounts: [
          {
            name: 'Enkla vardagen (compte du quotidien)',
            monthlyFee: '0 SEK pour les moins de 26 ans',
            cardType: 'Mastercard Debit',
            minimumDeposit: '0 SEK',
            withdrawalLimit: '10 000 SEK/jour',
            features: [
              'Accès au BankID, indispensable pour toutes les démarches en ligne suédoises',
              'Swish pour les paiements entre particuliers',
              'Société quasi sans espèces : la carte suffit partout',
            ],
            requirements: [
              'Personnummer délivré par le Skatteverket (séjour de plus d\'un an)',
              'Passeport',
              "Lettre d'admission et certificat d'inscription",
              'Adresse en Suède',
              'Passage en agence obligatoire pour l\'identification',
            ],
            studentPerks: [
              'Gratuité pour les moins de 26 ans',
              'BankID inclus, requis pour le logement et l\'administration',
            ],
          },
        ],
      },
      {
        name: 'Swedbank',
        description:
          "Réseau le plus dense de Suède, souvent le plus rapide à traiter les dossiers d'étudiants internationaux munis d'un personnummer. " +
          INDICATIF,
        accounts: [
          {
            name: 'Compte étudiant Swedbank',
            monthlyFee: '0 SEK pour les étudiants',
            cardType: 'Mastercard Debit',
            minimumDeposit: '0 SEK',
            withdrawalLimit: '10 000 SEK/jour',
            features: [
              'BankID et Swish inclus',
              'Application mobile en anglais',
              'Agences dans toutes les villes universitaires',
            ],
            requirements: [
              'Personnummer',
              'Passeport',
              "Certificat d'inscription universitaire",
              'Adresse en Suède',
              'Rendez-vous en agence',
            ],
            studentPerks: [
              'Aucun frais pendant les études',
              'Accompagnement des nouveaux arrivants en anglais',
            ],
          },
        ],
      },
      {
        name: 'Nordea',
        description:
          "Groupe nordique proposant un compte d'accueil pour les étudiants internationaux, avec un service en anglais. " +
          INDICATIF,
        accounts: [
          {
            name: 'Check-in Account',
            monthlyFee: '0 SEK',
            cardType: 'Visa Debit',
            minimumDeposit: '0 SEK',
            withdrawalLimit: '10 000 SEK/jour',
            features: [
              'Compte conçu pour les nouveaux arrivants',
              'BankID et Swish une fois le personnummer enregistré',
              'Service client en anglais',
            ],
            requirements: [
              'Personnummer ou samordningsnummer selon le cas',
              'Passeport',
              "Preuve d'inscription et de séjour",
              'Adresse en Suède',
            ],
            studentPerks: [
              'Ouverture facilitée pour les étudiants étrangers',
              'Pas de frais de tenue de compte',
            ],
          },
        ],
      },
      {
        name: 'Revolut',
        description:
          "Établissement de monnaie électronique européen, utilisé en Suède comme compte de transition : il fonctionne sans personnummer, mais ne donne pas accès au BankID ni à Swish, indispensables sur place à moyen terme. " +
          INDICATIF,
        accounts: [
          {
            name: 'Revolut Standard',
            monthlyFee: '0 SEK',
            cardType: 'Visa ou Mastercard Debit',
            minimumDeposit: '0 SEK',
            withdrawalLimit: 'Retraits gratuits jusqu\'à un plafond mensuel',
            features: [
              'Ouverture mobile en quelques minutes, sans personnummer',
              'Comptes en plusieurs devises et change au taux du marché',
              'IBAN européen',
            ],
            requirements: [
              'Passeport ou carte d\'identité',
              'Vérification d\'identité en ligne',
              'Résidence dans un pays desservi',
              'Âge minimum 18 ans',
            ],
            studentPerks: [
              'Dépannage à l\'arrivée, avant l\'obtention du personnummer',
              'Change sans commission dans les limites de la formule gratuite',
            ],
          },
        ],
      },
    ],
  },

  /* ─────────────────────────── SUISSE ────────────────────────────────────── */
  {
    country: 'Switzerland',
    banks: [
      {
        name: 'UBS',
        description:
          "Première banque suisse, dont l'offre jeunes est gratuite pendant les études. Le permis de séjour B ou L délivré après l'arrivée est la pièce déterminante. " +
          INDICATIF,
        accounts: [
          {
            name: 'UBS Campus / Générations (18-30 ans)',
            monthlyFee: '0 CHF pour les étudiants jusqu\'à 30 ans',
            cardType: 'Debit Mastercard',
            minimumDeposit: '0 CHF',
            withdrawalLimit: '1 000 CHF/jour',
            features: [
              'Gratuité de la tenue de compte et de la carte pendant les études',
              'TWINT, le paiement mobile standard en Suisse',
              'Application en français, allemand, italien et anglais',
            ],
            requirements: [
              'Passeport',
              'Permis de séjour B ou L, ou attestation de dépôt de demande',
              "Attestation d'immatriculation universitaire",
              'Attestation de domicile en Suisse',
              'Ouverture en agence pour les non-résidents',
            ],
            studentPerks: [
              'Compte et carte gratuits jusqu\'à 30 ans en études',
              'Retraits gratuits aux automates du réseau',
            ],
          },
        ],
      },
      {
        name: 'PostFinance',
        description:
          "Établissement du groupe postal, accessible dans tous les bureaux de poste et réputé le plus simple d'accès pour un nouvel arrivant. " +
          INDICATIF,
        accounts: [
          {
            name: 'Compte privé Étudiants',
            monthlyFee: '0 CHF pour les étudiants jusqu\'à 30 ans',
            cardType: 'Carte de débit PostFinance',
            minimumDeposit: '0 CHF',
            withdrawalLimit: '1 000 CHF/jour',
            features: [
              'Guichets dans tous les bureaux de poste',
              'TWINT inclus',
              'Compte accepté partout pour le loyer et l\'assurance maladie',
            ],
            requirements: [
              'Passeport',
              'Permis de séjour B ou L',
              "Attestation d'immatriculation",
              'Attestation de domicile',
            ],
            studentPerks: [
              'Gratuité pendant les études',
              'Réseau de guichets le plus étendu du pays',
            ],
          },
        ],
      },
      {
        name: 'Raiffeisen',
        description:
          "Réseau de banques coopératives régionales, très présent hors des grands centres ; les conditions varient d'une banque locale à l'autre. " +
          INDICATIF,
        accounts: [
          {
            name: 'YoungMemberPlus',
            monthlyFee: '0 CHF jusqu\'à 30 ans',
            cardType: 'Debit Mastercard',
            minimumDeposit: '0 CHF',
            withdrawalLimit: '1 000 CHF/jour',
            features: [
              'Offre jeunes gratuite avec carte de débit',
              'TWINT inclus',
              'Avantages culture et loisirs du sociétariat',
            ],
            requirements: [
              'Passeport',
              'Permis de séjour B ou L',
              "Attestation d'études",
              'Attestation de domicile',
              'Ouverture auprès de la banque Raiffeisen locale',
            ],
            studentPerks: [
              'Réductions musées, festivals et remontées mécaniques',
              'Compte gratuit jusqu\'à 30 ans',
            ],
          },
        ],
      },
      {
        name: 'Zürcher Kantonalbank',
        description:
          "Banque cantonale de Zurich, gratuite pour les moins de 30 ans, pertinente pour les étudiants inscrits dans le canton. " +
          INDICATIF,
        accounts: [
          {
            name: 'Compte étudiant ZKB',
            monthlyFee: '0 CHF jusqu\'à 30 ans',
            cardType: 'Debit Mastercard',
            minimumDeposit: '0 CHF',
            withdrawalLimit: '1 000 CHF/jour',
            features: [
              'Gratuité pour les jeunes et les étudiants',
              'TWINT inclus',
              'Garantie de l\'État de Zurich sur les dépôts',
            ],
            requirements: [
              'Passeport',
              'Permis de séjour B ou L',
              "Attestation d'immatriculation (EPFZ, université de Zurich, ZHAW…)",
              'Domicile dans le canton de Zurich',
            ],
            studentPerks: [
              'Aucun frais jusqu\'à 30 ans',
              'Offres culturelles cantonales',
            ],
          },
        ],
      },
    ],
  },

  /* ─────────────────────────── ITALIE ────────────────────────────────────── */
  {
    country: 'Italy',
    banks: [
      {
        name: 'Intesa Sanpaolo',
        description:
          "Premier groupe bancaire italien, avec un compte gratuit pour les moins de 35 ans. Le codice fiscale, délivré par l'Agenzia delle Entrate, est le préalable à toute ouverture. " +
          INDICATIF,
        accounts: [
          {
            name: 'XME Conto UP! (moins de 35 ans)',
            monthlyFee: '0 € jusqu\'à 35 ans',
            cardType: 'Carte de débit Mastercard',
            minimumDeposit: '0 €',
            withdrawalLimit: '500 €/jour',
            features: [
              'Gratuité de la tenue de compte pour les moins de 35 ans',
              'IBAN italien pour le loyer, les taxes universitaires et les bourses',
              'Application mobile en anglais',
            ],
            requirements: [
              'Codice fiscale',
              'Passeport',
              'Permesso di soggiorno ou reçu de la demande (ricevuta)',
              "Certificat d'inscription universitaire",
              'Justificatif de domicile en Italie',
            ],
            studentPerks: [
              'Aucun frais jusqu\'à 35 ans',
              'Conventions avec plusieurs universités pour le paiement des taxes',
            ],
          },
        ],
      },
      {
        name: 'UniCredit',
        description:
          "Réseau international présent dans toutes les villes universitaires italiennes, avec une offre jeune sans frais. " +
          INDICATIF,
        accounts: [
          {
            name: 'My Genius Green (moins de 30 ans)',
            monthlyFee: '0 € jusqu\'à 30 ans',
            cardType: 'Carte de débit Visa',
            minimumDeposit: '0 €',
            withdrawalLimit: '500 €/jour',
            features: [
              'Compte modulaire, gratuit dans sa version de base pour les jeunes',
              'Virements SEPA et paiement des taxes universitaires (pagoPA)',
              'Application mobile multilingue',
            ],
            requirements: [
              'Codice fiscale',
              'Passeport',
              'Permesso di soggiorno ou ricevuta',
              "Certificat d'inscription",
              'Justificatif de domicile',
            ],
            studentPerks: [
              'Gratuité jusqu\'à 30 ans',
              'Carte de crédit possible après quelques mois de relation',
            ],
          },
        ],
      },
      {
        name: 'Poste Italiane',
        description:
          "Établissement du réseau postal, le plus accessible pour un étudiant étranger : guichets partout et dossier léger. La Postepay Evolution, dotée d'un IBAN, sert souvent de compte d'arrivée. " +
          INDICATIF,
        accounts: [
          {
            name: 'Postepay Evolution',
            monthlyFee: '0 € (frais d\'émission annuels)',
            cardType: 'Carte prépayée Mastercard avec IBAN',
            minimumDeposit: '0 €',
            withdrawalLimit: '600 €/jour',
            features: [
              'IBAN italien sans ouvrir de compte courant',
              'Souscription au guichet de n\'importe quel bureau de poste',
              'Recharges en espèces possibles',
            ],
            requirements: [
              'Codice fiscale',
              'Passeport',
              'Permesso di soggiorno ou ricevuta selon le bureau',
              'Âge minimum 18 ans',
            ],
            studentPerks: [
              'Ouverture la plus rapide du pays pour un nouvel arrivant',
              'Accepté pour le versement des bourses régionales',
            ],
          },
          {
            name: 'Conto BancoPosta',
            monthlyFee: '≈ 6 €/mois (réduit pour les jeunes)',
            cardType: 'Carte de débit Postamat / Maestro',
            minimumDeposit: '0 €',
            withdrawalLimit: '600 €/jour',
            features: [
              'Compte courant complet avec chéquier et prélèvements',
              'Guichets postaux dans toutes les communes',
              'Paiement des taxes et amendes au guichet',
            ],
            requirements: [
              'Codice fiscale',
              'Passeport',
              'Permesso di soggiorno',
              'Justificatif de domicile en Italie',
            ],
            studentPerks: [
              'Tarif réduit pour les moins de 30 ans',
              'Prélèvements automatiques pour le loyer et les charges',
            ],
          },
        ],
      },
      {
        name: 'Banco BPM',
        description:
          "Troisième réseau italien, implanté surtout dans le nord du pays, avec un compte jeune sans frais. " +
          INDICATIF,
        accounts: [
          {
            name: 'Conto Youbanking Giovani',
            monthlyFee: '0 € jusqu\'à 30 ans',
            cardType: 'Carte de débit Mastercard',
            minimumDeposit: '0 €',
            withdrawalLimit: '500 €/jour',
            features: [
              'Compte en ligne gratuit pour les jeunes',
              'Agences denses en Lombardie, Vénétie et Piémont',
              'Virements SEPA instantanés',
            ],
            requirements: [
              'Codice fiscale',
              'Passeport',
              'Permesso di soggiorno ou ricevuta',
              "Certificat d'inscription universitaire",
            ],
            studentPerks: [
              'Gratuité jusqu\'à 30 ans',
              'Découvert étudiant sous conditions',
            ],
          },
        ],
      },
    ],
  },

  /* ─────────────────────────── PORTUGAL ──────────────────────────────────── */
  {
    country: 'Portugal',
    banks: [
      {
        name: 'Millennium bcp',
        description:
          "Première banque privée portugaise, dotée d'un compte universitaire sans frais. Le NIF obtenu auprès des Finanças est exigé avant toute ouverture. " +
          INDICATIF,
        accounts: [
          {
            name: 'Conta Universitária',
            monthlyFee: '0 € pour les étudiants',
            cardType: 'Carte de débit Visa',
            minimumDeposit: '0 €',
            withdrawalLimit: '400 €/jour',
            features: [
              'Accès au réseau Multibanco, incontournable au Portugal (factures, transports, impôts)',
              'MB WAY pour les paiements entre particuliers',
              'IBAN portugais pour le loyer et les propinas',
            ],
            requirements: [
              'NIF (numéro d\'identification fiscale) délivré par les Finanças',
              'Passeport',
              'Justificatif de domicile au Portugal',
              "Certificat d'inscription universitaire",
            ],
            studentPerks: [
              'Compte et carte gratuits pendant les études',
              'Découvert étudiant possible sous conditions',
            ],
          },
        ],
      },
      {
        name: 'Caixa Geral de Depósitos',
        description:
          "Banque publique portugaise, partenaire historique des universités via l'offre Caixa IU, souvent proposée au moment de l'inscription. " +
          INDICATIF,
        accounts: [
          {
            name: 'Conta Caixa IU',
            monthlyFee: '0 € pour les étudiants',
            cardType: 'Carte de débit Caixa IU',
            minimumDeposit: '0 €',
            withdrawalLimit: '400 €/jour',
            features: [
              'Carte servant aussi de carte étudiante dans les universités partenaires',
              'Multibanco et MB WAY inclus',
              'Guichets sur les campus partenaires',
            ],
            requirements: [
              'NIF',
              'Passeport',
              "Certificat d'inscription dans une université partenaire",
              'Justificatif de domicile au Portugal',
            ],
            studentPerks: [
              'Carte multifonction (accès campus, bibliothèque, restauration)',
              'Aucun frais pendant le cursus',
            ],
          },
        ],
      },
      {
        name: 'Novo Banco',
        description:
          "Réseau national proposant un compte jeune sans frais et une ouverture en ligne pour les résidents. " +
          INDICATIF,
        accounts: [
          {
            name: 'Conta Novo Banco Universitário',
            monthlyFee: '0 € jusqu\'à 30 ans',
            cardType: 'Carte de débit Visa',
            minimumDeposit: '0 €',
            withdrawalLimit: '400 €/jour',
            features: [
              'Gratuité pour les étudiants et les jeunes actifs',
              'Multibanco et MB WAY',
              'Application mobile en anglais',
            ],
            requirements: [
              'NIF',
              'Passeport',
              'Justificatif de domicile au Portugal',
              "Certificat d'inscription",
            ],
            studentPerks: [
              'Aucun frais de tenue de compte',
              'Offres partenaires culture et transports',
            ],
          },
        ],
      },
      {
        name: 'Santander Portugal',
        description:
          "Filiale portugaise du groupe Santander, avec une offre universitaire et des bourses de mobilité associées. " +
          INDICATIF,
        accounts: [
          {
            name: 'Conta Universitária Santander',
            monthlyFee: '0 € pour les étudiants',
            cardType: 'Carte de débit Visa',
            minimumDeposit: '0 €',
            withdrawalLimit: '400 €/jour',
            features: [
              'Compte gratuit sur justificatif d\'inscription',
              'Multibanco et MB WAY',
              'Agences sur plusieurs campus',
            ],
            requirements: [
              'NIF',
              'Passeport',
              "Certificat d'inscription universitaire",
              'Justificatif de domicile au Portugal',
            ],
            studentPerks: [
              'Accès aux bourses Santander Universidades',
              'Gratuité pendant les études',
            ],
          },
        ],
      },
    ],
  },

  /* ─────────────────────────── CHINE ─────────────────────────────────────── */
  {
    country: 'China',
    banks: [
      {
        name: 'Bank of China',
        description:
          "Banque la plus habituée aux dossiers d'étrangers, souvent dotée d'un guichet dédié près des campus. En Chine, le compte n'a d'utilité qu'associé à un numéro de téléphone local, lui-même requis pour Alipay et WeChat Pay. " +
          INDICATIF,
        accounts: [
          {
            name: 'Compte courant Great Wall (UnionPay)',
            monthlyFee: '0 CNY',
            cardType: 'UnionPay Debit',
            minimumDeposit: '10 à 100 CNY selon l\'agence',
            withdrawalLimit: '20 000 CNY/jour',
            features: [
              'Carte UnionPay acceptée dans tout le pays',
              'Liaison avec Alipay et WeChat Pay, indispensables au quotidien',
              'Guichets habitués aux étudiants internationaux',
              'Virements internationaux soumis au contrôle des changes',
            ],
            requirements: [
              'Passeport avec visa X1 ou X2',
              'Permis de séjour (residence permit) ou enregistrement de résidence auprès de la police',
              "Lettre d'admission ou carte d'étudiant",
              'Numéro de téléphone mobile chinois (obligatoire)',
              'Présence physique en agence',
            ],
            studentPerks: [
              'Ouverture facilitée sur présentation de la carte d\'étudiant',
              'Application disponible en anglais',
            ],
          },
        ],
      },
      {
        name: 'ICBC',
        description:
          "Première banque chinoise par la taille, avec le réseau d'agences et d'automates le plus dense du pays. " +
          INDICATIF,
        accounts: [
          {
            name: 'Compte de dépôt ICBC',
            monthlyFee: '0 CNY',
            cardType: 'UnionPay Debit',
            minimumDeposit: '10 CNY',
            withdrawalLimit: '20 000 CNY/jour',
            features: [
              'Réseau d\'automates le plus étendu de Chine',
              'Liaison Alipay et WeChat Pay',
              'Dépôt et retrait d\'espèces au guichet',
            ],
            requirements: [
              'Passeport et visa étudiant',
              'Permis de séjour ou enregistrement de police',
              "Carte d'étudiant ou lettre de l'université",
              'Numéro de téléphone chinois',
            ],
            studentPerks: [
              'Comptes ouverts en séance groupée sur certains campus',
              'Frais de tenue de compte nuls',
            ],
          },
        ],
      },
      {
        name: 'China Construction Bank',
        description:
          "Réseau souvent partenaire des universités, avec des permanences organisées sur le campus à la rentrée pour les étudiants internationaux. " +
          INDICATIF,
        accounts: [
          {
            name: 'Compte de dépôt CCB',
            monthlyFee: '0 CNY',
            cardType: 'UnionPay Debit',
            minimumDeposit: '10 CNY',
            withdrawalLimit: '20 000 CNY/jour',
            features: [
              'Permanences d\'ouverture sur le campus à la rentrée',
              'Carte UnionPay et paiement mobile',
              'Versement des bourses gouvernementales chinoises',
            ],
            requirements: [
              'Passeport et visa X1 ou X2',
              'Permis de séjour',
              "Carte d'étudiant ou attestation d'inscription",
              'Numéro de téléphone chinois',
            ],
            studentPerks: [
              'Banque retenue pour le versement des bourses CSC dans plusieurs universités',
              'Ouverture accompagnée par le bureau des étudiants internationaux',
            ],
          },
        ],
      },
      {
        name: 'Bank of Communications',
        description:
          "Grande banque nationale acceptant les dossiers d'étrangers, avec un service en anglais dans les métropoles. " +
          INDICATIF,
        accounts: [
          {
            name: 'Compte de dépôt BoCom',
            monthlyFee: '0 CNY',
            cardType: 'UnionPay Debit',
            minimumDeposit: '10 CNY',
            withdrawalLimit: '20 000 CNY/jour',
            features: [
              'Service en anglais à Pékin, Shanghai et Canton',
              'Carte UnionPay et paiement mobile',
              'Change de devises au guichet',
            ],
            requirements: [
              'Passeport et visa étudiant',
              'Permis de séjour ou enregistrement de police',
              "Attestation d'inscription universitaire",
              'Numéro de téléphone chinois',
            ],
            studentPerks: [
              'Plafonds de change adaptés aux transferts familiaux',
              'Aucun frais de tenue de compte',
            ],
          },
        ],
      },
    ],
  },
];

/** Banques fictives du seed d'origine, remplacées par les vraies enseignes. */
const LEGACY_FICTIONAL = ['UK Student Bank', 'Deutsche Student Bank', 'Banque Étudiante'];

async function main() {
  // Parité avec le catalogue des pays d'études : une fiche rattachée à un pays hors
  // catalogue serait invisible dans l'admin (le sélecteur y est borné).
  const offCatalog = catalog.map(b => b.country).filter(c => !studyCountriesSeed.includes(c));
  if (offCatalog.length > 0) {
    throw new Error(`Pays hors catalogue d'études : ${offCatalog.join(', ')}`);
  }

  let created = 0;
  let updated = 0;
  let accounts = 0;

  for (const block of catalog) {
    for (const bank of block.banks) {
      const accountTypes = bank.accounts.map(a => ({
        name: a.name,
        features: a.features,
        monthlyFee: a.monthlyFee,
        requirements: a.requirements,
        minimumDeposit: a.minimumDeposit,
        cardType: a.cardType,
        withdrawalLimit: a.withdrawalLimit,
        onlineBanking: a.onlineBanking ?? true,
        studentPerks: a.studentPerks,
      }));
      accounts += accountTypes.length;

      const data = {
        name: bank.name,
        country: block.country,
        description: bank.description,
        isActive: true,
      };

      const existing = await prisma.bank.findFirst({
        where: { name: bank.name, country: block.country },
      });

      if (existing) {
        // Les comptes se remplacent en bloc : un diff partiel créerait des doublons.
        await prisma.bank.update({
          where: { id: existing.id },
          data: { ...data, accountTypes: { deleteMany: {}, create: accountTypes } },
        });
        updated++;
      } else {
        await prisma.bank.create({
          data: { ...data, accountTypes: { create: accountTypes } },
        });
        created++;
      }
    }
    console.log(`  ${block.country.padEnd(16)} ${block.banks.length} banque(s)`);
  }

  const removed = await prisma.bank.deleteMany({ where: { name: { in: LEGACY_FICTIONAL } } });

  const total = await prisma.bank.count();
  const totalAccounts = await prisma.bankAccountType.count();
  console.log(
    `\n✅ ${created} banque(s) créée(s), ${updated} mise(s) à jour, ${accounts} compte(s) décrits.` +
      `\n🗑️  ${removed.count} banque(s) fictive(s) supprimée(s).` +
      `\n📊 Base : ${total} banques / ${totalAccounts} comptes sur ${catalog.length} pays d'études.`
  );
}

main()
  .catch(e => {
    console.error('❌ Seed banques :', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
