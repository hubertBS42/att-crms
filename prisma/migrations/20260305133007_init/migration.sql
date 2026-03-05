-- CreateTable
CREATE TABLE "recording" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "filename" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "callDate" TEXT NOT NULL,
    "callTime" TEXT NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "caller" TEXT NOT NULL,
    "calledNumber" TEXT NOT NULL,
    "answeredBy" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recording_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recording_filename_key" ON "recording"("filename");
