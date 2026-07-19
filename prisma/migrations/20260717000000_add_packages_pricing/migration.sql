-- Story 3.1 : packages premium + config tarifaire.
-- Montants en CENTIMES entiers (pas de flottant : arrondis sur les remises dégressives, et Stripe travaille en centimes).

CREATE TABLE "pricing_config" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "price_per_subcategory_cents" INTEGER NOT NULL DEFAULT 0,
    "discount_two_categories_pct" INTEGER NOT NULL DEFAULT 0,
    "discount_three_plus_categories_pct" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_config_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "packages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "base_price_cents" INTEGER NOT NULL DEFAULT 0,
    "price_per_subcategory_cents" INTEGER,
    "is_full_package" BOOLEAN NOT NULL DEFAULT false,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "packages_name_key" ON "packages"("name");

CREATE TABLE "package_categories" (
    "id" SERIAL NOT NULL,
    "package_id" INTEGER NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "package_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uq_package_category" ON "package_categories"("package_id", "category_id");

ALTER TABLE "package_categories" ADD CONSTRAINT "package_categories_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "package_categories" ADD CONSTRAINT "package_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
