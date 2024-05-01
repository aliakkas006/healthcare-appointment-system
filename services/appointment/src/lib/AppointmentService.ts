import prisma from '@/prisma';
import sendToQueue from '@/queue';
import redis from '@/redis';

class AppointmentService {
  /**
   * Create a new appointment
   * Send an email notification to the patient
   * Invalidate cache for all appointments
   * @param appointmentData - Data for the new appointment
   */
  public async createAppointment(appointmentData: any) {
    try {
      const appointment = await prisma.appointment.create({
        data: appointmentData,
      });
      
      await sendToQueue('send-email', JSON.stringify(appointment));

      await redis.del('appointments');

      return appointment;
    } catch (err) {
      console.error('Error creating appointment:', err);
      throw err;
    }
  }

  /**
   * Get All appointments from cache or database
   * Cache appointments data for future requests
   */
  public async getAppointments() {
    try {
      // Check if appointments data is cached
      const cachedAppointments = await redis.get('appointments');
      if (cachedAppointments) {
        return JSON.parse(cachedAppointments);
      }

      // If not cached, fetch appointments from the database
      const appointments = await prisma.appointment.findMany();

      // Cache appointments data for future requests
      await redis.set('appointments', JSON.stringify(appointments));

      return appointments;
    } catch (err) {
      console.error('Error fetching appointments:', err);
      throw err;
    }
  }

  /**
   * Get appointments by patientId
   * Cache appointments data for future requests
   */
  public async getAppointmentsByPatientId(patientId: string) {
    try {
      // Check if appointments data is cached
      const cachedAppointments = await redis.get(`appointments:${patientId}`);
      if (cachedAppointments) {
        return JSON.parse(cachedAppointments);
      }

      // If not cached, fetch appointments from the database
      const appointments = await prisma.appointment.findMany({
        where: { patientId },
      });

      // Cache appointments data for future requests
      await redis.set(
        `appointments:${patientId}`,
        JSON.stringify(appointments)
      );

      return appointments;
    } catch (err) {
      console.error('Error fetching appointments:', err);
      throw err;
    }
  }

  /**
   * Get appointments by providerId
   */
  public async getAppointmentsByProviderId(providerId: string) {
    return prisma.appointment.findMany({
      where: { providerId },
    });
  }

  /**
   * Get appointment by appointmentId
   * Cache appointment data for future requests
   */
  public async getAppointmentById(appointmentId: string) {
    try {
      // Check if appointment data is cached
      const cachedAppointment = await redis.get(`appointment:${appointmentId}`);
      if (cachedAppointment) {
        return JSON.parse(cachedAppointment);
      }

      // If not cached, fetch appointment from the database
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
      });

      // Cache appointment data for future requests
      await redis.set(
        `appointment:${appointmentId}`,
        JSON.stringify(appointment)
      );

      return appointment;
    } catch (err) {
      console.error('Error fetching appointment:', err);
      throw err;
    }
  }

  /**
   * Update an appointment
   */
  public async updateAppointment(appointmentId: string, appointmentData: any) {
    return prisma.appointment.update({
      where: { id: appointmentId },
      data: appointmentData,
    });
  }

  /**
   * Delete an appointment
   */
  public async deleteAppointment(appointmentId: string) {
    return prisma.appointment.delete({
      where: { id: appointmentId },
    });
  }

  /**
   * Get appointments by date
   */
  public async getAppointmentsByDate(date: string) {
    return prisma.appointment.findMany({
      where: { date },
    });
  }
}

const appointmentService = new AppointmentService();

export default appointmentService;
