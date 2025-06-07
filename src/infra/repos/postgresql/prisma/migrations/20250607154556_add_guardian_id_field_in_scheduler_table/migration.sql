/*
  Warnings:

  - Added the required column `guardian_id` to the `schedulers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedulers" ADD COLUMN     "guardian_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "schedulers" ADD CONSTRAINT "schedulers_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
