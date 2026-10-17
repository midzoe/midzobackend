-- Parcours Study (UAT) : uniquement des ajouts, rien de supprimé ni renommé.

-- Mot de passe oublié
ALTER TABLE "users" ADD COLUMN "password_reset_code" TEXT;
ALTER TABLE "users" ADD COLUMN "password_reset_expiry" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "password_reset_sent_at" TIMESTAMP(3);

-- Statut public / privé des universités
ALTER TABLE "universities" ADD COLUMN "is_public" BOOLEAN;

-- Langues d'enseignement et formats par programme
ALTER TABLE "university_programs" ADD COLUMN "teaching_languages" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "university_programs" ADD COLUMN "formats" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Offres de formation professionnelle (Ausbildung)
CREATE TABLE "vocational_trainings" (
    "id" SERIAL NOT NULL,
    "occupation" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "employer" TEXT NOT NULL,
    "employer_type" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "duration_months" INTEGER,
    "language_level" TEXT,
    "salary" TEXT,
    "start_dates" TEXT[],
    "requirements" TEXT[],
    "documents" TEXT[],
    "description" TEXT,
    "application_url" TEXT,
    "is_validated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocational_trainings_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "vocational_trainings_country_idx" ON "vocational_trainings"("country");
CREATE INDEX "vocational_trainings_domain_idx" ON "vocational_trainings"("domain");
