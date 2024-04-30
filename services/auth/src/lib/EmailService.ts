import { EMAIL_SERVICE } from '@/config';
import prisma from '@/prisma';
import axios from 'axios';

class EmailService {
  /**
   * Generates a random 5-digit verification code.
   */
  public generateVerificationCode() {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return randomNum.toString();
  }

  /**
   * Create verification code and save it to the database
   */
  public async createVerificationCode(userId: string, code: string) {
    await prisma.verificationCode.create({
      data: {
        userId,
        code,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });
  }

  /**
   * Send the verification email.
   */
  public async sendVerificationEmail(recipient: string, code: string) {
    console.log('Sending verification email to:', recipient);

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
  public async verifyUserEmail(email: string, code: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // find the verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        code,
      },
    });

    if (!verificationCode) {
      throw new Error('Invalid verification code');
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
  public async updateUserStatus(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { verified: true, status: 'ACTIVE' },
    });
  }

  /**
   * Update verification code status
   */
  public async updateVerificationCodeStatus(verificationCodeId) {
    await prisma.verificationCode.update({
      where: { id: verificationCodeId },
      data: { status: 'USED', verifiedAt: new Date() },
    });
  }

  /**
   * Send verification success email
   */
  public async sendVerificationSuccessEmail(recipient: string) {
    await axios.post(`${EMAIL_SERVICE}/emails/send`, {
      recipient,
      subject: 'Email Verified',
      body: 'Your email has been verified successfully',
      source: 'verify-email',
    });
  }
}

const emailService = new EmailService();

export default emailService;
