/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Specie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Specie_name_key" ON "Specie"("name");
