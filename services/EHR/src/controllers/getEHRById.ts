import { Request, Response, NextFunction } from 'express';
import { IEHRService } from '@/lib/services/interfaces/IEHRService'; // Changed import

const getEHRById =
  (ehrService: IEHRService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Get EHR by ID using the injected service
      const EHR = await ehrService.getEHRById(id);
      if (!EHR) {
        return res.status(404).json({ message: 'EHR not found' });
      }

      // The service method getEHRById is expected to return EHRWithRelations
      return res.status(200).json({ message: 'EHR fetched successfully', EHR });
    } catch (err) {
      next(err);
    }
  };

export default getEHRById;
