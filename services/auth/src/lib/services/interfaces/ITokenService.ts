import { User } from "@prisma/client";
import * as jwt from 'jsonwebtoken'; // For JwtPayload type

export interface ITokenService {
  validateAccessToken(accessToken: string): string | jwt.JwtPayload | null; // jwt.verify can return string or JwtPayload
  getUserFromToken(decoded: string | jwt.JwtPayload): Promise<User | null>;
}
