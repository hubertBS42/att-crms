-- CreateEnum
CREATE TYPE "OrganizationStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE');

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "status" "OrganizationStatus" NOT NULL DEFAULT 'ACTIVE';
