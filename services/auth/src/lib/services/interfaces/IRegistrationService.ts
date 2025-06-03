import { User } from '@prisma/client';

export interface IRegistrationService {
  checkExistingUser(email: string): Promise<User | null>;
  generateHash(password: string): Promise<string>;
  createUser(userData: any): Promise<User>;
  createUserProfile(userId: string, name: string, email: string): Promise<any>;
}
