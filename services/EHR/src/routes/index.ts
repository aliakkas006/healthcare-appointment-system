import { Router } from 'express';
import {
  createEHR,
  getEHRs,
  getEHRById,
  getEHRByPatientId,
  updateEHRById,
  deleteEHRById,
  createPatient,
  createMedication,
  createDiagnosticReport,
  getMedications,
  getDiagnosticReports,
} from '@/controllers';

const router = Router();

router.post('/ehr', createEHR).get('/ehr', getEHRs);
router
  .get('/ehr/:id', getEHRById)
  .put('/ehr/:id', updateEHRById)
  .delete('/ehr/:id', deleteEHRById);

router.post('/ehr/patient', createPatient);
router.get('/ehr/patient/:patientId', getEHRByPatientId);

router
  .post('/ehr/medications', createMedication)
  .get('/ehr/medications', getMedications);

router
  .post('/ehr/diagnostic-reports', createDiagnosticReport)
  .get('/ehr/diagnostic-reports', getDiagnosticReports);

export default router;
