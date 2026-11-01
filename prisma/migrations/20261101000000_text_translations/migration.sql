-- Mémoire de traduction du contenu du catalogue (DeepL).
CREATE TABLE "text_translations" (
    "id" SERIAL NOT NULL,
    "source_hash" VARCHAR(64) NOT NULL,
    "lang" VARCHAR(5) NOT NULL,
    "source" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "text_translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "text_translations_source_hash_lang_key" ON "text_translations"("source_hash", "lang");
