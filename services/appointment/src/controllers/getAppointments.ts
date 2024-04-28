import { Request, Response, NextFunction } from 'express';
import appointmentService from '@/lib/AppointmentService';

const getAppointments = async (
  _req: Request,
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

export default getAppointments;
