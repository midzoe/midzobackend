-- Story 5.5 : tracer la source d'un pays d'étude (ex. « ai:claude-opus-4-8 » pour un
-- brouillon généré par IA, NULL pour une saisie manuelle). Additif, nullable.

ALTER TABLE "study_countries" ADD COLUMN "source" TEXT;
