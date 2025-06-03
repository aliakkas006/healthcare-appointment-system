import { Request, Response, NextFunction } from 'express';
import { IEHRService } from '@/lib/services/interfaces/IEHRService'; // Changed import

const deleteEHRById =
  (ehrService: IEHRService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Delete EHR by id using the injected service
      const deletedEHR = await ehrService.deleteEHRById(id);

      if (!deletedEHR) {
        // Service method deleteEHRById returns the deleted EHR or null
        return res
          .status(404)
          .json({ message: 'EHR not found or already deleted' });
      }

      // Successfully deleted
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

export default deleteEHRById;
