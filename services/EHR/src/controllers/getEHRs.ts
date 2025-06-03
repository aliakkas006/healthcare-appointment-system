import { Request, Response, NextFunction } from 'express';
import { IEHRService } from '@/lib/services/interfaces/IEHRService'; // Changed import

const getEHRs =
  (ehrService: IEHRService) =>
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // Get all EHRs using the injected service
      const EHRs = await ehrService.getEHRs();

      res.status(200).json(EHRs);
    } catch (err) {
      next(err);
    }
  };

export default getEHRs;
