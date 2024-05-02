/*
  Warnings:

  - A unique constraint covering the columns `[patientEmail]` on the table `EHR` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EHR_patientEmail_key" ON "EHR"("patientEmail");
