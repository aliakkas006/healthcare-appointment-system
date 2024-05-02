import { Request, Response, NextFunction } from 'express';
import ehrService from '@/lib/EHRService';

const getMedications = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get all Medications
    const medications = await ehrService.getMedications();

    return res.status(200).json(medications);
  } catch (err) {
    next(err);
  }
};

export default getMedications;
