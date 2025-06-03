import { Patient, Prisma } from '@prisma/client';

export interface IPatientService {
  checkExistingPatient(userId: string): Promise<Patient | null>;
  createPatient(patientData: Prisma.PatientCreateInput): Promise<Patient>;
  getPatients(): Promise<Patient[]>;
  getPatientById(patientId: string): Promise<Patient | null>;
}
