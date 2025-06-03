import { Request, Response, NextFunction } from 'express';
import { IAppointmentService } from '@/lib/services/interfaces/IAppointmentService';

export default (appointmentService: IAppointmentService) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appointmentId } = req.params;
    const deletedAppointment = await appointmentService.deleteAppointment(appointmentId);

    if (!deletedAppointment) {
      // This implies the appointment was not found to be deleted.
      // The service method deleteAppointment returns the deleted appointment or null.
      return res.status(404).json({ message: 'Appointment not found or already deleted' });
    }
    // Successfully deleted
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
