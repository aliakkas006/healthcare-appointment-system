import { User } from '@prisma/client';
import { IUserService } from './IUserService';
import { IUserRepository } from './IUserRepository';

class UserService implements IUserService {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Check if the authUserId already exists
   * @param authUserId
   */
  public async checkExistingUser(authUserId: string): Promise<User | null> {
    return this.userRepository.findByAuthId(authUserId);
  }

  /**
   * Create a new user
   * @param userData
   */
  public async createUser(userData: any): Promise<User> {
    return this.userRepository.create(userData);
  }

  /**
   * Get user by id
   * @param id
   * @param field
   */
  public async getUserById(id: string, field: string): Promise<User | null> {
    if (field === 'authUserId') {
      return this.userRepository.findByAuthId(id);
    } else {
      return this.userRepository.findById(id);
    }
  }

  /**
   * Update user by id
   * @param id
   * @param data
   */
  public async updateUserById(id: string, userData: any): Promise<User | null> {
    return this.userRepository.update(id, userData);
  }

  /**
   * Delete user by id
   * @param id
   */
  public async deleteUserById(id: string): Promise<User | null> {
    return this.userRepository.delete(id);
  }

  /**
   * Get all users
   * @returns {Promise<User[]>}
   */
  public async getUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}

export default UserService;
