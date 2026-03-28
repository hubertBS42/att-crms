/*
  Warnings:

  - The values [RECORDING_DOWNLOADED,RECORDINGS_PURGED] on the enum `ActivityType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityType_new" AS ENUM ('RECORDING_INDEXED', 'RECORDING_DELETED', 'ORGANIZATION_CREATED', 'ORGANIZATION_DELETED', 'ORGANIZATION_UPDATED', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'MEMBER_ADDED', 'MEMBER_UPDATED', 'MEMBER_INVITED', 'MEMBER_REMOVED');
ALTER TABLE "activity" ALTER COLUMN "type" TYPE "ActivityType_new" USING ("type"::text::"ActivityType_new");
ALTER TYPE "ActivityType" RENAME TO "ActivityType_old";
ALTER TYPE "ActivityType_new" RENAME TO "ActivityType";
DROP TYPE "public"."ActivityType_old";
COMMIT;
