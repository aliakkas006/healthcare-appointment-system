import { EMAIL_SERVICE } from '@/config/config_url';
import logger from '@/config/logger';
import axios from 'axios';
import { User, VerificationCode, Prisma } from '@prisma/client';
import { IAuthEmailService } from './services/interfaces/IAuthEmailService';
import { IAuthUserRepository } from './repositories/interfaces/IAuthUserRepository';
import { IVerificationCodeRepository } from './repositories/interfaces/IVerificationCodeRepository';

class AuthEmailService implements IAuthEmailService {
  private readonly authUserRepository: IAuthUserRepository;
  private readonly verificationCodeRepository: IVerificationCodeRepository;

  constructor(
    authUserRepository: IAuthUserRepository,
    verificationCodeRepository: IVerificationCodeRepository
  ) {
    this.authUserRepository = authUserRepository;
    this.verificationCodeRepository = verificationCodeRepository;
  }

  /**
   * Create verification code and save it to the database
   */
  public async createVerificationCode(userId: string, code: string): Promise<void> {
    // The repository method IVerificationCodeRepository.create returns Promise<VerificationCode>
    // If void is strictly needed, we don't return its result.
    await this.verificationCodeRepository.create({
      userId,
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      // Assuming 'status' defaults to 'PENDING' or similar in the Prisma model or is handled by DB default
    });
  }

  /**
   * Send the verification email.
   */
  public async sendVerificationEmail(recipient: string, code: string): Promise<void> {
    logger.info('Sending verification email to:', recipient);
    // This method remains unchanged as it deals with inter-service communication (business logic).
    await axios.post(`${EMAIL_SERVICE}/emails/send`, {
      recipient,
      subject: 'Email Verification',
      body: `Your verification code is ${code}`,
      source: 'user-registration',
    });
  }

  /**
   * Verify user email via verification code
   */
  public async verifyUserEmail(email: string, code: string): Promise<{ user: User; verificationCode: VerificationCode }> {
    const user = await this.authUserRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // find the verification code
    const verificationCode = await this.verificationCodeRepository.findFirst({
      userId: user.id, // Prisma.VerificationCodeWhereInput needs properties directly
      code,
      status: 'PENDING', // It's good practice to only verify pending codes
    });

    if (!verificationCode) {
      throw new Error('Invalid or already used verification code');
    }

    // if the code has expired
    if (verificationCode.expiresAt < new Date()) {
      throw new Error('Verification code expired');
    }

    return { user, verificationCode };
  }

  /**
   * Update user account status
   */
  public async updateUserStatus(userId: string): Promise<void> {
    // The repository method IAuthUserRepository.updateUser returns Promise<User | null>
    // If void is strictly needed, we don't return its result.
    await this.authUserRepository.updateUser(userId, { verified: true, status: 'ACTIVE' });
  }

  /**
   * Update verification code status
   */
  public async updateVerificationCodeStatus(verificationCodeId: string): Promise<void> {
    // The repository method IVerificationCodeRepository.update returns Promise<VerificationCode | null>
    // If void is strictly needed, we don't return its result.
    await this.verificationCodeRepository.update(verificationCodeId, { status: 'USED', verifiedAt: new Date() });
  }

  /**
   * Send verification success email
   */
  public async sendVerificationSuccessEmail(recipient: string): Promise<void> {
    // This method remains unchanged as it deals with inter-service communication (business logic).
    await axios.post(`${EMAIL_SERVICE}/emails/send`, {
      recipient,
      subject: 'Email Verified',
      body: 'Your email has been verified successfully',
      source: 'verify-email',
    });
  }
}

export default AuthEmailService;
