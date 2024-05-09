import prisma from '@/config/prisma';

class ProviderService {
  /**
   * Check if the healthcare provider already exists
   */
  public async checkExistingProvider(userId: string) {
    return prisma.healthcareProvider.findUnique({
      where: {
        userId,
      },
    });
  }

  /**
   * Create a new healthcare provider
   */
  public async createProvider(Providerdata: any) {
    return prisma.healthcareProvider.create({
      data: Providerdata,
    });
  }

  /**
   * Get all healthcare providers
   */
  public async getProviders() {
    return prisma.healthcareProvider.findMany();
  }
}

const providerService = new ProviderService();

export default providerService;
