import { Request, Response, NextFunction } from 'express';
import { EHRCreateSchema } from '@/schemas';
import { IEHRService } from '@/lib/services/interfaces/IEHRService'; // Changed import

const createEHR = (ehrService: IEHRService) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body
    const parsedBody = EHRCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      // Consistent error response
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    // Check if the patient already has an EHR by patient email using the injected service
    const existingEHR = await ehrService.checkExistingEHR(
      parsedBody.data.patientEmail
    );
    if (existingEHR) {
      return res.status(400).json({ message: 'Patient already has an EHR' });
    }

    // Create the EHR using the injected service
    const ehr = await ehrService.createEHR(parsedBody.data);

    return res.status(201).json({ message: 'EHR created successfully!', ehr });
  } catch (err) {
    next(err);
  }
};

export default createEHR;
