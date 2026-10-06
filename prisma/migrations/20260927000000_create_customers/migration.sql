-- CreateEnum
CREATE TYPE "CustomerPersona" AS ENUM ('restaurantOwner', 'storeOwner', 'clinicManager', 'gymOwner', 'libraryManager');

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "persona" "CustomerPersona" NOT NULL,
    "summary" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customers_is_active_idx" ON "customers"("is_active");
