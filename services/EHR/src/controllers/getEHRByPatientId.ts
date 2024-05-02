import { Request, Response, NextFunction } from 'express';
import ehrService from '@/lib/EHRService';

const getEHRByPatientId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { patientId } = req.params;

    const EHR = await ehrService.getEHRByPatientId(patientId);

    if (!EHR) {
      return res.status(404).json({ message: 'EHR not found' });
    }

    res.status(200).json({ message: 'EHR fetched successfully', EHR });
  } catch (err) {
    next(err);
  }
};

export default getEHRByPatientId;
