-- Story 4.2 : rattache une règle de visa à l'ambassade compétente (FK nullable).
-- ON DELETE SET NULL : supprimer une ambassade ne supprime pas la règle de visa.

ALTER TABLE "visas" ADD COLUMN "embassy_id" INTEGER;

ALTER TABLE "visas" ADD CONSTRAINT "visas_embassy_id_fkey" FOREIGN KEY ("embassy_id") REFERENCES "embassies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
