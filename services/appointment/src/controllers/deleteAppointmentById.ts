import { Request, Response, NextFunction } from 'express';
import appointmentService from '@/lib/AppointmentService';

const deleteAppointmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appointmentId } = req.params;
    await appointmentService.deleteAppointment(appointmentId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default deleteAppointmentById;
