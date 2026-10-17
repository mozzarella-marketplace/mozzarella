-- AlterTable
ALTER TABLE "customers" DROP COLUMN "is_featured",
DROP COLUMN "iteration_count",
DROP COLUMN "language";

-- DropEnum
DROP TYPE "ProgrammingLanguage";

