/*
  Warnings:

  - You are about to drop the column `organizationId` on the `recording` table. All the data in the column will be lost.
  - Added the required column `organizationSlug` to the `recording` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "recording" DROP CONSTRAINT "recording_organizationId_fkey";

-- AlterTable
ALTER TABLE "recording" DROP COLUMN "organizationId",
ADD COLUMN     "organizationSlug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "recording" ADD CONSTRAINT "recording_organizationSlug_fkey" FOREIGN KEY ("organizationSlug") REFERENCES "organization"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
