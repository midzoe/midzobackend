-- Catalogue de services administrable : étapes éditables + masquage sans suppression.
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "steps" JSONB;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT true;
