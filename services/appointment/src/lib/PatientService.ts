import { IPatientService } from "../services/interfaces/IPatientService";
import { IPatientRepository } from "../repositories/interfaces/IPatientRepository";
import { Patient, Prisma } from "@prisma/client";
// Removed import of prisma from '@/config/prisma'

export class PatientService implements IPatientService {
  private readonly patientRepository: IPatientRepository;

  constructor(patientRepository: IPatientRepository) {
    this.patientRepository = patientRepository;
  }

  /**
   * Check if the patient already exists by userId
   */
  async checkExistingPatient(userId: string): Promise<Patient | null> {
    return this.patientRepository.findByUserId(userId);
  }

  /**
   * Create a new patient
   */
  async createPatient(patientData: Prisma.PatientCreateInput): Promise<Patient> {
    return this.patientRepository.create(patientData);
  }

  /**
   * Get all patients
   */
  async getPatients(): Promise<Patient[]> {
    return this.patientRepository.findMany();
  }

  /**
   * Get patient by patientId
   */
  async getPatientById(patientId: string): Promise<Patient | null> {
    return this.patientRepository.findById(patientId);
  }
}

export default PatientService;
