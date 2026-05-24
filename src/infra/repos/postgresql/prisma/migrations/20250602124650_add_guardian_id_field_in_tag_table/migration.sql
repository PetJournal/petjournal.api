/*
  Warnings:

  - Added the required column `guardian_id` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "guardian_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
