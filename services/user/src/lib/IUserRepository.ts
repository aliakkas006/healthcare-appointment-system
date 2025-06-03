import { User } from '@prisma/client';

export interface IUserRepository {
  findByAuthId(authUserId: string): Promise<User | null>;
  create(userData: any): Promise<User>;
  findById(id: string): Promise<User | null>;
  update(id: string, userData: any): Promise<User | null>;
  delete(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
