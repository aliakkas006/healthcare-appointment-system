import { Request, Response, NextFunction } from 'express';
import { DiagnosticReportCreateSchema } from '@/schemas';
import { IDiagnosticReportService } from '@/lib/services/interfaces/IDiagnosticReportService'; // Changed import

const createDiagnosticReport =
  (diagnosticReportService: IDiagnosticReportService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body
      const parsedBody = DiagnosticReportCreateSchema.safeParse(req.body);
      if (!parsedBody.success) {
        // Consistent error response
        return res.status(400).json({ errors: parsedBody.error.errors });
      }

      // Create the DiagnosticReport using the injected service
      const diagnosticReport =
        await diagnosticReportService.createDiagnosticReport(parsedBody.data);

      return res.status(201).json({
        message: 'Diagnostic Report created successfully!',
        diagnosticReport,
      });
    } catch (err) {
      next(err);
    }
  };

export default createDiagnosticReport;
