import { EHRCentralService } from '@/lib/EHRCentralService';
import { IEHRRepository, EHRWithRelations } from '@/lib/repositories/interfaces/IEHRRepository';
import { ICacheService } from '@/lib/services/interfaces/ICacheService';
import { IMessageQueueService } from '@/lib/services/interfaces/IMessageQueueService';
import { eHR, Prisma, Medication, DiagnosticReport, PatientStatus } from '@prisma/client'; // Assuming PatientStatus might be part of eHR's patient relation
import logger from '@/config/logger';

jest.mock('@/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Cache key constants from EHRCentralService
const EHRS_CACHE_KEY = 'EHRs';
const EHR_DETAIL_CACHE_PREFIX = 'EHR:';
const EHR_PATIENT_CACHE_PREFIX = 'EHR:patient:';

const mockEhrRepository: jest.Mocked<IEHRRepository> = {
  findByPatientEmail: jest.fn(),
  create: jest.fn(),
  findMany: jest.fn(),
  findFirstByPatientId: jest.fn(),
  findById: jest.fn(), // Though findByIdWithRelations is primary for getEHRById
  findByIdWithRelations: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
};

const mockCacheService: jest.Mocked<ICacheService> = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  deleteAllWithPrefix: jest.fn(), // Included if defined in ICacheService
};

const mockMessageQueueService: jest.Mocked<IMessageQueueService> = {
  publish: jest.fn(),
};

describe('EHRCentralService', () => {
  let ehrCentralService: EHRCentralService;
  const defaultCacheTTL = 3600; // Matching service's default for assertions

  beforeEach(() => {
    jest.clearAllMocks();
    ehrCentralService = new EHRCentralService(
      mockEhrRepository,
      mockCacheService,
      mockMessageQueueService
    );
  });

  const sampleEHRId = 'ehr-123';
  const samplePatientId = 'patient-abc';
  const samplePatientEmail = 'patient@example.com';

  const sampleEHR: eHR = {
    id: sampleEHRId,
    patientId: samplePatientId,
    patientEmail: samplePatientEmail,
    medicalHistories: ['Flu', 'Asthma'],
    allergies: ['Peanuts'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const sampleEHRWithRelations: EHRWithRelations = {
    ...sampleEHR,
    medications: [] as Medication[],
    diagnosticReports: [] as DiagnosticReport[],
  };

  const sampleEHRInput: Prisma.eHRCreateInput = {
    patientEmail: samplePatientEmail,
    patient: { connect: { id: samplePatientId } },
    medicalHistories: ['Flu', 'Asthma'],
    allergies: ['Peanuts'],
  };

  describe('checkExistingEHR', () => {
    it('should call ehrRepository.findByPatientEmail and return the result', async () => {
      mockEhrRepository.findByPatientEmail.mockResolvedValue(sampleEHR);
      const result = await ehrCentralService.checkExistingEHR(samplePatientEmail);
      expect(mockEhrRepository.findByPatientEmail).toHaveBeenCalledWith(samplePatientEmail);
      expect(result).toEqual(sampleEHR);
    });
  });

  describe('createEHR', () => {
    it('should create an EHR, publish to queue, and invalidate caches', async () => {
      mockEhrRepository.create.mockResolvedValue(sampleEHR);
      const result = await ehrCentralService.createEHR(sampleEHRInput);

      expect(mockEhrRepository.create).toHaveBeenCalledWith(sampleEHRInput);
      expect(mockMessageQueueService.publish).toHaveBeenCalledWith(
        'ehr', // exchange
        'send-email', // routing key
        JSON.stringify(sampleEHR)
      );
      expect(mockCacheService.delete).toHaveBeenCalledWith(EHRS_CACHE_KEY);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`${EHR_PATIENT_CACHE_PREFIX}${samplePatientId}`);
      expect(result).toEqual(sampleEHR);
      expect(logger.info).toHaveBeenCalledWith('EHR created successfully by EHRCentralService:', sampleEHR);
    });
  });

  describe('getEHRs', () => {
    it('should return EHRs from cache if available', async () => {
      mockCacheService.get.mockResolvedValue([sampleEHR]);
      const result = await ehrCentralService.getEHRs();
      expect(mockCacheService.get).toHaveBeenCalledWith(EHRS_CACHE_KEY);
      expect(mockEhrRepository.findMany).not.toHaveBeenCalled();
      expect(result).toEqual([sampleEHR]);
    });

    it('should fetch from repository and set to cache if not in cache', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockEhrRepository.findMany.mockResolvedValue([sampleEHR]);
      const result = await ehrCentralService.getEHRs();
      expect(mockCacheService.get).toHaveBeenCalledWith(EHRS_CACHE_KEY);
      expect(mockEhrRepository.findMany).toHaveBeenCalled();
      expect(mockCacheService.set).toHaveBeenCalledWith(EHRS_CACHE_KEY, [sampleEHR], defaultCacheTTL);
      expect(result).toEqual([sampleEHR]);
    });
  });

  describe('getEHRByPatientId', () => {
    const cacheKey = `${EHR_PATIENT_CACHE_PREFIX}${samplePatientId}`;
    it('should return EHR from cache if available', async () => {
      mockCacheService.get.mockResolvedValue(sampleEHR);
      const result = await ehrCentralService.getEHRByPatientId(samplePatientId);
      expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(mockEhrRepository.findFirstByPatientId).not.toHaveBeenCalled();
      expect(result).toEqual(sampleEHR);
    });
    it('should fetch from repository, set to cache, and return EHR if not in cache', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockEhrRepository.findFirstByPatientId.mockResolvedValue(sampleEHR);
      const result = await ehrCentralService.getEHRByPatientId(samplePatientId);
      expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(mockEhrRepository.findFirstByPatientId).toHaveBeenCalledWith(samplePatientId);
      expect(mockCacheService.set).toHaveBeenCalledWith(cacheKey, sampleEHR, defaultCacheTTL);
      expect(result).toEqual(sampleEHR);
    });
  });

  describe('getEHRById', () => {
    const cacheKey = `${EHR_DETAIL_CACHE_PREFIX}${sampleEHRId}`;
    it('should return EHR with relations from cache if available', async () => {
        mockCacheService.get.mockResolvedValue(sampleEHRWithRelations);
        const result = await ehrCentralService.getEHRById(sampleEHRId);
        expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
        expect(mockEhrRepository.findByIdWithRelations).not.toHaveBeenCalled();
        expect(result).toEqual(sampleEHRWithRelations);
    });
    it('should fetch from repository (with relations), set to cache, and return EHR if not in cache', async () => {
        mockCacheService.get.mockResolvedValue(null);
        mockEhrRepository.findByIdWithRelations.mockResolvedValue(sampleEHRWithRelations);
        const result = await ehrCentralService.getEHRById(sampleEHRId);
        expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
        expect(mockEhrRepository.findByIdWithRelations).toHaveBeenCalledWith(sampleEHRId);
        expect(mockCacheService.set).toHaveBeenCalledWith(cacheKey, sampleEHRWithRelations, defaultCacheTTL);
        expect(result).toEqual(sampleEHRWithRelations);
    });
    it('should return null if EHR not found', async () => {
        mockCacheService.get.mockResolvedValue(null);
        mockEhrRepository.findByIdWithRelations.mockResolvedValue(null);
        const result = await ehrCentralService.getEHRById(sampleEHRId);
        expect(result).toBeNull();
        expect(mockCacheService.set).not.toHaveBeenCalled();
    });
  });

  describe('updateEHRById', () => {
    const updateData: Prisma.eHRUpdateInput = { allergies: ['Pollen'] };
    const updatedEHR = { ...sampleEHR, allergies: ['Pollen'] };
    it('should update EHR in repository and invalidate relevant caches', async () => {
      mockEhrRepository.update.mockResolvedValue(updatedEHR);
      const result = await ehrCentralService.updateEHRById(sampleEHRId, updateData);
      expect(mockEhrRepository.update).toHaveBeenCalledWith(sampleEHRId, updateData);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`${EHR_DETAIL_CACHE_PREFIX}${sampleEHRId}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(EHRS_CACHE_KEY);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`${EHR_PATIENT_CACHE_PREFIX}${updatedEHR.patientId}`);
      expect(result).toEqual(updatedEHR);
    });
    it('should return null if EHR to update is not found', async () => {
        mockEhrRepository.update.mockResolvedValue(null);
        const result = await ehrCentralService.updateEHRById(sampleEHRId, updateData);
        expect(result).toBeNull();
        expect(mockCacheService.delete).not.toHaveBeenCalled();
    });
  });

  describe('deleteEHRById', () => {
    it('should delete EHR from repository and invalidate relevant caches', async () => {
      mockEhrRepository.deleteById.mockResolvedValue(sampleEHR);
      const result = await ehrCentralService.deleteEHRById(sampleEHRId);
      expect(mockEhrRepository.deleteById).toHaveBeenCalledWith(sampleEHRId);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`${EHR_DETAIL_CACHE_PREFIX}${sampleEHRId}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(EHRS_CACHE_KEY);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`${EHR_PATIENT_CACHE_PREFIX}${sampleEHR.patientId}`);
      expect(result).toEqual(sampleEHR);
    });
    it('should return null if EHR to delete is not found', async () => {
        mockEhrRepository.deleteById.mockResolvedValue(null);
        const result = await ehrCentralService.deleteEHRById(sampleEHRId);
        expect(result).toBeNull();
        expect(mockCacheService.delete).not.toHaveBeenCalled();
    });
  });
});
