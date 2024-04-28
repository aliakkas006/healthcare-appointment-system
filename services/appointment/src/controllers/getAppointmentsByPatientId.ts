import { Request, Response, NextFunction } from 'express';
import appointmentService from '@/lib/AppointmentService';

const getAppointmentsByPatientId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export default getAppointmentsByPatientId;
