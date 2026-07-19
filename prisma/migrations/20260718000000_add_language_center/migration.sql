-- Story 5.4 : centres de langue (potentiels partenaires) pour rediriger les étudiants
-- dont le niveau n'atteint pas l'exigence de langue d'une université (story 5.3 → UI 5.8).
-- `country`/`language` = chaînes libres cohérentes avec le catalogue (pas d'FK), vocabulaire FR (ex. « Anglais »).

CREATE TABLE "language_centers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "language" TEXT NOT NULL,
    "levels" TEXT,
    "link" TEXT,
    "is_partner" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "language_centers_pkey" PRIMARY KEY ("id")
);

-- Filtres publics (AC #2) : par langue et par pays.
CREATE INDEX "language_centers_language_idx" ON "language_centers"("language");
CREATE INDEX "language_centers_country_idx" ON "language_centers"("country");
