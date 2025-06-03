import { Patient, Prisma } from "@prisma/client";

// This service interface is specific to Patient operations needed within the EHR context.
export interface IEHRPatientService {
  checkExistingPatient(userId: string): Promise<Patient | null>; // From original EHRService
  createPatient(patientData: Prisma.PatientCreateInput): Promise<Patient>; // From original EHRService
}
