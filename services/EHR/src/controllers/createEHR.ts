import { Request, Response, NextFunction } from 'express';
import { EHRCreateSchema } from '@/schemas';
import ehrService from '@/lib/EHRService';

const createEHR = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body
    const parsedBody = EHRCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ message: parsedBody.error.errors });
    }

    // Check if the patient already has an EHR by patient email
    const existingEHR = await ehrService.checkExistingEHR(
      parsedBody.data.patientEmail
    );
    if (existingEHR) {
      return res.status(400).json({ message: 'Patient already has an EHR' });
    }

    // Create the EHR
    const ehr = await ehrService.createEHR(parsedBody.data);

    return res.status(201).json({ message: 'EHR created successfully!', ehr });
  } catch (err) {
    next(err);
  }
};

export default createEHR;
