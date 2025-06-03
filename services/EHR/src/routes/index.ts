import { Router } from 'express';
import prisma from '@/config/prisma';
import redis from '@/config/redis'; // Assuming default export for ioredis instance

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
  createPatient, // This is EHR's createPatient controller
  createMedication,
  getMedications,
  createDiagnosticReport,
  getDiagnosticReports,
} from '@/controllers';

const router = Router();

// Instantiate Utility Components
const cacheService = new RedisCacheService(redis);
const messageQueueService = new RabbitMQService(); // Assumes default RabbitMQ_URL is handled internally

// Instantiate Repositories
const ehrRepository = new EHRRepository(prisma);
const medicationRepository = new MedicationRepository(prisma);
const diagnosticReportRepository = new DiagnosticReportRepository(prisma);
const ehrPatientRepository = new EHRPatientRepository(prisma);

// Instantiate Core Services (Injecting Dependencies)
const ehrCentralService = new EHRCentralService(ehrRepository, cacheService, messageQueueService);
const medicationService = new MedicationService(medicationRepository);
const diagnosticReportService = new DiagnosticReportService(diagnosticReportRepository);
const ehrPatientService = new EHRPatientService(ehrPatientRepository);

// Route Definitions

// Core EHR Routes
router.post('/ehr', createEHR(ehrCentralService));
router.get('/ehr', getEHRs(ehrCentralService));
router.get('/ehr/:id', getEHRById(ehrCentralService));
router.put('/ehr/:id', updateEHRById(ehrCentralService));
router.delete('/ehr/:id', deleteEHRById(ehrCentralService));
router.get('/ehr/patient/:patientId', getEHRByPatientId(ehrCentralService)); // Get EHR by its associated patientId

// Patient creation specific to EHR context (e.g., if a patient record needs to exist before an EHR can be made for them)
router.post('/ehr/patient', createPatient(ehrPatientService));

// Medication Routes (related to EHRs, but managed by MedicationService)
router.post('/ehr/medications', createMedication(medicationService));
router.get('/ehr/medications', getMedications(medicationService));
// Note: Routes like GET /ehr/:ehrId/medications would typically be handled by a medication controller
// that accepts ehrId and uses medicationService.getMedicationsByEhrId(ehrId).
// The current getMedications gets ALL medications, not specific to an EHR via path.

// Diagnostic Report Routes (related to EHRs, but managed by DiagnosticReportService)
router.post('/ehr/diagnostic-reports', createDiagnosticReport(diagnosticReportService));
router.get('/ehr/diagnostic-reports', getDiagnosticReports(diagnosticReportService));
// Similar note for GET /ehr/:ehrId/diagnostic-reports

export default router;
