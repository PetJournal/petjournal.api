/*
  Warnings:

  - You are about to drop the column `forgetPasswordToken` on the `guardian` table. All the data in the column will be lost.
  - Added the required column `verificationToken` to the `guardian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "guardian" DROP COLUMN "forgetPasswordToken",
ADD COLUMN     "verificationToken" TEXT NOT NULL,
ADD COLUMN     "verificationTokenCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
