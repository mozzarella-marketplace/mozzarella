-- CreateEnum
CREATE TYPE "CustomerCategory" AS ENUM ('smallBusiness', 'ticketingSystems', 'managementAndData');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "ProgrammingLanguage" AS ENUM ('java', 'csharp');

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "category" "CustomerCategory" NOT NULL,
    "domain" TEXT NOT NULL,
    "language" "ProgrammingLanguage" NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL,
    "reward_coins" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "iteration_count" INTEGER NOT NULL,
    "estimated_minutes" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "keycloak_user_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customers_is_active_idx" ON "customers"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "users_keycloak_user_id_key" ON "users"("keycloak_user_id");

-- CreateIndex
CREATE INDEX "users_class_id_idx" ON "users"("class_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_class_id_user_id_key" ON "users"("class_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "classes_class_id_key" ON "classes"("class_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;
