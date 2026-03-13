/*
  Warnings:

  - The `plan` column on the `organization` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OrganizationPlan" AS ENUM ('BASIC', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "organization" DROP COLUMN "plan",
ADD COLUMN     "plan" "OrganizationPlan" NOT NULL DEFAULT 'BASIC';
