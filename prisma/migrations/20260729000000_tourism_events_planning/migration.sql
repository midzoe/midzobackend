-- Story 6.8 : programmation annuelle des événements tourisme.
--
-- L'écran admin passe d'une liste plate à un plan par pays : chaque pays de tourisme
-- doit porter un nombre d'événements par an (3 aujourd'hui, réglable). L'événement
-- gagne donc l'année de programmation, sa sous-catégorie, et de quoi décider :
-- fenêtre de dates, prix d'appel, ce que l'offre inclut, notes internes.
ALTER TABLE "tourism_events" ADD COLUMN "subcategory" TEXT;
ALTER TABLE "tourism_events" ADD COLUMN "year" INTEGER;
ALTER TABLE "tourism_events" ADD COLUMN "end_date" TIMESTAMP(3);
-- Une date reprise d'une édition précédente n'est pas une date confirmée : le drapeau
-- rend la distinction visible au lieu de la laisser dans un commentaire.
ALTER TABLE "tourism_events" ADD COLUMN "dates_confirmed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "tourism_events" ADD COLUMN "price_from" DOUBLE PRECISION;
ALTER TABLE "tourism_events" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'EUR';
ALTER TABLE "tourism_events" ADD COLUMN "capacity" INTEGER;
ALTER TABLE "tourism_events" ADD COLUMN "audience" TEXT;
ALTER TABLE "tourism_events" ADD COLUMN "offer_includes" TEXT[];
ALTER TABLE "tourism_events" ADD COLUMN "highlights" TEXT[];
ALTER TABLE "tourism_events" ADD COLUMN "internal_notes" TEXT;

CREATE INDEX IF NOT EXISTS "tourism_events_country_idx" ON "tourism_events"("country");
CREATE INDEX IF NOT EXISTS "tourism_events_year_idx" ON "tourism_events"("year");

-- Réglages éditoriaux (clé/valeur). Le quota d'événements par pays et par an y vit,
-- pour se régler depuis l'admin sans redéploiement.
CREATE TABLE "app_settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("key")
);

INSERT INTO "app_settings" ("key", "value", "updated_at")
VALUES ('tourism.events_required_per_country_per_year', '3', NOW())
ON CONFLICT ("key") DO NOTHING;
