/*
  Warnings:

  - Added the required column `gender` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pet_name` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "pet_name" TEXT NOT NULL;
