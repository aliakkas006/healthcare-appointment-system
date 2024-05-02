import { Request, Response, NextFunction } from 'express';
import { DiagnosticReportCreateSchema } from '@/schemas';
import ehrService from '@/lib/EHRService';

const createDiagnosticReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    const parsedBody = DiagnosticReportCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ message: parsedBody.error.errors });
    }

    // Create the DiagnosticReport
    const diagnosticReport = await ehrService.createDiagnosticReport(
      parsedBody.data
    );

    return res
      .status(201)
      .json({
        message: 'Diagnostic Report created successfully!',
        diagnosticReport,
      });
  } catch (err) {
    next(err);
  }
};

export default createDiagnosticReport;
