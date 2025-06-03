import { eHR, Prisma, Medication, DiagnosticReport } from "@prisma/client";

// Helper type for EHR with its relations, can be moved to a central types file if needed.
export type EHRWithRelations = eHR & {
  medications: Medication[];
  diagnosticReports: DiagnosticReport[];
};

export interface IEHRService {
  checkExistingEHR(patientEmail: string): Promise<eHR | null>;
  createEHR(EHRData: Prisma.eHRCreateInput): Promise<eHR>; // Assuming repo returns the full eHR object or the service maps it.
  getEHRs(): Promise<eHR[]>;
  getEHRByPatientId(patientId: string): Promise<eHR | null>;
  getEHRById(ehrId: string): Promise<EHRWithRelations | null>; // Service ensures relations are loaded.
  updateEHRById(ehrId: string, EHRData: Prisma.eHRUpdateInput): Promise<eHR | null>;
  deleteEHRById(ehrId: string): Promise<eHR | null>;
}
