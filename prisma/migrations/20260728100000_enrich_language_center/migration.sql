-- Story 5.14 : fiche détaillée d'un centre de langue.
-- Le modèle d'origine (story 5.4) ne portait que nom / pays / ville / langue / niveaux /
-- lien : trop pauvre pour qu'un étudiant choisisse un centre. On ajoute le contact, le
-- contenu pédagogique (niveaux, formats, examens préparés), le tarif indicatif et les
-- services décisifs pour un dossier d'études (lettre pour le visa, logement, passerelle
-- universitaire type Studienkolleg).
ALTER TABLE "language_centers" ADD COLUMN "description" TEXT;
ALTER TABLE "language_centers" ADD COLUMN "address" TEXT;
ALTER TABLE "language_centers" ADD COLUMN "email" TEXT;
ALTER TABLE "language_centers" ADD COLUMN "phone" TEXT;
ALTER TABLE "language_centers" ADD COLUMN "registration_url" TEXT;
ALTER TABLE "language_centers" ADD COLUMN "image" TEXT;
-- Tableaux sans DEFAULT : DDL canonique de Prisma pour `String[]`. La table est vide à
-- cette date, aucune ligne à rattraper.
ALTER TABLE "language_centers" ADD COLUMN "levels_offered" TEXT[];
ALTER TABLE "language_centers" ADD COLUMN "course_types" TEXT[];
ALTER TABLE "language_centers" ADD COLUMN "exams_prepared" TEXT[];
ALTER TABLE "language_centers" ADD COLUMN "accreditations" TEXT[];
ALTER TABLE "language_centers" ADD COLUMN "university_partners" TEXT[];
ALTER TABLE "language_centers" ADD COLUMN "price_from" DOUBLE PRECISION;
ALTER TABLE "language_centers" ADD COLUMN "price_unit" TEXT;
ALTER TABLE "language_centers" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'EUR';
ALTER TABLE "language_centers" ADD COLUMN "weekly_hours" INTEGER;
ALTER TABLE "language_centers" ADD COLUMN "class_size" INTEGER;
ALTER TABLE "language_centers" ADD COLUMN "start_dates" TEXT;
ALTER TABLE "language_centers" ADD COLUMN "offers_visa_support" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "language_centers" ADD COLUMN "offers_accommodation" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "language_centers" ADD COLUMN "offers_pathway" BOOLEAN NOT NULL DEFAULT false;

-- Gate de publication : la table est vide à cette date, les fiches existantes n'ont donc
-- pas à être rattrapées ; le seed pose is_validated = true sur le catalogue de départ.
ALTER TABLE "language_centers" ADD COLUMN "is_validated" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "language_centers_is_validated_idx" ON "language_centers"("is_validated");
