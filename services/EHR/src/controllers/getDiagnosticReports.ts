import { Request, Response, NextFunction } from 'express';
import ehrService from '@/lib/EHRService';

const getDiagnosticReports = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get all Diagnostic Reports
    const diagnosticReports = await ehrService.getDiagnosticReports();

    return res.status(200).json(diagnosticReports);
  } catch (err) {
    next(err);
  }
};

export default getDiagnosticReports;
