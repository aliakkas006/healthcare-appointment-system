import { EMAIL_SERVICE, USER_SERVICE } from '@/config';
import prisma from '@/prisma';
import axios from 'axios';
import bcrypt from 'bcryptjs';

class RegistrationService {
  /**
   * Generates a random 5-digit verification code.
   */
  private generateVerificationCode() {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return randomNum.toString();
  }

  /**
   * Check if a user with the given email already exists.
   */
  public async checkExistingUser(email: string) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return existingUser;
  }

  /**
   * Hash a given password.
   */
  public async generateHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  /**
   * Create a auth user.
   */
  public async createUser(userData) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: await this.generateHash(userData.password),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        verified: true,
      },
    });
    return user;
  }

  /**
   * Create the user profile by calling the user service.
   */
  public async createUserProfile(userId: string, name: string, email: string) {
    const user = await axios.post(`${USER_SERVICE}/users`, {
      authUserId: userId,
      name,
      email,
    });

    console.log('USER:', user.data);
    return user;
  }

  /**
   * Create a verification code.
   */
  public async createVerificationCode(userId) {
    const verificationCode = await prisma.verificationCode.create({
      data: {
        userId,
        code: this.generateVerificationCode(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });
    return verificationCode;
  }

  /**
   * Send the verification email.
   */
  public async sendVerificationEmail(recipient: string) {
    await axios.post(`${EMAIL_SERVICE}/emails/send`, {
      recipient,
      subject: 'Email Verification',
      body: `Your verification code is ${this.generateVerificationCode()}`,
      source: 'user-registration',
    });
  }
}

const registrationService = new RegistrationService();

export default registrationService;
