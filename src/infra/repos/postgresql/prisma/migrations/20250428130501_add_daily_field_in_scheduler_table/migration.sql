/*
  Warnings:

  - Added the required column `daily` to the `schedulers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedulers" ADD COLUMN     "daily" BOOLEAN NOT NULL;
