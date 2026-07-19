-- Story 4.1 : base d'ambassades par pays (nom, localisation, lien), requêtable par pays.
-- `country` = nom du pays (cohérent avec visas.origin_country / destination_country, pas d'FK).

CREATE TABLE "embassies" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "link" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "embassies_pkey" PRIMARY KEY ("id")
);

-- Requête "par pays" (AC #3) : index sur country.
CREATE INDEX "embassies_country_idx" ON "embassies"("country");
