/*
  Warnings:

  - Added the required column `duration` to the `recording` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `recording` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recording" ADD COLUMN     "duration" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;
