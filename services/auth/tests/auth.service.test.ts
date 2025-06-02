import LoginService from '@/lib/LoginService';
import { IAuthUserRepository } from '@/lib/repositories/interfaces/IAuthUserRepository';
import { ILoginHistoryRepository } from '@/lib/repositories/interfaces/ILoginHistoryRepository';
import { User, UserStatus, Role } from '@prisma/client';
import { LoginHistory, LoginAttempt } from '@/types'; // Assuming LoginAttempt is also in @/types
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

const mockAuthUserRepository: jest.Mocked<IAuthUserRepository> = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
};

const mockLoginHistoryRepository: jest.Mocked<ILoginHistoryRepository> = {
  create: jest.fn(),
};

describe('LoginService', () => {
  let loginService: LoginService;

  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.compare as jest.Mock).mockReset();
    loginService = new LoginService(mockAuthUserRepository, mockLoginHistoryRepository);
  });

  describe('login', () => {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    const mockUser: User = {
      id: 'user-1',
      email: testEmail,
      password: 'hashedPassword',
      name: 'Test User',
      role: Role.USER,
      verified: true,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: new Date(),
      image: null,
    };

    it('should return user on successful login', async () => {
      mockAuthUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await loginService.login(testEmail, testPassword);

      expect(mockAuthUserRepository.findByEmail).toHaveBeenCalledWith(testEmail);
      expect(bcrypt.compare).toHaveBeenCalledWith(testPassword, mockUser.password);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      mockAuthUserRepository.findByEmail.mockResolvedValue(null);

      await expect(loginService.login(testEmail, testPassword)).rejects.toThrow('Invalid credentials');
      expect(mockAuthUserRepository.findByEmail).toHaveBeenCalledWith(testEmail);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw an error for incorrect password', async () => {
      mockAuthUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(loginService.login(testEmail, testPassword)).rejects.toThrow('Invalid credentials');
      expect(bcrypt.compare).toHaveBeenCalledWith(testPassword, mockUser.password);
    });

    it('should throw an error if user is not verified', async () => {
      const unverifiedUser = { ...mockUser, verified: false };
      mockAuthUserRepository.findByEmail.mockResolvedValue(unverifiedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(loginService.login(testEmail, testPassword)).rejects.toThrow('User not verified');
    });

    it('should throw an error if user account is not active', async () => {
      const inactiveUser = { ...mockUser, status: UserStatus.INACTIVE };
      mockAuthUserRepository.findByEmail.mockResolvedValue(inactiveUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(loginService.login(testEmail, testPassword)).rejects.toThrow('Your account is inactive');
    });

     it('should throw an error if user account is suspended', async () => {
      const suspendedUser = { ...mockUser, status: UserStatus.SUSPENDED };
      mockAuthUserRepository.findByEmail.mockResolvedValue(suspendedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(loginService.login(testEmail, testPassword)).rejects.toThrow('Your account is suspended');
    });
  });

  describe('createLoginHistory', () => {
    it('should call loginHistoryRepository.create with the provided info', async () => {
      const loginHistoryData: LoginHistory = {
        userId: 'user-1',
        userAgent: 'test-agent',
        ipAddress: '127.0.0.1',
        attempt: LoginAttempt.SUCCESS, // Assuming LoginAttempt is part of your types
      };
      mockLoginHistoryRepository.create.mockResolvedValue(loginHistoryData as any); // Cast if CreateInput vs Model mismatch

      await loginService.createLoginHistory(loginHistoryData);

      expect(mockLoginHistoryRepository.create).toHaveBeenCalledWith(loginHistoryData);
    });
  });

  describe('generateAccessToken', () => {
    it('should return a JWT token string', () => {
      const userId = 'user-1';
      const email = 'test@example.com';
      const name = 'Test User';
      const role = Role.USER;

      const token = loginService.generateAccessToken(userId, email, name, role);

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      // For more detailed validation, you might decode it and check payload, but that's often for integration tests.
    });
  });
});
