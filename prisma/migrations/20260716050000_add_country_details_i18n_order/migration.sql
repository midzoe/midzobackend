-- Story 1.6 : traductions fr/de + ordre d'affichage curaté sur les fiches pays.

-- Country : `order` = position dans la liste des pays d'études (Hero) ; `translations` = { fr: { motto, history, modernLife }, de: {...} }
ALTER TABLE "countries" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "countries" ADD COLUMN "translations" JSONB;

ALTER TABLE "country_quick_facts" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "country_quick_facts" ADD COLUMN "translations" JSONB;

ALTER TABLE "country_traditions" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "country_traditions" ADD COLUMN "translations" JSONB;

ALTER TABLE "country_cuisine" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "country_cuisine" ADD COLUMN "translations" JSONB;

ALTER TABLE "country_places" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "country_places" ADD COLUMN "translations" JSONB;

ALTER TABLE "country_trends" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "country_trends" ADD COLUMN "translations" JSONB;
