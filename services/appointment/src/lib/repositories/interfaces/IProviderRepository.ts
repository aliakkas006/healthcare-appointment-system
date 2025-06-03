import { HealthcareProvider, Prisma } from '@prisma/client';

export interface IProviderRepository {
  findByUserId(userId: string): Promise<HealthcareProvider | null>;
  create(
    data: Prisma.HealthcareProviderCreateInput
  ): Promise<HealthcareProvider>;
  findMany(): Promise<HealthcareProvider[]>;
}
