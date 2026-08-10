-- Story 4.7 : la fiche visa porte désormais tout ce qu'une personne doit savoir et
-- fournir pour obtenir le visa (dossier obligatoire, conditions personnelles,
-- procédure de dépôt, motifs de refus), et une route peut porter une fiche par type
-- de visa (étudiant, tourisme, travail…).

-- 1. `visa_type` devient obligatoire et entre dans la clé d'unicité de la route.
UPDATE "visas" SET "visa_type" = 'Étudiant' WHERE "visa_type" IS NULL OR "visa_type" = '';
ALTER TABLE "visas" ALTER COLUMN "visa_type" SET DEFAULT 'Étudiant';
ALTER TABLE "visas" ALTER COLUMN "visa_type" SET NOT NULL;

DROP INDEX IF EXISTS "visas_origin_country_destination_country_key";
CREATE UNIQUE INDEX "visas_origin_country_destination_country_visa_type_key"
  ON "visas"("origin_country", "destination_country", "visa_type");
CREATE INDEX "visas_destination_country_idx" ON "visas"("destination_country");

-- 2. Coûts & délais.
ALTER TABLE "visas" ADD COLUMN "currency" TEXT DEFAULT 'EUR';
ALTER TABLE "visas" ADD COLUMN "visa_validity" TEXT;
ALTER TABLE "visas" ADD COLUMN "entries_type" TEXT;
ALTER TABLE "visas" ADD COLUMN "max_stay" TEXT;

-- 3. Dossier obligatoire.
ALTER TABLE "visas" ADD COLUMN "passport_validity" TEXT;
ALTER TABLE "visas" ADD COLUMN "photo_spec" TEXT;
ALTER TABLE "visas" ADD COLUMN "application_form_url" TEXT;

-- 4. Conditions personnelles à prouver.
ALTER TABLE "visas" ADD COLUMN "funds_amount" TEXT;
ALTER TABLE "visas" ADD COLUMN "proof_of_funds" TEXT;
ALTER TABLE "visas" ADD COLUMN "accommodation_proof" TEXT;
ALTER TABLE "visas" ADD COLUMN "insurance_required" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "visas" ADD COLUMN "insurance_min_coverage" TEXT;
ALTER TABLE "visas" ADD COLUMN "language_requirement" TEXT;
ALTER TABLE "visas" ADD COLUMN "admission_letter_required" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "visas" ADD COLUMN "guarantor_required" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "visas" ADD COLUMN "criminal_record_required" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "visas" ADD COLUMN "medical_exam_required" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "visas" ADD COLUMN "vaccinations" TEXT;
ALTER TABLE "visas" ADD COLUMN "return_ticket_required" BOOLEAN NOT NULL DEFAULT false;

-- 5. Procédure de dépôt.
ALTER TABLE "visas" ADD COLUMN "where_to_apply" TEXT;
ALTER TABLE "visas" ADD COLUMN "appointment_url" TEXT;
ALTER TABLE "visas" ADD COLUMN "biometrics_required" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "visas" ADD COLUMN "interview_required" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "visas" ADD COLUMN "application_steps" JSONB;

-- 6. À savoir + gate de publication.
ALTER TABLE "visas" ADD COLUMN "common_refusal_reasons" JSONB;
ALTER TABLE "visas" ADD COLUMN "official_source_url" TEXT;
ALTER TABLE "visas" ADD COLUMN "last_verified_at" TIMESTAMP(3);
ALTER TABLE "visas" ADD COLUMN "is_validated" BOOLEAN NOT NULL DEFAULT false;
