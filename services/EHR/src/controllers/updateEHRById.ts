import { Request, Response, NextFunction } from 'express';
import { EHRUpdateSchema } from '@/schemas';
import { IEHRService } from '@/lib/services/interfaces/IEHRService'; // Changed import

const updateEHRById = (ehrService: IEHRService) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    const parsedBody = EHRUpdateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      // Consistent error response
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    const { id } = req.params;

    // Update EHR by id using the injected service
    const updatedEHR = await ehrService.updateEHRById(id, parsedBody.data);
    if (!updatedEHR) {
      return res.status(404).json({ message: 'EHR not found' });
    }

    return res.json({ message: 'EHR updated successfully', updatedEHR });
  } catch (err) {
    next(err);
  }
};

export default updateEHRById;
