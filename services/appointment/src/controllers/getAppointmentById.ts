import { Request, Response, NextFunction } from 'express';
import { IAppointmentService } from '@/lib/services/interfaces/IAppointmentService';

export default (appointmentService: IAppointmentService) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await appointmentService.getAppointmentById(
      appointmentId
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (err) {
    next(err);
  }
};
