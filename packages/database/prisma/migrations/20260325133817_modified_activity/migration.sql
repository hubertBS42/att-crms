/*
  Warnings:

  - You are about to drop the column `organizationId` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `organizationName` on the `activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "activity" DROP COLUMN "organizationId",
DROP COLUMN "organizationName";
