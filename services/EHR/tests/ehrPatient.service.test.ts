import { EHRPatientService } from '@/lib/services/EHRPatientService';
import { IEHRPatientRepository } from '@/lib/repositories/interfaces/IEHRPatientRepository';
import { Patient, Prisma, Gender } from '@prisma/client';
import logger from '@/config/logger';

jest.mock('@/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const mockEHRPatientRepository: jest.Mocked<IEHRPatientRepository> = {
  findByUserId: jest.fn(),
  create: jest.fn(),
};

describe('EHRPatientService', () => {
  let ehrPatientService: EHRPatientService;

  beforeEach(() => {
    jest.clearAllMocks();
    ehrPatientService = new EHRPatientService(mockEHRPatientRepository);
  });

  const sampleUserId = 'user-123';
  const samplePatient: Patient = {
    id: 'patient-abc',
    userId: sampleUserId,
    ehrId: 'ehr-xyz',
    name: 'Jane Doe',
    dateOfBirth: new Date('1985-05-15'),
    gender: Gender.FEMALE,
    contactInfo: '098-765-4321',
    address: '456 Oak St',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const samplePatientInput: Prisma.PatientCreateInput = {
    user: { connect: { id: sampleUserId } },
    ehrId: 'ehr-xyz',
    name: 'Jane Doe',
    dateOfBirth: new Date('1985-05-15'),
    gender: Gender.FEMALE,
    contactInfo: '098-765-4321',
    address: '456 Oak St',
  };

  describe('checkExistingPatient', () => {
    it('should call repository.findByUserId and return its result', async () => {
      mockEHRPatientRepository.findByUserId.mockResolvedValue(samplePatient);
      const result = await ehrPatientService.checkExistingPatient(sampleUserId);
      expect(mockEHRPatientRepository.findByUserId).toHaveBeenCalledWith(sampleUserId);
      expect(result).toEqual(samplePatient);
    });

    it('should return null if repository.findByUserId returns null', async () => {
      mockEHRPatientRepository.findByUserId.mockResolvedValue(null);
      const result = await ehrPatientService.checkExistingPatient('unknown-user');
      expect(result).toBeNull();
    });
     it('should log and re-throw error if repository.findByUserId fails', async () => {
        const error = new Error('FindByUserId failed');
        mockEHRPatientRepository.findByUserId.mockRejectedValue(error);
        await expect(ehrPatientService.checkExistingPatient(sampleUserId)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(`Error in EHRPatientService.checkExistingPatient for userId ${sampleUserId}:`, error);
    });
  });

  describe('createPatient', () => {
    it('should call repository.create with patientData and return the created patient', async () => {
      mockEHRPatientRepository.create.mockResolvedValue(samplePatient);
      const result = await ehrPatientService.createPatient(samplePatientInput);
      expect(mockEHRPatientRepository.create).toHaveBeenCalledWith(samplePatientInput);
      expect(result).toEqual(samplePatient);
    });
     it('should log and re-throw error if repository.create fails', async () => {
        const error = new Error('Create failed');
        mockEHRPatientRepository.create.mockRejectedValue(error);
        await expect(ehrPatientService.createPatient(samplePatientInput)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith('Error in EHRPatientService.createPatient:', error);
    });
  });
});
