import UserService from '@/lib/UserService';
import { IUserRepository } from '@/lib/IUserRepository';
import { User } from '@prisma/client'; // Import User type for clarity

describe('UserService', () => {
  const mockUserRepository: jest.Mocked<IUserRepository> = {
    findByAuthId: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  };

  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks(); // Important to clear mocks between tests
    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('should call userRepository.create with the given data and return the created user', async () => {
      const newUserData: Partial<User> = { authUserId: 'newAuthId', email: 'test@example.com', name: 'Test User' };
      // Ensure the mock return value satisfies the User type if possible, or use Partial<User>
      const expectedUser: User = { 
        id: '1', 
        authUserId: 'newAuthId', 
        email: 'test@example.com', 
        name: 'Test User',
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock repository methods
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(newUserData);

      // Assert
      expect(mockUserRepository.create).toHaveBeenCalledWith(newUserData);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('checkExistingUser', () => {
    it('should call userRepository.findByAuthId with the given authUserId and return the result', async () => {
      const authUserId = 'existingAuthId';
      const existingUser: User = { 
        id: '1', 
        authUserId: authUserId, 
        email: 'exists@example.com', 
        name: 'Existing User',
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByAuthId.mockResolvedValue(existingUser);

      const result = await userService.checkExistingUser(authUserId);

      expect(mockUserRepository.findByAuthId).toHaveBeenCalledWith(authUserId);
      expect(result).toEqual(existingUser);
    });

    it('should return null if userRepository.findByAuthId returns null', async () => {
      const authUserId = 'nonExistingAuthId';
      mockUserRepository.findByAuthId.mockResolvedValue(null);

      const result = await userService.checkExistingUser(authUserId);

      expect(mockUserRepository.findByAuthId).toHaveBeenCalledWith(authUserId);
      expect(result).toBeNull();
    });
  });

  // Add more describe blocks for other UserService methods (getUserById, etc.) later
});
