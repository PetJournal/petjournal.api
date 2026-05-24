/*
  Warnings:

  - Added the required column `breed_alias` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "breed_alias" TEXT NOT NULL;
