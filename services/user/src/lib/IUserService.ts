import { User } from '@prisma/client';

export interface IUserService {
  checkExistingUser(authUserId: string): Promise<User | null>;
  createUser(userData: any): Promise<User>;
  getUserById(id: string, field: string): Promise<User | null>;
  updateUserById(id: string, userData: any): Promise<User | null>;
  deleteUserById(id: string): Promise<User | null>;
  getUsers(): Promise<User[]>;
}
