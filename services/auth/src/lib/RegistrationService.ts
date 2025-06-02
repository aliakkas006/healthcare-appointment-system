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
  public async createUser(userData: Omit<Prisma.UserCreateInput, 'id' | 'password'> & {password: string} ): Promise<User> {
    const hashedPassword = await this.generateHash(userData.password);

    // The repository's createUser method will handle the actual creation.
    // If a specific 'select' is needed, it should ideally be part of the repository's method
    // or this service needs to trust the repository returns all necessary fields.
    // For now, we assume the repository returns a full User object or the required subset.
    const user = await this.authUserRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
    
    // If specific fields were previously selected (id, email, name, role, status, verified),
    // and the repository returns more, this is fine. If it returns less, this might be an issue.
    // The IAuthUserRepository.createUser returns Promise<User>, which implies all fields.
    return user;
  }

  /**
   * Create the user profile by calling the user service.
   */
  public async createUserProfile(userId: string, name: string, email: string): Promise<any> {
    // This method remains unchanged as it deals with inter-service communication (business logic).
    const user = await axios.post(`${USER_SERVICE}/users`, {
      authUserId: userId,
      name,
      email,
    });

    logger.info('USER:', user.data);
    return user; // The return type is Promise<AxiosResponse<any>>, effectively Promise<any> for the data part.
  }
}

export default RegistrationService;
