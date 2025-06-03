import { Request, Response, NextFunction } from 'express';
import { PatientCreateSchema } from '@/schemas';
import { IEHRPatientService } from '@/lib/services/interfaces/IEHRPatientService'; // Changed import

const createPatient = (ehrPatientService: IEHRPatientService) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    const parsedBody = PatientCreateSchema.safeParse(req.body);

    if (!parsedBody.success) {
      // Consistent error response
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    const { userId } = parsedBody.data;
    // Check if the patient already exists using the injected EHR-specific patient service
    const existingPatient = await ehrPatientService.checkExistingPatient(userId);

    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists!' });
    }

    // Create the patient using the injected EHR-specific patient service
    const patient = await ehrPatientService.createPatient(parsedBody.data);

    return res
      .status(201)
      .json({ message: 'Patient created successfully!', patient });
  } catch (err) {
    next(err);
  }
};

export default createPatient;
