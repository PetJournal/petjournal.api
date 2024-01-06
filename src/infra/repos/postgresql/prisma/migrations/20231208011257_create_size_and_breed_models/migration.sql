-- CreateTable
CREATE TABLE "sizes" (
    "id" TEXT NOT NULL,
    "specie_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "breeds" (
    "id" TEXT NOT NULL,
    "specie_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "breeds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sizes_name_key" ON "sizes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "breeds_name_key" ON "breeds"("name");

-- AddForeignKey
ALTER TABLE "sizes" ADD CONSTRAINT "sizes_specie_id_fkey" FOREIGN KEY ("specie_id") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "breeds" ADD CONSTRAINT "breeds_specie_id_fkey" FOREIGN KEY ("specie_id") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
