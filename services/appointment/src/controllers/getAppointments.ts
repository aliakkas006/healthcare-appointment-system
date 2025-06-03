import { Request, Response, NextFunction } from 'express';
import { IAppointmentService } from '@/lib/services/interfaces/IAppointmentService';

export default (appointmentService: IAppointmentService) => async (
  _req: Request, // Underscore if not used
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments = await appointmentService.getAppointments();
    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};
