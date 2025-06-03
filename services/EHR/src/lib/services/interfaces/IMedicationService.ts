import { Medication, Prisma } from "@prisma/client";

export interface IMedicationService {
  createMedication(medicationData: Prisma.MedicationCreateInput): Promise<Medication>;
  getMedications(): Promise<Medication[]>; // Corresponds to existing getMedications in EHRService
  getMedicationsByEhrId(ehrId: string): Promise<Medication[]>; // For fetching medications for a specific EHR
}
