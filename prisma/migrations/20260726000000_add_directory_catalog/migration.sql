-- CreateTable
CREATE TABLE "flights" (
    "id" SERIAL NOT NULL,
    "airline" TEXT NOT NULL,
    "from_country" TEXT NOT NULL,
    "from_city" TEXT NOT NULL,
    "to_country" TEXT NOT NULL,
    "to_city" TEXT NOT NULL,
    "departure" TEXT NOT NULL,
    "arrival" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "audience" TEXT NOT NULL DEFAULT 'general',
    "duration" TEXT,
    "stops" INTEGER NOT NULL DEFAULT 0,
    "baggage" TEXT,
    "features" JSONB,
    "image" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_plans" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "audience" TEXT NOT NULL DEFAULT 'general',
    "coverage_types" JSONB,
    "benefits" JSONB,
    "insurance_types" JSONB,
    "monthly_premium" TEXT,
    "coverage" TEXT,
    "rating" DOUBLE PRECISION,
    "reviews" INTEGER,
    "image" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_account_types" (
    "id" SERIAL NOT NULL,
    "bank_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "features" JSONB,
    "monthly_fee" TEXT,
    "requirements" JSONB,
    "minimum_deposit" TEXT,
    "card_type" TEXT,
    "withdrawal_limit" TEXT,
    "online_banking" BOOLEAN NOT NULL DEFAULT true,
    "student_perks" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_account_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tourist_sites" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "rating" DOUBLE PRECISION,
    "reviews" INTEGER,
    "price" TEXT,
    "features" JSONB,
    "image" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tourist_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "location" TEXT NOT NULL,
    "cuisine" TEXT NOT NULL,
    "price_range" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "reviews" INTEGER,
    "features" JSONB,
    "image" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tourism_accommodations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price_range" TEXT NOT NULL,
    "amenities" JSONB,
    "rating" DOUBLE PRECISION,
    "reviews" INTEGER,
    "description" TEXT,
    "image" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tourism_accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "salary" TEXT,
    "experience" TEXT,
    "description" TEXT,
    "requirements" JSONB,
    "benefits" JSONB,
    "apply_url" TEXT,
    "image" TEXT,
    "posted_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainings" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "course" TEXT NOT NULL,
    "duration" TEXT,
    "price" TEXT,
    "certification" TEXT,
    "category" TEXT,
    "rating" DOUBLE PRECISION,
    "reviews" INTEGER,
    "features" JSONB,
    "image" TEXT,
    "description" TEXT,
    "link" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_providers" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "service_type" TEXT NOT NULL,
    "services" JSONB,
    "visa_types" JSONB,
    "accepted_degrees" JSONB,
    "document_types" JSONB,
    "processing_time" TEXT,
    "price" TEXT,
    "requirements" JSONB,
    "features" JSONB,
    "success_rate" TEXT,
    "rating" DOUBLE PRECISION,
    "link" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flights_audience_idx" ON "flights"("audience");

-- CreateIndex
CREATE INDEX "flights_from_country_idx" ON "flights"("from_country");

-- CreateIndex
CREATE INDEX "flights_to_country_idx" ON "flights"("to_country");

-- CreateIndex
CREATE INDEX "insurance_plans_audience_idx" ON "insurance_plans"("audience");

-- CreateIndex
CREATE INDEX "insurance_plans_country_idx" ON "insurance_plans"("country");

-- CreateIndex
CREATE INDEX "banks_country_idx" ON "banks"("country");

-- CreateIndex
CREATE INDEX "bank_account_types_bank_id_idx" ON "bank_account_types"("bank_id");

-- CreateIndex
CREATE INDEX "tourist_sites_country_idx" ON "tourist_sites"("country");

-- CreateIndex
CREATE INDEX "tourist_sites_category_idx" ON "tourist_sites"("category");

-- CreateIndex
CREATE INDEX "restaurants_country_idx" ON "restaurants"("country");

-- CreateIndex
CREATE INDEX "restaurants_cuisine_idx" ON "restaurants"("cuisine");

-- CreateIndex
CREATE INDEX "tourism_accommodations_country_idx" ON "tourism_accommodations"("country");

-- CreateIndex
CREATE INDEX "tourism_accommodations_city_idx" ON "tourism_accommodations"("city");

-- CreateIndex
CREATE INDEX "jobs_country_idx" ON "jobs"("country");

-- CreateIndex
CREATE INDEX "jobs_type_idx" ON "jobs"("type");

-- CreateIndex
CREATE INDEX "trainings_country_idx" ON "trainings"("country");

-- CreateIndex
CREATE INDEX "trainings_category_idx" ON "trainings"("category");

-- CreateIndex
CREATE INDEX "service_providers_service_type_idx" ON "service_providers"("service_type");

-- CreateIndex
CREATE INDEX "service_providers_country_idx" ON "service_providers"("country");

-- AddForeignKey
ALTER TABLE "bank_account_types" ADD CONSTRAINT "bank_account_types_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

