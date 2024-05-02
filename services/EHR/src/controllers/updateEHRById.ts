import { Request, Response, NextFunction } from 'express';
import ehrService from '@/lib/EHRService';
import { EHRUpdateSchema } from '@/schemas';

const updateEHRById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    const parsedBody = EHRUpdateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ message: parsedBody.error.errors });
    }

    const { id } = req.params;

    // Update EHR by id
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
