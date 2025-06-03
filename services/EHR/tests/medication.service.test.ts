import { MedicationService } from '@/lib/services/MedicationService';
import { IMedicationRepository } from '@/lib/repositories/interfaces/IMedicationRepository';
import { Medication, Prisma } from '@prisma/client';
import logger from '@/config/logger';

jest.mock('@/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const mockMedicationRepository: jest.Mocked<IMedicationRepository> = {
  create: jest.fn(),
  findMany: jest.fn(),
  findManyByEhrId: jest.fn(),
};

describe('MedicationService', () => {
  let medicationService: MedicationService;

  beforeEach(() => {
    jest.clearAllMocks();
    medicationService = new MedicationService(mockMedicationRepository);
  });

  const sampleMedicationId = 'med-123';
  const sampleEhrId = 'ehr-abc';
  const sampleMedication: Medication = {
    id: sampleMedicationId,
    ehrId: sampleEhrId,
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once a day',
    startDate: new Date(),
    endDate: null,
    prescribedBy: 'Dr. Health',
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const sampleMedicationInput: Prisma.MedicationCreateInput = {
    ehr: { connect: { id: sampleEhrId } },
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once a day',
    startDate: new Date(),
    prescribedBy: 'Dr. Health',
  };

  describe('createMedication', () => {
    it('should call repository.create with medicationData and return the created medication', async () => {
      mockMedicationRepository.create.mockResolvedValue(sampleMedication);
      const result = await medicationService.createMedication(sampleMedicationInput);
      expect(mockMedicationRepository.create).toHaveBeenCalledWith(sampleMedicationInput);
      expect(result).toEqual(sampleMedication);
    });
    it('should log and re-throw error if repository.create fails', async () => {
        const error = new Error('Create failed');
        mockMedicationRepository.create.mockRejectedValue(error);
        await expect(medicationService.createMedication(sampleMedicationInput)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith('Error in MedicationService.createMedication:', error);
    });
  });

  describe('getMedications', () => {
    it('should call repository.findMany and return a list of medications', async () => {
      const medicationsArray = [sampleMedication];
      mockMedicationRepository.findMany.mockResolvedValue(medicationsArray);
      const result = await medicationService.getMedications();
      expect(mockMedicationRepository.findMany).toHaveBeenCalled();
      expect(result).toEqual(medicationsArray);
    });
     it('should log and re-throw error if repository.findMany fails', async () => {
        const error = new Error('FindMany failed');
        mockMedicationRepository.findMany.mockRejectedValue(error);
        await expect(medicationService.getMedications()).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith('Error in MedicationService.getMedications:', error);
    });
  });

  describe('getMedicationsByEhrId', () => {
    it('should call repository.findManyByEhrId with ehrId and return medications', async () => {
      const medicationsArray = [sampleMedication];
      mockMedicationRepository.findManyByEhrId.mockResolvedValue(medicationsArray);
      const result = await medicationService.getMedicationsByEhrId(sampleEhrId);
      expect(mockMedicationRepository.findManyByEhrId).toHaveBeenCalledWith(sampleEhrId);
      expect(result).toEqual(medicationsArray);
    });
    it('should log and re-throw error if repository.findManyByEhrId fails', async () => {
        const error = new Error('FindManyByEhrId failed');
        mockMedicationRepository.findManyByEhrId.mockRejectedValue(error);
        await expect(medicationService.getMedicationsByEhrId(sampleEhrId)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(`Error in MedicationService.getMedicationsByEhrId for ehrId ${sampleEhrId}:`, error);
    });
  });
});
