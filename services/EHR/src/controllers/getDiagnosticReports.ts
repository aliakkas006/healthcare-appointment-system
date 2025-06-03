import { Request, Response, NextFunction } from 'express';
import { IDiagnosticReportService } from '@/lib/services/interfaces/IDiagnosticReportService'; // Changed import

const getDiagnosticReports =
  (diagnosticReportService: IDiagnosticReportService) =>
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // Get all Diagnostic Reports using the injected service
      const diagnosticReports =
        await diagnosticReportService.getDiagnosticReports();

      return res.status(200).json(diagnosticReports);
    } catch (err) {
      next(err);
    }
  };

export default getDiagnosticReports;
