/*
  Warnings:

  - You are about to drop the column `accessToken` on the `guardian` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `guardian` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `guardian` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `guardian` table. All the data in the column will be lost.
  - You are about to drop the column `verificationTokenCreatedAt` on the `guardian` table. All the data in the column will be lost.
  - You are about to drop the `Pet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Specie` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `first_name` to the `guardian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `guardian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verification_token` to the `guardian` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_guardianId_fkey";

-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_specieId_fkey";

-- AlterTable
ALTER TABLE "guardian" DROP COLUMN "accessToken",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "verificationToken",
DROP COLUMN "verificationTokenCreatedAt",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "verification_token" TEXT NOT NULL,
ADD COLUMN     "verification_token_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Pet";

-- DropTable
DROP TABLE "Specie";

-- CreateTable
CREATE TABLE "pet" (
    "id" TEXT NOT NULL,
    "guardian_id" TEXT NOT NULL,
    "specie_id" TEXT NOT NULL,
    "specie_alias" TEXT,

    CONSTRAINT "pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "specie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "specie_name_key" ON "specie"("name");

-- AddForeignKey
ALTER TABLE "pet" ADD CONSTRAINT "pet_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "guardian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet" ADD CONSTRAINT "pet_specie_id_fkey" FOREIGN KEY ("specie_id") REFERENCES "specie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
