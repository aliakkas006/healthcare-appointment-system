import { DiagnosticReport, Prisma } from "@prisma/client";

export interface IDiagnosticReportService {
  createDiagnosticReport(diagnosticReportData: Prisma.DiagnosticReportCreateInput): Promise<DiagnosticReport>;
  getDiagnosticReports(): Promise<DiagnosticReport[]>; // Corresponds to existing getDiagnosticReports in EHRService
  getDiagnosticReportsByEhrId(ehrId: string): Promise<DiagnosticReport[]>; // For fetching reports for a specific EHR
}
