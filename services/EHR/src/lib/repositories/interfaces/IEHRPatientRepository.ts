import { Patient, Prisma } from '@prisma/client';

export interface IEHRPatientRepository {
  findByUserId(userId: string): Promise<Patient | null>;
  create(data: Prisma.PatientCreateInput): Promise<Patient>;
}
