import { Request, Response, NextFunction } from 'express';
import { IAppointmentService } from '@/lib/services/interfaces/IAppointmentService';

export default (appointmentService: IAppointmentService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { appointmentId } = req.params;
      const deletedAppointment = await appointmentService.deleteAppointment(
        appointmentId
      );

      if (!deletedAppointment) {
        return res
          .status(404)
          .json({ message: 'Appointment not found or already deleted' });
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
