import { Request, Response, NextFunction } from 'express';
import ehrService from '@/lib/EHRService';

const deleteEHRById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Delete EHR by id
    await ehrService.deleteEHRById(id);

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default deleteEHRById;
