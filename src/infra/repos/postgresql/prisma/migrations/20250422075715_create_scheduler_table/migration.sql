-- CreateTable
CREATE TABLE "schedulers" (
    "id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "days_of_week" INTEGER[],
    "days_of_month" INTEGER[],

    CONSTRAINT "schedulers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PetScheduler" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PetScheduler_AB_unique" ON "_PetScheduler"("A", "B");

-- CreateIndex
CREATE INDEX "_PetScheduler_B_index" ON "_PetScheduler"("B");

-- AddForeignKey
ALTER TABLE "schedulers" ADD CONSTRAINT "schedulers_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PetScheduler" ADD CONSTRAINT "_PetScheduler_A_fkey" FOREIGN KEY ("A") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PetScheduler" ADD CONSTRAINT "_PetScheduler_B_fkey" FOREIGN KEY ("B") REFERENCES "schedulers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
