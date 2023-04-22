-- CreateTable
CREATE TABLE "guardian" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "guardian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guardian_email_key" ON "guardian"("email");

-- CreateIndex
CREATE UNIQUE INDEX "guardian_phone_key" ON "guardian"("phone");
