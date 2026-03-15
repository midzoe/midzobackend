-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verification_code" TEXT,
ADD COLUMN     "verification_code_expiry" TIMESTAMP(3),
ADD COLUMN     "verification_code_sent_at" TIMESTAMP(3);
