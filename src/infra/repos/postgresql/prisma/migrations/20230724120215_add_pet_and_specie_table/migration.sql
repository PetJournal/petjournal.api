-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "guardianId" TEXT NOT NULL,
    "specieId" TEXT NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "otherAlias" TEXT,

    CONSTRAINT "Specie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "guardian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_specieId_fkey" FOREIGN KEY ("specieId") REFERENCES "Specie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
