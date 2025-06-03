import { Request, Response, NextFunction } from 'express';
import { AppointmentCreateShcema } from '@/schemas'; // Corrected schema name based on file content
import { IAppointmentService } from '@/lib/services/interfaces/IAppointmentService';

export default (appointmentService: IAppointmentService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body
      const parsedBody = AppointmentCreateShcema.safeParse(req.body); // Using AppointmentCreateShcema
      if (!parsedBody.success) {
        // Return a 400 error if validation fails
        return res.status(400).json({ errors: parsedBody.error.errors });
      }

      // Create the appointment using the injected service
      const appointment = await appointmentService.createAppointment(
        parsedBody.data
      );

      // Return a 201 response with the created appointment
      return res
        .status(201)
        .json({ message: 'Appointment created successfully!', appointment });
    } catch (err) {
      next(err);
    }
  };
