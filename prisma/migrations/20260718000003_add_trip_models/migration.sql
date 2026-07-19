-- Epic 7 (Espace voyage) : gestion des trips multi-destination + services + checklist.
-- Stories 7.1 Trip/TripDestination/TripService, 7.4 TripChecklistItem.

CREATE TABLE "trips" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planning',
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "last_reminder_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "trips_user_id_idx" ON "trips"("user_id");
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "trip_destinations" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "arrival_date" TIMESTAMP(3),
    "departure_date" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trip_destinations_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "trip_destinations_trip_id_idx" ON "trip_destinations"("trip_id");
ALTER TABLE "trip_destinations" ADD CONSTRAINT "trip_destinations_trip_id_fkey"
    FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "trip_services" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "destination_id" INTEGER,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trip_services_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "trip_services_trip_id_idx" ON "trip_services"("trip_id");
ALTER TABLE "trip_services" ADD CONSTRAINT "trip_services_trip_id_fkey"
    FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trip_services" ADD CONSTRAINT "trip_services_destination_id_fkey"
    FOREIGN KEY ("destination_id") REFERENCES "trip_destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "trip_checklist_items" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT,
    "is_done" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trip_checklist_items_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "trip_checklist_items_trip_id_idx" ON "trip_checklist_items"("trip_id");
ALTER TABLE "trip_checklist_items" ADD CONSTRAINT "trip_checklist_items_trip_id_fkey"
    FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
