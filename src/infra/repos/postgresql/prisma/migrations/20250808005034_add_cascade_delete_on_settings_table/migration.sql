-- DropForeignKey
ALTER TABLE "settings" DROP CONSTRAINT "settings_guardian_id_fkey";

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE CASCADE ON UPDATE CASCADE;
