import { Request, Response, NextFunction } from 'express';
import { MedicationCreateSchema } from '@/schemas';
import ehrService from '@/lib/EHRService';

const createMedication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    const parsedBody = MedicationCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ message: parsedBody.error.errors });
    }

    // Create the Medications
    const medication = await ehrService.createMedication(parsedBody.data);

    return res
      .status(201)
      .json({ message: 'Medication created successfully!', medication });
  } catch (err) {
    next(err);
  }
};

export default createMedication;
