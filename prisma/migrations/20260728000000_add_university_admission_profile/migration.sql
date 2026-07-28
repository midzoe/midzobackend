-- Story 5.13 : profil d'admission d'une université.
-- `minimum_grade` est du texte et non un nombre : une note plancher ne veut rien
-- dire hors de son système de notation (mention au bac /20, GPA /4.0, A-levels
-- A*AA, Numerus Clausus allemand, score Gaokao…). On stocke la valeur telle
-- qu'elle est publiée par l'établissement.
ALTER TABLE "universities" ADD COLUMN "minimum_grade" TEXT;
ALTER TABLE "universities" ADD COLUMN "admission_requirements" TEXT;
