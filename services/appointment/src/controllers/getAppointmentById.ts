import { Request, Response, NextFunction } from 'express';
import appointmentService from '@/lib/AppointmentService';

const getAppointmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await appointmentService.getAppointmentById(
      appointmentId
    );

    res.status(200).json(appointment);
  } catch (err) {
    next(err);
  }
};

export default getAppointmentById;
