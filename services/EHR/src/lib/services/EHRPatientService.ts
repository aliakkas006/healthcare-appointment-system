import { IEHRPatientService } from './interfaces/IEHRPatientService';
import { IEHRPatientRepository } from '../repositories/interfaces/IEHRPatientRepository';
import { Patient, Prisma } from '@prisma/client';
import logger from '@/config/logger'; // Optional: if specific logging needed

export class EHRPatientService implements IEHRPatientService {
  private readonly ehrPatientRepository: IEHRPatientRepository;

  constructor(ehrPatientRepository: IEHRPatientRepository) {
    this.ehrPatientRepository = ehrPatientRepository;
  }

  async checkExistingPatient(userId: string): Promise<Patient | null> {
    try {
      return this.ehrPatientRepository.findByUserId(userId);
    } catch (error) {
      logger.error(
        `Error in EHRPatientService.checkExistingPatient for userId ${userId}:`,
        error
      );
      throw error;
    }
  }

  async createPatient(
    patientData: Prisma.PatientCreateInput
  ): Promise<Patient> {
    try {
      return this.ehrPatientRepository.create(patientData);
    } catch (error) {
      logger.error('Error in EHRPatientService.createPatient:', error);
      throw error;
    }
  }
}

export default EHRPatientService;
