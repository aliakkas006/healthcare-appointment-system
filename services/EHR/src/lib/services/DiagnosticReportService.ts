import { IDiagnosticReportService } from './interfaces/IDiagnosticReportService';
import { IDiagnosticReportRepository } from '../repositories/interfaces/IDiagnosticReportRepository';
import { DiagnosticReport, Prisma } from '@prisma/client';
import logger from '@/config/logger'; // Optional: if specific logging needed

export class DiagnosticReportService implements IDiagnosticReportService {
  private readonly diagnosticReportRepository: IDiagnosticReportRepository;

  constructor(diagnosticReportRepository: IDiagnosticReportRepository) {
    this.diagnosticReportRepository = diagnosticReportRepository;
  }

  async createDiagnosticReport(
    diagnosticReportData: Prisma.DiagnosticReportCreateInput
  ): Promise<DiagnosticReport> {
    try {
      return this.diagnosticReportRepository.create(diagnosticReportData);
    } catch (error) {
      logger.error(
        'Error in DiagnosticReportService.createDiagnosticReport:',
        error
      );
      throw error;
    }
  }

  async getDiagnosticReports(): Promise<DiagnosticReport[]> {
    try {
      return this.diagnosticReportRepository.findMany();
    } catch (error) {
      logger.error(
        'Error in DiagnosticReportService.getDiagnosticReports:',
        error
      );
      throw error;
    }
  }

  async getDiagnosticReportsByEhrId(
    ehrId: string
  ): Promise<DiagnosticReport[]> {
    try {
      return this.diagnosticReportRepository.findManyByEhrId(ehrId);
    } catch (error) {
      logger.error(
        `Error in DiagnosticReportService.getDiagnosticReportsByEhrId for ehrId ${ehrId}:`,
        error
      );
      throw error;
    }
  }
}

export default DiagnosticReportService;
