import { Router } from 'express';
import prisma from '@/config/prisma';
import redis from '@/config/redis';

// Repository Classes
import { EHRRepository } from '@/lib/repositories/EHRRepository';
import { MedicationRepository } from '@/lib/repositories/MedicationRepository';
import { DiagnosticReportRepository } from '@/lib/repositories/DiagnosticReportRepository';
import { EHRPatientRepository } from '@/lib/repositories/EHRPatientRepository';

// Utility Service Classes
import { RedisCacheService } from '@/lib/services/RedisCacheService';
import { RabbitMQService } from '@/lib/services/RabbitMQService';

// Core Service Classes
import { EHRCentralService } from '@/lib/EHRCentralService'; // Correct path after rename
import { MedicationService } from '@/lib/services/MedicationService';
import { DiagnosticReportService } from '@/lib/services/DiagnosticReportService';
import { EHRPatientService } from '@/lib/services/EHRPatientService';

// Controller Factory Functions
import {
  createEHR,
  getEHRs,
  getEHRById,
  getEHRByPatientId,
  updateEHRById,
  deleteEHRById,
  createPatient,
  createMedication,
  getMedications,
  createDiagnosticReport,
  getDiagnosticReports,
} from '@/controllers';

const router = Router();

// Instantiate Utility Components
const cacheService = new RedisCacheService(redis);
const messageQueueService = new RabbitMQService();

// Instantiate Repositories
const ehrRepository = new EHRRepository(prisma);
const medicationRepository = new MedicationRepository(prisma);
const diagnosticReportRepository = new DiagnosticReportRepository(prisma);
const ehrPatientRepository = new EHRPatientRepository(prisma);

// Instantiate Core Services (Injecting Dependencies)
const ehrCentralService = new EHRCentralService(
  ehrRepository,
  cacheService,
  messageQueueService
);
const medicationService = new MedicationService(medicationRepository);
const diagnosticReportService = new DiagnosticReportService(
  diagnosticReportRepository
);
const ehrPatientService = new EHRPatientService(ehrPatientRepository);

// Route Definitions

// Core EHR Routes
router.post('/ehr', createEHR(ehrCentralService));
router.get('/ehr', getEHRs(ehrCentralService));
router.get('/ehr/:id', getEHRById(ehrCentralService));
router.put('/ehr/:id', updateEHRById(ehrCentralService));
router.delete('/ehr/:id', deleteEHRById(ehrCentralService));
router.get('/ehr/patient/:patientId', getEHRByPatientId(ehrCentralService));
router.post('/ehr/patient', createPatient(ehrPatientService));

// Medication Routes (related to EHRs, but managed by MedicationService)
router.post('/ehr/medications', createMedication(medicationService));
router.get('/ehr/medications', getMedications(medicationService));

// Diagnostic Report Routes (related to EHRs, but managed by DiagnosticReportService)
router.post(
  '/ehr/diagnostic-reports',
  createDiagnosticReport(diagnosticReportService)
);
router.get(
  '/ehr/diagnostic-reports',
  getDiagnosticReports(diagnosticReportService)
);

export default router;
