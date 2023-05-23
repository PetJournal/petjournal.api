-- CreateTable
CREATE TABLE "log_error" (
    "id" SERIAL NOT NULL,
    "stack" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "log_error_pkey" PRIMARY KEY ("id")
);
