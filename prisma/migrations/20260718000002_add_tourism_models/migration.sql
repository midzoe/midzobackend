-- Epic 6 (Tourisme ciblé) : programmes à destination fixe (safari/sport), événements, partenaires.
-- Story 6.1 TourismProgram, 6.2 TourismEvent, 6.3 Partner (clics trackés).

-- 6.1 : programmes tourisme (safari, sport) avec destination fixe + itinéraire/transport.
CREATE TABLE "tourism_programs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "description" TEXT,
    "itinerary" TEXT,
    "transport" TEXT,
    "price" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "images" JSONB,
    "is_validated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tourism_programs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "tourism_programs_subcategory_idx" ON "tourism_programs"("subcategory");

-- 6.2 : événements tourisme (publiés / à venir).
CREATE TABLE "tourism_events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "country" TEXT,
    "city" TEXT,
    "location" TEXT,
    "start_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "link" TEXT,
    "image_url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tourism_events_pkey" PRIMARY KEY ("id")
);

-- 6.3 : partenaires (redirection trackée pour le tourisme global).
CREATE TABLE "partners" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "url" TEXT NOT NULL,
    "logo_url" TEXT,
    "description" TEXT,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "partners_category_idx" ON "partners"("category");
