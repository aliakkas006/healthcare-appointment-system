import { Request, Response, NextFunction } from 'express';
import { IAppointmentService } from '@/lib/services/interfaces/IAppointmentService';

export default (appointmentService: IAppointmentService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;
      const appointments = await appointmentService.getAppointmentsByPatientId(
        patientId
      );

      res.status(200).json(appointments);
    } catch (err) {
      next(err);
    }
  };
