-- Epic 10 — Story 10.1 : ressources d'orientation

-- CreateTable
CREATE TABLE "orientation_resources" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "provider" TEXT,
    "link" TEXT,
    "location" TEXT,
    "image_url" TEXT,
    "is_validated" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orientation_resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "orientation_resources_type_idx" ON "orientation_resources"("type");

-- CreateIndex
CREATE INDEX "orientation_resources_category_idx" ON "orientation_resources"("category");
