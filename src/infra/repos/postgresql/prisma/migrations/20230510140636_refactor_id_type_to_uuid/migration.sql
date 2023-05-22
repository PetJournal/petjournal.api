/*
  Warnings:

  - The primary key for the `guardian` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "guardian" DROP CONSTRAINT "guardian_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "guardian_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "guardian_id_seq";
