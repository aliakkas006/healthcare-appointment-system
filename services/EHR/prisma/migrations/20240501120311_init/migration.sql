-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "EHR" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "medicalHistories" TEXT[],
    "allergies" TEXT[],

    CONSTRAINT "EHR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'MALE',
    "medicalHistory" TEXT NOT NULL,
    "insuranceInformation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "findings" TEXT NOT NULL,

    CONSTRAINT "DiagnosticReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EHRToMedication" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DiagnosticReportToEHR" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_EHRToMedication_AB_unique" ON "_EHRToMedication"("A", "B");

-- CreateIndex
CREATE INDEX "_EHRToMedication_B_index" ON "_EHRToMedication"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DiagnosticReportToEHR_AB_unique" ON "_DiagnosticReportToEHR"("A", "B");

-- CreateIndex
CREATE INDEX "_DiagnosticReportToEHR_B_index" ON "_DiagnosticReportToEHR"("B");

-- AddForeignKey
ALTER TABLE "EHR" ADD CONSTRAINT "EHR_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EHRToMedication" ADD CONSTRAINT "_EHRToMedication_A_fkey" FOREIGN KEY ("A") REFERENCES "EHR"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EHRToMedication" ADD CONSTRAINT "_EHRToMedication_B_fkey" FOREIGN KEY ("B") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiagnosticReportToEHR" ADD CONSTRAINT "_DiagnosticReportToEHR_A_fkey" FOREIGN KEY ("A") REFERENCES "DiagnosticReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiagnosticReportToEHR" ADD CONSTRAINT "_DiagnosticReportToEHR_B_fkey" FOREIGN KEY ("B") REFERENCES "EHR"("id") ON DELETE CASCADE ON UPDATE CASCADE;
