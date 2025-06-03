import { DiagnosticReportService } from '@/lib/services/DiagnosticReportService';
import { IDiagnosticReportRepository } from '@/lib/repositories/interfaces/IDiagnosticReportRepository';
import { DiagnosticReport, Prisma, DiagnosticReportStatus } from '@prisma/client';
import logger from '@/config/logger';

jest.mock('@/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const mockDiagnosticReportRepository: jest.Mocked<IDiagnosticReportRepository> = {
  create: jest.fn(),
  findMany: jest.fn(),
  findManyByEhrId: jest.fn(),
};

describe('DiagnosticReportService', () => {
  let diagnosticReportService: DiagnosticReportService;

  beforeEach(() => {
    jest.clearAllMocks();
    diagnosticReportService = new DiagnosticReportService(mockDiagnosticReportRepository);
  });

  const sampleReportId = 'dr-123';
  const sampleEhrId = 'ehr-abc';
  const sampleDiagnosticReport: DiagnosticReport = {
    id: sampleReportId,
    ehrId: sampleEhrId,
    reportName: 'Blood Test',
    reportDate: new Date(),
    status: DiagnosticReportStatus.FINAL,
    details: { result: 'Normal' },
    orderedBy: 'Dr. Order',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const sampleDiagnosticReportInput: Prisma.DiagnosticReportCreateInput = {
    ehr: { connect: { id: sampleEhrId } },
    reportName: 'Blood Test',
    reportDate: new Date(),
    status: DiagnosticReportStatus.FINAL,
    details: { result: 'Normal' },
    orderedBy: 'Dr. Order',
  };

  describe('createDiagnosticReport', () => {
    it('should call repository.create and return the created report', async () => {
      mockDiagnosticReportRepository.create.mockResolvedValue(sampleDiagnosticReport);
      const result = await diagnosticReportService.createDiagnosticReport(sampleDiagnosticReportInput);
      expect(mockDiagnosticReportRepository.create).toHaveBeenCalledWith(sampleDiagnosticReportInput);
      expect(result).toEqual(sampleDiagnosticReport);
    });
    it('should log and re-throw error if repository.create fails', async () => {
        const error = new Error('Create failed');
        mockDiagnosticReportRepository.create.mockRejectedValue(error);
        await expect(diagnosticReportService.createDiagnosticReport(sampleDiagnosticReportInput)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith('Error in DiagnosticReportService.createDiagnosticReport:', error);
    });
  });

  describe('getDiagnosticReports', () => {
    it('should call repository.findMany and return a list of reports', async () => {
      const reportsArray = [sampleDiagnosticReport];
      mockDiagnosticReportRepository.findMany.mockResolvedValue(reportsArray);
      const result = await diagnosticReportService.getDiagnosticReports();
      expect(mockDiagnosticReportRepository.findMany).toHaveBeenCalled();
      expect(result).toEqual(reportsArray);
    });
    it('should log and re-throw error if repository.findMany fails', async () => {
        const error = new Error('FindMany failed');
        mockDiagnosticReportRepository.findMany.mockRejectedValue(error);
        await expect(diagnosticReportService.getDiagnosticReports()).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith('Error in DiagnosticReportService.getDiagnosticReports:', error);
    });
  });

  describe('getDiagnosticReportsByEhrId', () => {
    it('should call repository.findManyByEhrId with ehrId and return reports', async () => {
      const reportsArray = [sampleDiagnosticReport];
      mockDiagnosticReportRepository.findManyByEhrId.mockResolvedValue(reportsArray);
      const result = await diagnosticReportService.getDiagnosticReportsByEhrId(sampleEhrId);
      expect(mockDiagnosticReportRepository.findManyByEhrId).toHaveBeenCalledWith(sampleEhrId);
      expect(result).toEqual(reportsArray);
    });
    it('should log and re-throw error if repository.findManyByEhrId fails', async () => {
        const error = new Error('FindManyByEhrId failed');
        mockDiagnosticReportRepository.findManyByEhrId.mockRejectedValue(error);
        await expect(diagnosticReportService.getDiagnosticReportsByEhrId(sampleEhrId)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(`Error in DiagnosticReportService.getDiagnosticReportsByEhrId for ehrId ${sampleEhrId}:`, error);
    });
  });
});
