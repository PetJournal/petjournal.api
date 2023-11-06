/*
  Warnings:

  - You are about to drop the `guardian` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `specie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "pet" DROP CONSTRAINT "pet_guardian_id_fkey";

-- DropForeignKey
ALTER TABLE "pet" DROP CONSTRAINT "pet_specie_id_fkey";

-- DropTable
DROP TABLE "guardian";

-- DropTable
DROP TABLE "pet";

-- DropTable
DROP TABLE "specie";

-- CreateTable
CREATE TABLE "guardians" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "access_token" TEXT,
    "verification_token" TEXT NOT NULL,
    "verification_token_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guardians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "guardian_id" TEXT NOT NULL,
    "specie_id" TEXT NOT NULL,
    "specie_alias" TEXT,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "species" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guardians_email_key" ON "guardians"("email");

-- CreateIndex
CREATE UNIQUE INDEX "guardians_phone_key" ON "guardians"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "species_name_key" ON "species"("name");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_specie_id_fkey" FOREIGN KEY ("specie_id") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
