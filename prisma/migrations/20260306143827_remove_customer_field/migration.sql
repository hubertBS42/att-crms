/*
  Warnings:

  - You are about to drop the column `customer` on the `recording` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `recording` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recording" DROP COLUMN "customer",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "recording" ADD CONSTRAINT "recording_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
