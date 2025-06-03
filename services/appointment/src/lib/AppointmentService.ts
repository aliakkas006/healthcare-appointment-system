import { IAppointmentService } from "../services/interfaces/IAppointmentService";
import { IAppointmentRepository } from "../repositories/interfaces/IAppointmentRepository";
import { ICacheService } from "../services/interfaces/ICacheService";
import { IMessageQueueService } from "../services/interfaces/IMessageQueueService";
import { Appointment, Prisma } from "@prisma/client";
import logger from '@/config/logger';

const APPOINTMENTS_CACHE_KEY = 'appointments';
const APPOINTMENT_DETAIL_CACHE_PREFIX = 'appointment:';
const APPOINTMENTS_PATIENT_CACHE_PREFIX = 'appointments:patient:';
const APPOINTMENTS_PROVIDER_CACHE_PREFIX = 'appointments:provider:'; // For consistency if caching is added
const APPOINTMENTS_DATE_CACHE_PREFIX = 'appointments:date:'; // For consistency if caching is added


export class AppointmentService implements IAppointmentService {
  private readonly appointmentRepository: IAppointmentRepository;
  private readonly cacheService: ICacheService;
  private readonly messageQueueService: IMessageQueueService;
  private readonly defaultCacheTTL = 3600; // 1 hour in seconds, example

  constructor(
    appointmentRepository: IAppointmentRepository,
    cacheService: ICacheService,
    messageQueueService: IMessageQueueService
  ) {
    this.appointmentRepository = appointmentRepository;
    this.cacheService = cacheService;
    this.messageQueueService = messageQueueService;
  }

  async createAppointment(appointmentData: Prisma.AppointmentCreateInput): Promise<Appointment> {
    try {
      const appointment = await this.appointmentRepository.create(appointmentData);

      // Publish to queue
      // Assuming 'appointment_exchange' and routing key 'appointment.created'
      // The original used queue 'send-email' and exchange 'appointment'
      await this.messageQueueService.publish('appointment', 'send-email', JSON.stringify(appointment));
      
      // Invalidate general appointments list cache
      await this.cacheService.delete(APPOINTMENTS_CACHE_KEY);
      // Consider invalidating patient/provider specific lists if necessary
      if (appointment.patientId) {
        await this.cacheService.delete(`${APPOINTMENTS_PATIENT_CACHE_PREFIX}${appointment.patientId}`);
      }
      if (appointment.providerId) {
        await this.cacheService.delete(`${APPOINTMENTS_PROVIDER_CACHE_PREFIX}${appointment.providerId}`);
      }
      // Potentially also by date if that list is cached and frequently accessed
      // await this.cacheService.delete(`${APPOINTMENTS_DATE_CACHE_PREFIX}${appointment.date}`);


      logger.info('Appointment created successfully:', appointment);
      return appointment;
    } catch (err) {
      logger.error('Error creating appointment in service:', err);
      throw err;
    }
  }

  async getAppointments(): Promise<Appointment[]> {
    const cacheKey = APPOINTMENTS_CACHE_KEY;
    try {
      const cachedAppointments = await this.cacheService.get<Appointment[]>(cacheKey);
      if (cachedAppointments) {
        logger.info('Appointments fetched from cache');
        return cachedAppointments;
      }

      const appointments = await this.appointmentRepository.findMany();
      await this.cacheService.set(cacheKey, appointments, this.defaultCacheTTL);
      logger.info('Appointments fetched from repository and cached');
      return appointments;
    } catch (err) {
      logger.error('Error fetching appointments in service:', err);
      throw err;
    }
  }

  async getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
    const cacheKey = `${APPOINTMENTS_PATIENT_CACHE_PREFIX}${patientId}`;
    try {
      const cachedAppointments = await this.cacheService.get<Appointment[]>(cacheKey);
      if (cachedAppointments) {
        logger.info(`Appointments for patient ${patientId} fetched from cache`);
        return cachedAppointments;
      }

      const appointments = await this.appointmentRepository.findManyByPatientId(patientId);
      await this.cacheService.set(cacheKey, appointments, this.defaultCacheTTL);
      logger.info(`Appointments for patient ${patientId} fetched from repository and cached`);
      return appointments;
    } catch (err) {
      logger.error(`Error fetching appointments for patient ${patientId} in service:`, err);
      throw err;
    }
  }

  async getAppointmentById(appointmentId: string): Promise<Appointment | null> {
    const cacheKey = `${APPOINTMENT_DETAIL_CACHE_PREFIX}${appointmentId}`;
    try {
      const cachedAppointment = await this.cacheService.get<Appointment>(cacheKey);
      if (cachedAppointment) {
        logger.info(`Appointment ${appointmentId} fetched from cache`);
        return cachedAppointment;
      }

      const appointment = await this.appointmentRepository.findById(appointmentId);
      if (appointment) {
        await this.cacheService.set(cacheKey, appointment, this.defaultCacheTTL);
        logger.info(`Appointment ${appointmentId} fetched from repository and cached`);
      }
      return appointment;
    } catch (err) {
      logger.error(`Error fetching appointment ${appointmentId} in service:`, err);
      throw err;
    }
  }

  async updateAppointment(appointmentId: string, appointmentData: Prisma.AppointmentUpdateInput): Promise<Appointment | null> {
    try {
      const updatedAppointment = await this.appointmentRepository.update(appointmentId, appointmentData);

      if (updatedAppointment) {
        await this.cacheService.delete(`${APPOINTMENT_DETAIL_CACHE_PREFIX}${appointmentId}`);
        await this.cacheService.delete(APPOINTMENTS_CACHE_KEY);
        // Invalidate patient/provider specific lists
        if (updatedAppointment.patientId) {
          await this.cacheService.delete(`${APPOINTMENTS_PATIENT_CACHE_PREFIX}${updatedAppointment.patientId}`);
        }
        if (updatedAppointment.providerId) {
          await this.cacheService.delete(`${APPOINTMENTS_PROVIDER_CACHE_PREFIX}${updatedAppointment.providerId}`);
        }
         // Potentially also by date
        // await this.cacheService.delete(`${APPOINTMENTS_DATE_CACHE_PREFIX}${updatedAppointment.date}`);
        logger.info(`Appointment ${appointmentId} updated successfully and caches invalidated.`);
      }
      return updatedAppointment;
    } catch (err) {
      logger.error(`Error updating appointment ${appointmentId} in service:`, err);
      throw err;
    }
  }

  async deleteAppointment(appointmentId: string): Promise<Appointment | null> {
    try {
      const deletedAppointment = await this.appointmentRepository.deleteById(appointmentId);

      if (deletedAppointment) {
        await this.cacheService.delete(`${APPOINTMENT_DETAIL_CACHE_PREFIX}${appointmentId}`);
        await this.cacheService.delete(APPOINTMENTS_CACHE_KEY);
         // Invalidate patient/provider specific lists
        if (deletedAppointment.patientId) {
          await this.cacheService.delete(`${APPOINTMENTS_PATIENT_CACHE_PREFIX}${deletedAppointment.patientId}`);
        }
        if (deletedAppointment.providerId) {
          await this.cacheService.delete(`${APPOINTMENTS_PROVIDER_CACHE_PREFIX}${deletedAppointment.providerId}`);
        }
        // Potentially also by date
        // await this.cacheService.delete(`${APPOINTMENTS_DATE_CACHE_PREFIX}${deletedAppointment.date}`);
        logger.info(`Appointment ${appointmentId} deleted successfully and caches invalidated.`);
      }
      return deletedAppointment;
    } catch (err) {
      logger.error(`Error deleting appointment ${appointmentId} in service:`, err);
      throw err;
    }
  }

  async getAppointmentsByProviderId(providerId: string): Promise<Appointment[]> {
    // Caching for this method can be added if needed, similar to getAppointmentsByPatientId
    const cacheKey = `${APPOINTMENTS_PROVIDER_CACHE_PREFIX}${providerId}`;
    try {
        const cachedAppointments = await this.cacheService.get<Appointment[]>(cacheKey);
        if (cachedAppointments) {
            logger.info(`Appointments for provider ${providerId} fetched from cache`);
            return cachedAppointments;
        }
        const appointments = await this.appointmentRepository.findManyByProviderId(providerId);
        await this.cacheService.set(cacheKey, appointments, this.defaultCacheTTL);
        logger.info(`Appointments for provider ${providerId} fetched from repository and cached`);
        return appointments;
    } catch (err) {
        logger.error(`Error fetching appointments for provider ${providerId} in service:`, err);
        throw err;
    }
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    // Caching for this method can be added if needed
    const cacheKey = `${APPOINTMENTS_DATE_CACHE_PREFIX}${date}`;
     try {
        const cachedAppointments = await this.cacheService.get<Appointment[]>(cacheKey);
        if (cachedAppointments) {
            logger.info(`Appointments for date ${date} fetched from cache`);
            return cachedAppointments;
        }
        const appointments = await this.appointmentRepository.findManyByDate(date);
        await this.cacheService.set(cacheKey, appointments, this.defaultCacheTTL);
        logger.info(`Appointments for date ${date} fetched from repository and cached`);
        return appointments;
    } catch (err) {
        logger.error(`Error fetching appointments for date ${date} in service:`, err);
        throw err;
    }
  }
}

export default AppointmentService;
