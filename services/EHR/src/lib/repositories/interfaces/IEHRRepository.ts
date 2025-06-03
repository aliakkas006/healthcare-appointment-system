import { eHR, Prisma, Medication, DiagnosticReport } from "@prisma/client";

// This type can be defined here or in a central types file if used across services
export type EHRWithRelations = eHR & {
  medications: Medication[];
  diagnosticReports: DiagnosticReport[];
};

export interface IEHRRepository {
  findByPatientEmail(patientEmail: string): Promise<eHR | null>;
  create(data: Prisma.eHRCreateInput): Promise<eHR>;
  findMany(): Promise<eHR[]>;
  findFirstByPatientId(patientId: string): Promise<eHR | null>;
  findById(id: string): Promise<eHR | null>; // Basic find by ID
  findByIdWithRelations(id: string): Promise<EHRWithRelations | null>; // For fetching EHR with its relations
  update(id: string, data: Prisma.eHRUpdateInput): Promise<eHR | null>;
  deleteById(id: string): Promise<eHR | null>;
}
