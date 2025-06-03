import { EHR, Prisma, Medication, DiagnosticReport } from '@prisma/client';

// Helper type for EHR with its relations, can be moved to a central types file if needed.
export type EHRWithRelations = EHR & {
  medications: Medication[];
  diagnosticReports: DiagnosticReport[];
};

export interface IEHRService {
  checkExistingEHR(patientEmail: string): Promise<EHR | null>;
  createEHR(EHRData: Prisma.EHRCreateInput): Promise<EHR>;
  getEHRs(): Promise<EHR[]>;
  getEHRByPatientId(patientId: string): Promise<EHR | null>;
  getEHRById(ehrId: string): Promise<EHRWithRelations | null>;
  updateEHRById(
    ehrId: string,
    EHRData: Prisma.EHRUpdateInput
  ): Promise<EHR | null>;
  deleteEHRById(ehrId: string): Promise<EHR | null>;
}
