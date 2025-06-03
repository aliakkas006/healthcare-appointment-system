import { EMAIL_SERVICE, USER_SERVICE } from '@/config/config_url';
import logger from '@/config/logger';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { User, Prisma } from '@prisma/client'; // Added Prisma for input types
import { IRegistrationService } from './services/interfaces/IRegistrationService';
import { IAuthUserRepository } from './repositories/interfaces/IAuthUserRepository';

class RegistrationService implements IRegistrationService {
  private readonly authUserRepository: IAuthUserRepository;

  constructor(authUserRepository: IAuthUserRepository) {
    this.authUserRepository = authUserRepository;
  }

  /**
   * Check if a user with the given email already exists.
   */
  public async checkExistingUser(email: string): Promise<User | null> {
    return this.authUserRepository.findByEmail(email);
  }

  /**
   * Hash a given password.
   */
  public async generateHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  /**
   * Create an auth user.
   * userData should ideally be typed with something like Prisma.UserCreateInput
   * but excluding the id, and perhaps making password mandatory.
   * For now, using 'any' as per previous definitions, but the repository expects Prisma.UserCreateInput.
   */
  public async createUser(
    userData: Omit<Prisma.UserCreateInput, 'id' | 'password'> & {
      password: string;
    }
  ): Promise<User> {
    const hashedPassword = await this.generateHash(userData.password);

    const user = await this.authUserRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  /**
   * Create the user profile by calling the user service.
   */
  public async createUserProfile(
    userId: string,
    name: string,
    email: string
  ): Promise<any> {
    const user = await axios.post(`${USER_SERVICE}/users`, {
      authUserId: userId,
      name,
      email,
    });

    logger.info('USER:', user.data);
    return user;
  }
}

export default RegistrationService;
