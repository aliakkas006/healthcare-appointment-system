import { PatientService } from '@/lib/PatientService';
import { IPatientRepository } from '@/lib/repositories/interfaces/IPatientRepository';
import { Patient, Prisma, UserRole, Gender } from '@prisma/client'; // Assuming common enums might be needed for sample data

const mockPatientRepository: jest.Mocked<IPatientRepository> = {
  findByUserId: jest.fn(),
  create: jest.fn(),
  findMany: jest.fn(),
  findById: jest.fn(),
};

describe('PatientService', () => {
  let patientService: PatientService;

  beforeEach(() => {
    jest.clearAllMocks();
    patientService = new PatientService(mockPatientRepository);
  });

  const samplePatient: Patient = {
    id: 'patient-123',
    userId: 'user-xyz',
    ehrId: 'ehr-abc',
    name: 'John Doe',
    dateOfBirth: new Date('1990-01-01'),
    gender: Gender.MALE,
    contactInfo: '123-456-7890',
    address: '123 Main St',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const samplePatientInput: Prisma.PatientCreateInput = {
    user: { connect: { id: 'user-xyz' } },
    ehrId: 'ehr-abc',
    name: 'John Doe',
    dateOfBirth: new Date('1990-01-01'),
    gender: Gender.MALE,
    contactInfo: '123-456-7890',
    address: '123 Main St',
  };

  describe('checkExistingPatient', () => {
    it('should call repository.findByUserId and return its result', async () => {
      mockPatientRepository.findByUserId.mockResolvedValue(samplePatient);
      const result = await patientService.checkExistingPatient('user-xyz');
      expect(mockPatientRepository.findByUserId).toHaveBeenCalledWith('user-xyz');
      expect(result).toEqual(samplePatient);
    });

    it('should return null if repository.findByUserId returns null', async () => {
      mockPatientRepository.findByUserId.mockResolvedValue(null);
      const result = await patientService.checkExistingPatient('unknown-user');
      expect(result).toBeNull();
    });
  });

  describe('createPatient', () => {
    it('should call repository.create with patientData and return the created patient', async () => {
      mockPatientRepository.create.mockResolvedValue(samplePatient);
      const result = await patientService.createPatient(samplePatientInput);
      expect(mockPatientRepository.create).toHaveBeenCalledWith(samplePatientInput);
      expect(result).toEqual(samplePatient);
    });
  });

  describe('getPatients', () => {
    it('should call repository.findMany and return a list of patients', async () => {
      const patientsArray = [samplePatient, { ...samplePatient, id: 'patient-456', userId: 'user-abc' }];
      mockPatientRepository.findMany.mockResolvedValue(patientsArray);
      const result = await patientService.getPatients();
      expect(mockPatientRepository.findMany).toHaveBeenCalled();
      expect(result).toEqual(patientsArray);
    });
  });

  describe('getPatientById', () => {
    it('should call repository.findById and return the patient if found', async () => {
      mockPatientRepository.findById.mockResolvedValue(samplePatient);
      const result = await patientService.getPatientById('patient-123');
      expect(mockPatientRepository.findById).toHaveBeenCalledWith('patient-123');
      expect(result).toEqual(samplePatient);
    });

    it('should return null if repository.findById returns null', async () => {
      mockPatientRepository.findById.mockResolvedValue(null);
      const result = await patientService.getPatientById('unknown-id');
      expect(result).toBeNull();
    });
  });
});
