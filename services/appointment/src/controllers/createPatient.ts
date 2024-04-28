import { Request, Response, NextFunction } from 'express';
import { PatientCreateSchema } from '@/schemas';
import patientService from '@/lib/PatientService';

const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    const parsedBody = PatientCreateSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ message: parsedBody.error.errors });
    }

    const { userId } = parsedBody.data;
    const existingPatient = await patientService.checkExistingPatient(userId);

    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists!' });
    }

    const patient = await patientService.createPatient(parsedBody.data);

    return res
      .status(201)
      .json({ message: 'Patient created successfully!', patient });
  } catch (err) {
    next(err);
  }
};

export default createPatient;
