import { IMedicationService } from "./interfaces/IMedicationService";
import { IMedicationRepository } from "../repositories/interfaces/IMedicationRepository";
import { Medication, Prisma } from "@prisma/client";
import logger from '@/config/logger'; // Optional: if specific logging needed in these simple methods

export class MedicationService implements IMedicationService {
  private readonly medicationRepository: IMedicationRepository;

  constructor(medicationRepository: IMedicationRepository) {
    this.medicationRepository = medicationRepository;
  }

  async createMedication(medicationData: Prisma.MedicationCreateInput): Promise<Medication> {
    try {
      // logger.info('Creating medication in MedicationService:', medicationData); // Example logging
      return this.medicationRepository.create(medicationData);
    } catch (error) {
      logger.error('Error in MedicationService.createMedication:', error);
      throw error;
    }
  }

  async getMedications(): Promise<Medication[]> {
    try {
      // logger.info('Fetching all medications in MedicationService'); // Example logging
      return this.medicationRepository.findMany();
    } catch (error) {
      logger.error('Error in MedicationService.getMedications:', error);
      throw error;
    }
  }

  async getMedicationsByEhrId(ehrId: string): Promise<Medication[]> {
    try {
      // logger.info(`Fetching medications for ehrId ${ehrId} in MedicationService`); // Example logging
      return this.medicationRepository.findManyByEhrId(ehrId);
    } catch (error) {
      logger.error(`Error in MedicationService.getMedicationsByEhrId for ehrId ${ehrId}:`, error);
      throw error;
    }
  }
}

export default MedicationService;
