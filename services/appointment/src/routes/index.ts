import { Router } from 'express';
import prisma from '@/config/prisma';
import redis from '@/config/redis'; // Assuming default export for ioredis instance

// Repository Classes
import { AppointmentRepository } from '@/lib/repositories/AppointmentRepository';
import { PatientRepository } from '@/lib/repositories/PatientRepository';
import { ProviderRepository } from '@/lib/repositories/ProviderRepository';

// Utility Service Classes
import { RedisCacheService } from '@/lib/services/RedisCacheService';
import { RabbitMQService } from '@/lib/services/RabbitMQService';

// Core Service Classes
import { AppointmentService } from '@/lib/AppointmentService'; // Corrected: AppointmentService class
import { PatientService } from '@/lib/PatientService';       // Corrected: PatientService class
import { ProviderService } from '@/lib/ProviderService';     // Corrected: ProviderService class

// Controller Factory Functions
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  deleteAppointmentById,
  getAppointmentsByPatientId,
  createPatient,
  getPatients,
  createProvider,
  getProviders,
} from '@/controllers';

const router = Router();

// Instantiate Utility Components
const cacheService = new RedisCacheService(redis);
const messageQueueService = new RabbitMQService(); // Assumes default RabbitMQ_URL is handled internally

// Instantiate Repositories
const appointmentRepository = new AppointmentRepository(prisma);
const patientRepository = new PatientRepository(prisma);
const providerRepository = new ProviderRepository(prisma);

// Instantiate Core Services (Injecting Dependencies)
const appointmentService = new AppointmentService(appointmentRepository, cacheService, messageQueueService);
const patientService = new PatientService(patientRepository);
const providerService = new ProviderService(providerRepository);

// Route Definitions

// Appointment Routes
router.post('/appointments', createAppointment(appointmentService));
router.get('/appointments', getAppointments(appointmentService));
// Using more distinct paths to avoid ambiguity
router.get('/appointments/detail/:id', getAppointmentById(appointmentService));
router.delete('/appointments/detail/:id', deleteAppointmentById(appointmentService));
router.get('/appointments/by-patient/:patientId', getAppointmentsByPatientId(appointmentService));

// Patient Routes
router.post('/patients', createPatient(patientService));
router.get('/patients', getPatients(patientService));

// Provider Routes
router.post('/providers', createProvider(providerService));
router.get('/providers', getProviders(providerService));

export default router;
