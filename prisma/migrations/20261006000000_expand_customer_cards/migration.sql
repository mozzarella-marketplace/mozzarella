-- Existing rows are seeded mock customers that cannot satisfy the new required columns; the seed recreates them.
DELETE FROM "customers";

-- CreateEnum
CREATE TYPE "CustomerCategory" AS ENUM ('smallBusiness', 'ticketingSystems', 'managementAndData');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "ProgrammingLanguage" AS ENUM ('java', 'csharp');

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "persona",
ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "category" "CustomerCategory" NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "difficulty" "DifficultyLevel" NOT NULL,
ADD COLUMN     "domain" TEXT NOT NULL,
ADD COLUMN     "estimated_minutes" INTEGER NOT NULL,
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "iteration_count" INTEGER NOT NULL,
ADD COLUMN     "language" "ProgrammingLanguage" NOT NULL,
ADD COLUMN     "reward_coins" INTEGER NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "topic" TEXT NOT NULL;

-- DropEnum
DROP TYPE "CustomerPersona";

