import { HealthcareProvider, Prisma } from '@prisma/client';

export interface IProviderService {
  checkExistingProvider(userId: string): Promise<HealthcareProvider | null>;
  createProvider(
    providerData: Prisma.HealthcareProviderCreateInput
  ): Promise<HealthcareProvider>;
  getProviders(): Promise<HealthcareProvider[]>;
}
