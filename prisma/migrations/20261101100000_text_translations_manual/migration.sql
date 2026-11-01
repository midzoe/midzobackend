-- Traductions corrigées à la main en admin (jamais remplacées par DeepL) et origine de chaque
-- traduction (le plafond mensuel ne compte que la traduction automatique).
ALTER TABLE "text_translations" ADD COLUMN "manual" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "text_translations" ADD COLUMN "via" VARCHAR(10) NOT NULL DEFAULT 'script';
ALTER TABLE "text_translations" ADD COLUMN "updated_by" INTEGER;
ALTER TABLE "text_translations" ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "text_translations_lang_manual_idx" ON "text_translations"("lang", "manual");
