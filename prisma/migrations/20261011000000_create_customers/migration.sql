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

-- CreateIndex
CREATE INDEX "customers_is_active_idx" ON "customers"("is_active");

-- Keep updated_at current for every writer, including SQL and the Supabase dashboard, not only Prisma Client.
CREATE FUNCTION "set_updated_at"() RETURNS TRIGGER AS $$
BEGIN
    NEW."updated_at" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "customers_set_updated_at"
BEFORE UPDATE ON "customers"
FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();
