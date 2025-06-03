import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

export interface ITokenService {
  validateAccessToken(accessToken: string): string | jwt.JwtPayload | null;
  getUserFromToken(decoded: string | jwt.JwtPayload): Promise<User | null>;
}
