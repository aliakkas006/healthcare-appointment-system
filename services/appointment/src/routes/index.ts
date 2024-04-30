import { Router } from 'express';
import {
  createAppointment,
  getAppointments,
  createPatient,
  getPatients,
  createProvider,
  getProviders,
  getAppointmentsByPatientId,
  getAppointmentById,
  deleteAppointmentById,
} from '@/controllers';

const router = Router();

router
  .post('/appointments', createAppointment)
  .get('/appointments', getAppointments);

router
  .get('/appointments/:id', getAppointmentById)
  .delete('/appointments/:id', deleteAppointmentById);

router.get('/appointments/:patientId', getAppointmentsByPatientId);

router.post('/patients', createPatient).get('/patients', getPatients);

router.post('/providers', createProvider).get('/providers', getProviders);

export default router;
