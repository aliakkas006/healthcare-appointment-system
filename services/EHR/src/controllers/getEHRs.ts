import { Request, Response, NextFunction } from 'express';
import ehrService from '@/lib/EHRService';

const getEHRs = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Get all EHRs
    const EHRs = await ehrService.getEHRs();

    res.status(200).json(EHRs);
  } catch (err) {
    next(err);
  }
};

export default getEHRs;
