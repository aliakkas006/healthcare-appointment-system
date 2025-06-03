import { Medication, Prisma } from '@prisma/client';

export interface IMedicationService {
  createMedication(
    medicationData: Prisma.MedicationCreateInput
  ): Promise<Medication>;
  getMedications(): Promise<Medication[]>;
  getMedicationsByEhrId(ehrId: string): Promise<Medication[]>;
}
