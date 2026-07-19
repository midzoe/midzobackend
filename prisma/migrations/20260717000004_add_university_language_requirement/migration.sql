-- Story 5.3 : exigence de langue par université (langue + niveau CEFR), comparée au profil.
-- Deux colonnes nullables : une université sans exigence reste valide (met = true).

ALTER TABLE "universities" ADD COLUMN "required_language" TEXT;
ALTER TABLE "universities" ADD COLUMN "required_language_level" TEXT;
