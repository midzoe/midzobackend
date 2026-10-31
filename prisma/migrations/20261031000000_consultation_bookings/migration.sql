-- CreateTable
CREATE TABLE "consultation_bookings" (
    "id" SERIAL NOT NULL,
    "slot_start" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "purchase_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'held',
    "hold_until" TIMESTAMP(3),
    "client_timezone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "consultation_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consultation_bookings_slot_start_key" ON "consultation_bookings"("slot_start");
CREATE UNIQUE INDEX "consultation_bookings_purchase_id_key" ON "consultation_bookings"("purchase_id");
CREATE INDEX "consultation_bookings_status_hold_until_idx" ON "consultation_bookings"("status", "hold_until");

-- AddForeignKey
ALTER TABLE "consultation_bookings" ADD CONSTRAINT "consultation_bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "consultation_bookings" ADD CONSTRAINT "consultation_bookings_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
