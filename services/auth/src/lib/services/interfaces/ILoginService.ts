import { User } from "@prisma/client";
import { LoginHistory } from "@/types"; // Corrected path based on file inspection

export interface ILoginService {
  createLoginHistory(info: LoginHistory): Promise<void>;
  login(email: string, password: string): Promise<User>;
  generateAccessToken(userId: string, email: string, name: string, role: string): string;
}
