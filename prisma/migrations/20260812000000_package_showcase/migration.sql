-- Grille commerciale des packages (flyer « MIDZOE PACKAGES »).
--
-- La table `packages` portait jusqu'ici uniquement les packages du MOTEUR DE DEVIS
-- (Study / Tourism / Orientation / Full Package Top, story 3.2) : un nom, un prix de base
-- et des catégories. Le flyer vend autre chose : des PALIERS figés (Starter → All-Inclusive,
-- Escape → Ultimate, Mix Essential → Mix XXL, consultation) avec un prix d'appel et une
-- liste d'avantages.
--
-- Les deux natures cohabitent dans la même table, séparées par `family` :
--   family IS NULL     => package du moteur de devis (comportement inchangé)
--   family IS NOT NULL => palier de la vitrine publique (jamais mêlé au calcul du devis)
-- Les 4 lignes existantes gardent donc family = NULL et ne changent pas de comportement.

ALTER TABLE "packages" ADD COLUMN "family" TEXT;
ALTER TABLE "packages" ADD COLUMN "slug" TEXT;
ALTER TABLE "packages" ADD COLUMN "tagline" TEXT;
ALTER TABLE "packages" ADD COLUMN "service_label" TEXT;
-- Montant en CENTIMES, comme base_price_cents : aucun flottant sur un prix.
ALTER TABLE "packages" ADD COLUMN "price_from_cents" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "packages" ADD COLUMN "billing_period" TEXT NOT NULL DEFAULT 'once';
ALTER TABLE "packages" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'EUR';
-- Tableau sans DEFAULT : DDL canonique de Prisma pour `String[]`.
ALTER TABLE "packages" ADD COLUMN "features" TEXT[];
ALTER TABLE "packages" ADD COLUMN "badge" TEXT;
ALTER TABLE "packages" ADD COLUMN "is_highlighted" BOOLEAN NOT NULL DEFAULT false;

-- Le slug sert de cible de lien (CTA « Choisir ») : deux paliers ne peuvent pas le partager.
-- NULL reste autorisé et répétable en Postgres — les packages du devis n'en ont pas.
CREATE UNIQUE INDEX IF NOT EXISTS "packages_slug_key" ON "packages"("slug");

-- Lecture dominante de la vitrine : « les paliers d'une famille, dans l'ordre ».
CREATE INDEX IF NOT EXISTS "packages_family_order_idx" ON "packages"("family", "order");
