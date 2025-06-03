import { IDiagnosticReportRepository } from "./interfaces/IDiagnosticReportRepository";
import { DiagnosticReport, PrismaClient, Prisma } from "@prisma/client";

export class DiagnosticReportRepository implements IDiagnosticReportRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async create(data: Prisma.DiagnosticReportCreateInput): Promise<DiagnosticReport> {
    return this.prisma.diagnosticReport.create({ data });
  }

  async findMany(): Promise<DiagnosticReport[]> {
    return this.prisma.diagnosticReport.findMany();
  }

  async findManyByEhrId(ehrId: string): Promise<DiagnosticReport[]> {
    return this.prisma.diagnosticReport.findMany({ where: { ehrId } });
  }
}
