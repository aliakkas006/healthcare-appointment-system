import { Request, Response, NextFunction } from 'express';
import patientService from '@/lib/PatientService';

const getPatients = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const patients = await patientService.getPatients();
    res.status(200).json(patients);
  } catch (err) {
    next(err);
  }
};

export default getPatients;
