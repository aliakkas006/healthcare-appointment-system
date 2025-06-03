import { Request, Response, NextFunction } from 'express';
import { IMedicationService } from '@/lib/services/interfaces/IMedicationService'; // Changed import

const getMedications = (medicationService: IMedicationService) => async (
  _req: Request, // Underscore if not used
  res: Response,
  next: NextFunction
) => {
  try {
    // Get all Medications using the injected service
    const medications = await medicationService.getMedications();

    return res.status(200).json(medications);
  } catch (err) {
    next(err);
  }
};

export default getMedications;
