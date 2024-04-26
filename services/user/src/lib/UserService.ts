import prisma from '@/prisma';
import { User } from '@prisma/client';

class UserService {
  /**
   * Check if the authUserId already exists
   * @param authUserId
   */
  public async checkExistingUser(authUserId: string) {
    const existingUser = await prisma.user.findUnique({
      where: { authUserId },
    });

    return existingUser;
  }

  /**
   * Create a new user
   * @param userData
   */
  public async createUser(userData: any) {
    const user = await prisma.user.create({
      data: userData,
    });

    return user;
  }

  /**
   * Get user by id
   * @param id
   * @param field
   */
  public async getUserById(id: string, field: string) {
    let user: User | null;

    if (field === 'authUserId') {
      user = await prisma.user.findUnique({ where: { authUserId: id } });
    } else {
      user = await prisma.user.findUnique({ where: { id } });
    }

    return user;
  }

  /**
   * Update user by id
   * @param id
   * @param data
   */
  public async updateUserById(id: string, userData: any) {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });

    return updatedUser;
  }

  /**
   * Delete user by id
   * @param id
   */
  public async deleteUserById(id: string) {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return deletedUser;
  }

  /**
   * Get all users
   * @returns {Promise<User[]>}
   */
  public async getUsers(): Promise<User[]> {
    return prisma.user.findMany();
  }
}

const userService = new UserService();

export default userService;
