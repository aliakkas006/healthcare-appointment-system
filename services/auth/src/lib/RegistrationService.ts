import { EMAIL_SERVICE, USER_SERVICE } from '@/config/config_url';
import logger from '@/config/logger';
import prisma from '@/config/prisma';
import axios from 'axios';
import bcrypt from 'bcryptjs';

class RegistrationService {
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
   * Create an auth user.
   */
  public async createUser(userData: any) {
    const hashedPassword = await this.generateHash(userData.password);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
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

    logger.info('USER:', user.data);
    return user;
  }
}

const registrationService = new RegistrationService();

export default registrationService;
