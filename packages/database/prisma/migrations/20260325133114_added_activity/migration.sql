-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('RECORDING_INDEXED', 'RECORDING_DELETED', 'RECORDING_DOWNLOADED', 'RECORDINGS_PURGED', 'ORGANIZATION_CREATED', 'ORGANIZATION_DELETED', 'ORGANIZATION_UPDATED', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'MEMBER_ADDED', 'MEMBER_UPDATED', 'MEMBER_INVITED', 'MEMBER_REMOVED');

-- CreateTable
CREATE TABLE "activity" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "type" "ActivityType" NOT NULL,
    "organizationId" TEXT,
    "organizationName" TEXT,
    "actorId" TEXT,
    "actorName" TEXT,
    "targetId" TEXT,
    "targetName" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);
