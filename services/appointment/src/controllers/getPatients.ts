import { Request, Response, NextFunction } from 'express';
import { IPatientService } from '@/lib/services/interfaces/IPatientService';

export default (patientService: IPatientService) =>
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const patients = await patientService.getPatients();
      res.status(200).json(patients);
    } catch (err) {
      next(err);
    }
  };
