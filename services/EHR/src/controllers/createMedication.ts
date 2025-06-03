import { Request, Response, NextFunction } from 'express';
import { MedicationCreateSchema } from '@/schemas';
import { IMedicationService } from '@/lib/services/interfaces/IMedicationService'; // Changed import

const createMedication =
  (medicationService: IMedicationService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body
      const parsedBody = MedicationCreateSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ errors: parsedBody.error.errors });
      }

      // Create the Medication using the injected service
      const medication = await medicationService.createMedication(
        parsedBody.data
      );

      return res
        .status(201)
        .json({ message: 'Medication created successfully!', medication });
    } catch (err) {
      next(err);
    }
  };

export default createMedication;
