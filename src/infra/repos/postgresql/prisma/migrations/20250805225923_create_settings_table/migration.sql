-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "guardian_id" TEXT NOT NULL,
    "notification_email" BOOLEAN NOT NULL DEFAULT true,
    "notification_mobile" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "settings_guardian_id_key" ON "settings"("guardian_id");

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
