-- Grille tarifaire (18/10/2026) : ajouts uniquement.
ALTER TABLE "packages" ADD COLUMN "min_services" INTEGER;
ALTER TABLE "packages" ADD COLUMN "max_services" INTEGER;
ALTER TABLE "packages" ADD COLUMN "value_cap_cents" INTEGER;

CREATE TABLE "priced_services" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "complexity" TEXT,
    "price_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "priced_services_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "priced_services_code_key" ON "priced_services"("code");
CREATE INDEX "priced_services_family_order_idx" ON "priced_services"("family", "order");
