/*
  Warnings:

  - You are about to drop the column `otherAlias` on the `Specie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "specieAlias" TEXT;

-- AlterTable
ALTER TABLE "Specie" DROP COLUMN "otherAlias";
