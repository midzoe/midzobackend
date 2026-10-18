-- AlterTable
ALTER TABLE "contact_messages" ADD COLUMN     "replied_at" TIMESTAMP(3),
ADD COLUMN     "replies" JSONB;

-- AlterTable
ALTER TABLE "premium_cases" ADD COLUMN     "client_message" TEXT,
ADD COLUMN     "next_step" TEXT;

-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "installments" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "installments_paid" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "method" TEXT NOT NULL DEFAULT 'stripe',
ADD COLUMN     "note" TEXT,
ADD COLUMN     "offer_id" TEXT,
ADD COLUMN     "offer_label" TEXT,
ADD COLUMN     "paid_invoice_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "recorded_by" INTEGER,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "stripe_subscription_id" TEXT,
ADD COLUMN     "trip_id" INTEGER;

-- AlterTable
ALTER TABLE "trip_services" ADD COLUMN     "document_url" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "created_by_admin_id" INTEGER;

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER,
    "admin_name" TEXT,
    "action" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" INTEGER,
    "user_id" INTEGER,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_audit_logs_user_id_idx" ON "admin_audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "admin_audit_logs_created_at_idx" ON "admin_audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_stripe_subscription_id_key" ON "purchases"("stripe_subscription_id");


-- Achats déjà payés avant l'échelonnement : une échéance encaissée.
UPDATE "purchases" SET "installments_paid" = 1 WHERE "status" = 'paid';
