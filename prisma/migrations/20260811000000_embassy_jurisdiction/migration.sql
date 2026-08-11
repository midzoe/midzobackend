-- Story 4.8 : l'ambassade compétente dépend du COUPLE (pays d'origine, destination).
-- « Togo → France » doit pointer sur l'ambassade de France à Lomé, « Sénégal → France »
-- sur celle de Dakar. Le modèle ne portait que le pays représenté : on ajoute le pays
-- d'accueil, la ville, l'adresse, le lien cartographique, le type de mission et la
-- liste des pays desservis quand il n'y a pas de représentation sur place.

ALTER TABLE "embassies" ADD COLUMN "host_country" TEXT;
ALTER TABLE "embassies" ADD COLUMN "city" TEXT;
ALTER TABLE "embassies" ADD COLUMN "address" TEXT;
ALTER TABLE "embassies" ADD COLUMN "maps_url" TEXT;
ALTER TABLE "embassies" ADD COLUMN "type" TEXT DEFAULT 'Ambassade';
ALTER TABLE "embassies" ADD COLUMN "covered_countries" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "embassies" ADD COLUMN "is_validated" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "embassies_host_country_idx" ON "embassies"("host_country");
