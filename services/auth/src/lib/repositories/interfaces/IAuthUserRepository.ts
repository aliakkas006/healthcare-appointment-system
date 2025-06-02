import { User } from "@prisma/client";

export interface IAuthUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  createUser(userData: any): Promise<User>; // TODO: Refine 'any' to a specific type e.g. AuthUserCreateInput
  updateUser(id: string, data: Partial<User>): Promise<User | null>;
}
