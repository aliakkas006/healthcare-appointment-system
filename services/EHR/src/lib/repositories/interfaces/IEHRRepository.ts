import { EHR, Prisma, Medication, DiagnosticReport } from '@prisma/client';

// This type can be defined here or in a central types file if used across services
export type EHRWithRelations = EHR & {
  medications: Medication[];
  diagnosticReports: DiagnosticReport[];
};

export interface IEHRRepository {
  findByPatientEmail(patientEmail: string): Promise<EHR | null>;
  create(data: Prisma.EHRCreateInput): Promise<EHR>;
  findMany(): Promise<EHR[]>;
  findFirstByPatientId(patientId: string): Promise<EHR | null>;
  findById(id: string): Promise<EHR | null>;
  findByIdWithRelations(id: string): Promise<EHRWithRelations | null>;
  update(id: string, data: Prisma.EHRUpdateInput): Promise<EHR | null>;
  deleteById(id: string): Promise<EHR | null>;
}
