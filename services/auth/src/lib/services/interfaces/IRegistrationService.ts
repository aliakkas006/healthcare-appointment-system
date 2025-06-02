import { User } from "@prisma/client";

// Consider defining AuthUserCreateInput based on schemas if time permits or in a follow-up
// For now, 'any' is used as per instructions for createUser.
// For createUserProfile, return type 'any' is from an axios call.

export interface IRegistrationService {
  checkExistingUser(email: string): Promise<User | null>;
  generateHash(password: string): Promise<string>;
  createUser(userData: any): Promise<User>; // TODO: Refine 'any' to AuthUserCreateInput or similar
  createUserProfile(userId: string, name: string, email: string): Promise<any>; // TODO: Refine 'any' if user service contract is known
}
