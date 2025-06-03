import { Patient, Prisma } from '@prisma/client';

// This service interface is specific to Patient operations needed within the EHR context.
export interface IEHRPatientService {
  checkExistingPatient(userId: string): Promise<Patient | null>;
  createPatient(patientData: Prisma.PatientCreateInput): Promise<Patient>;
}
