/*
  Warnings:

  - Added the required column `patientEmail` to the `EHR` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EHR" ADD COLUMN     "patientEmail" TEXT NOT NULL;
