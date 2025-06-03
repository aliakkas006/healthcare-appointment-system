import { DiagnosticReport, Prisma } from "@prisma/client";

export interface IDiagnosticReportRepository {
  create(data: Prisma.DiagnosticReportCreateInput): Promise<DiagnosticReport>;
  findMany(): Promise<DiagnosticReport[]>;
  findManyByEhrId(ehrId: string): Promise<DiagnosticReport[]>;
}
