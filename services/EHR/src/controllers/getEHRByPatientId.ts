import { Request, Response, NextFunction } from 'express';
import { IEHRService } from '@/lib/services/interfaces/IEHRService'; // Changed import

const getEHRByPatientId = (ehrService: IEHRService) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { patientId } = req.params;

    // Get EHR by patient ID using the injected service
    const EHR = await ehrService.getEHRByPatientId(patientId);

    if (!EHR) {
      return res.status(404).json({ message: 'EHR not found for this patient' });
    }

    res.status(200).json({ message: 'EHR fetched successfully', EHR });
  } catch (err) {
    next(err);
  }
};

export default getEHRByPatientId;
