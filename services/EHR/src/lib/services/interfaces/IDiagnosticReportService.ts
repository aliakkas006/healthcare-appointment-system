import { DiagnosticReport, Prisma } from '@prisma/client';

export interface IDiagnosticReportService {
  createDiagnosticReport(
    diagnosticReportData: Prisma.DiagnosticReportCreateInput
  ): Promise<DiagnosticReport>;
  getDiagnosticReports(): Promise<DiagnosticReport[]>;
  getDiagnosticReportsByEhrId(ehrId: string): Promise<DiagnosticReport[]>;
}
