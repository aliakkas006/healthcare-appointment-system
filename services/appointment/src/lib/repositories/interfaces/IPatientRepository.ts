import { Patient, Prisma } from '@prisma/client';

export interface IPatientRepository {
  findByUserId(userId: string): Promise<Patient | null>;
  create(data: Prisma.PatientCreateInput): Promise<Patient>;
  findMany(): Promise<Patient[]>;
  findById(id: string): Promise<Patient | null>;
}
