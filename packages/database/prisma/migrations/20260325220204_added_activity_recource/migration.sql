/*
  Warnings:

  - The values [RECORDING_INDEXED,RECORDING_DELETED,ORGANIZATION_CREATED,ORGANIZATION_DELETED,ORGANIZATION_UPDATED,USER_CREATED,USER_UPDATED,USER_DELETED,MEMBER_ADDED,MEMBER_UPDATED,MEMBER_INVITED,MEMBER_REMOVED] on the enum `ActivityType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `resource` to the `activity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActivityResource" AS ENUM ('RECORDING', 'ORGANIZATION', 'MEMBER', 'INVITATION', 'USER');

-- AlterEnum
BEGIN;
CREATE TYPE "ActivityType_new" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'ALERT');
ALTER TABLE "activity" ALTER COLUMN "type" TYPE "ActivityType_new" USING ("type"::text::"ActivityType_new");
ALTER TYPE "ActivityType" RENAME TO "ActivityType_old";
ALTER TYPE "ActivityType_new" RENAME TO "ActivityType";
DROP TYPE "public"."ActivityType_old";
COMMIT;

-- AlterTable
ALTER TABLE "activity" ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "organizationName" TEXT,
ADD COLUMN     "resource" "ActivityResource" NOT NULL;
