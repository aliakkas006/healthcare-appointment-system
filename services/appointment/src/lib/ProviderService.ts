import { IProviderService } from "../services/interfaces/IProviderService";
import { IProviderRepository } from "../repositories/interfaces/IProviderRepository";
import { HealthcareProvider, Prisma } from "@prisma/client";
// Removed import of prisma from '@/config/prisma'

export class ProviderService implements IProviderService {
  private readonly providerRepository: IProviderRepository;

  constructor(providerRepository: IProviderRepository) {
    this.providerRepository = providerRepository;
  }

  /**
   * Check if the healthcare provider already exists by userId
   */
  async checkExistingProvider(userId: string): Promise<HealthcareProvider | null> {
    return this.providerRepository.findByUserId(userId);
  }

  /**
   * Create a new healthcare provider
   */
  async createProvider(providerData: Prisma.HealthcareProviderCreateInput): Promise<HealthcareProvider> {
    return this.providerRepository.create(providerData);
  }

  /**
   * Get all healthcare providers
   */
  async getProviders(): Promise<HealthcareProvider[]> {
    return this.providerRepository.findMany();
  }
}

export default ProviderService;
