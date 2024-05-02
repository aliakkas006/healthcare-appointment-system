import { Request, Response, NextFunction } from 'express';
import ehrService from '@/lib/EHRService';

const getEHRById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const EHR = await ehrService.getEHRById(id);
    if (!EHR) {
      return res.status(404).json({ message: 'EHR not found' });
    }

    return res.status(200).json({ message: 'EHR fetched successfully', EHR });
  } catch (err) {
    next(err);
  }
};

export default getEHRById;
