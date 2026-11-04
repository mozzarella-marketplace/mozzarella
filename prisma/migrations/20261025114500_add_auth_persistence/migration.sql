-- Create the application role enum for pseudonymous user mappings.
CREATE TYPE "UserRole" AS ENUM ('student', 'teacher');

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "keycloak_user_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classes_class_id_key" ON "classes"("class_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_keycloak_user_id_key" ON "users"("keycloak_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_class_id_user_id_key" ON "users"("class_id", "user_id");

-- CreateIndex
CREATE INDEX "users_class_id_idx" ON "users"("class_id");
