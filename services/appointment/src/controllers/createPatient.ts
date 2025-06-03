import { Request, Response, NextFunction } from 'express';
import { PatientCreateSchema } from '@/schemas';
import { IPatientService } from '@/lib/services/interfaces/IPatientService';

export default (patientService: IPatientService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body
      const parsedBody = PatientCreateSchema.safeParse(req.body);

      if (!parsedBody.success) {
        return res.status(400).json({ errors: parsedBody.error.errors }); // Use 'errors' for consistency
      }

      const { userId } = parsedBody.data;
      // Check if the patient already exists using the injected service
      const existingPatient = await patientService.checkExistingPatient(userId);

      if (existingPatient) {
        return res.status(400).json({ message: 'Patient already exists!' });
      }

      // Create the patient using the injected service
      const patient = await patientService.createPatient(parsedBody.data);

      return res
        .status(201)
        .json({ message: 'Patient created successfully!', patient });
    } catch (err) {
      next(err);
    }
  };
