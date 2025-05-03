-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "scheduler_id" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_scheduler_id_fkey" FOREIGN KEY ("scheduler_id") REFERENCES "schedulers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
