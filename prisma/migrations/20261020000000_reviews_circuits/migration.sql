-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "purchase_id" INTEGER,
    "author_name" TEXT NOT NULL,
    "country" TEXT,
    "service" TEXT NOT NULL,
    "destination" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "admin_reply" TEXT,
    "reject_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),
    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "tour_circuits" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "image" TEXT,
    "stops" JSONB NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "services" TEXT[],
    "highlights" TEXT[],
    "best_time" TEXT,
    "travelers_base" INTEGER NOT NULL DEFAULT 2,
    "translations" JSONB,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tour_circuits_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "reviews_status_published_at_idx" ON "reviews"("status", "published_at");
-- CreateIndex
CREATE INDEX "reviews_user_id_idx" ON "reviews"("user_id");
-- CreateIndex
CREATE UNIQUE INDEX "tour_circuits_slug_key" ON "tour_circuits"("slug");
-- CreateIndex
CREATE INDEX "tour_circuits_is_published_order_idx" ON "tour_circuits"("is_published", "order");
-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
