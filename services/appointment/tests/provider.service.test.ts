import { ProviderService } from '@/lib/ProviderService';
import { IProviderRepository } from '@/lib/repositories/interfaces/IProviderRepository';
import { HealthcareProvider, Prisma, UserRole } from '@prisma/client'; // Assuming common enums might be needed

const mockProviderRepository: jest.Mocked<IProviderRepository> = {
  findByUserId: jest.fn(),
  create: jest.fn(),
  findMany: jest.fn(),
};

describe('ProviderService', () => {
  let providerService: ProviderService;

  beforeEach(() => {
    jest.clearAllMocks();
    providerService = new ProviderService(mockProviderRepository);
  });

  const sampleProvider: HealthcareProvider = {
    id: 'provider-123',
    userId: 'user-abc',
    name: 'Dr. Smith',
    specialty: 'Cardiology',
    contactInfo: 'clinic@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const sampleProviderInput: Prisma.HealthcareProviderCreateInput = {
    user: { connect: { id: 'user-abc' } },
    name: 'Dr. Smith',
    specialty: 'Cardiology',
    contactInfo: 'clinic@example.com',
  };

  describe('checkExistingProvider', () => {
    it('should call repository.findByUserId and return its result', async () => {
      mockProviderRepository.findByUserId.mockResolvedValue(sampleProvider);
      const result = await providerService.checkExistingProvider('user-abc');
      expect(mockProviderRepository.findByUserId).toHaveBeenCalledWith('user-abc');
      expect(result).toEqual(sampleProvider);
    });

    it('should return null if repository.findByUserId returns null', async () => {
      mockProviderRepository.findByUserId.mockResolvedValue(null);
      const result = await providerService.checkExistingProvider('unknown-user');
      expect(result).toBeNull();
    });
  });

  describe('createProvider', () => {
    it('should call repository.create with providerData and return the created provider', async () => {
      mockProviderRepository.create.mockResolvedValue(sampleProvider);
      const result = await providerService.createProvider(sampleProviderInput);
      expect(mockProviderRepository.create).toHaveBeenCalledWith(sampleProviderInput);
      expect(result).toEqual(sampleProvider);
    });
  });

  describe('getProviders', () => {
    it('should call repository.findMany and return a list of providers', async () => {
      const providersArray = [sampleProvider, { ...sampleProvider, id: 'provider-456', userId: 'user-xyz' }];
      mockProviderRepository.findMany.mockResolvedValue(providersArray);
      const result = await providerService.getProviders();
      expect(mockProviderRepository.findMany).toHaveBeenCalled();
      expect(result).toEqual(providersArray);
    });
  });
});
