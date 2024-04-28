import { Request, Response, NextFunction } from 'express';
import { AppointmentCreateShcema } from '@/schemas';
import appointmentService from '@/lib/AppointmentService';

const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    const parsedBody = AppointmentCreateShcema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ message: parsedBody.error.errors });
    }

    const appointment = await appointmentService.createAppointment(
      parsedBody.data
    );

    return res
      .status(201)
      .json({ message: 'Appointment created successfully!', appointment });
  } catch (err) {
    next(err);
  }
};

export default createAppointment;
