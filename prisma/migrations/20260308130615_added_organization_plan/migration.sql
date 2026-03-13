/*
  Warnings:

  - Added the required column `plan` to the `organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "plan" TEXT NOT NULL;
