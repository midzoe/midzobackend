-- AlterTable
ALTER TABLE "categories" ADD COLUMN "is_public" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "categories" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "services" ADD COLUMN "display_name" TEXT;
ALTER TABLE "services" ADD COLUMN "translation_key" TEXT;
ALTER TABLE "services" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "uq_service_categoryId_name" ON "services"("category_id", "name");
