-- AlterTable
ALTER TABLE "_PetScheduler" ADD CONSTRAINT "_PetScheduler_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PetScheduler_AB_unique";
