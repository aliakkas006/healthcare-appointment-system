import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { ITokenService } from './services/interfaces/ITokenService';
import { IAuthUserRepository } from './repositories/interfaces/IAuthUserRepository';

class TokenService implements ITokenService {
  private readonly authUserRepository: IAuthUserRepository;

  constructor(authUserRepository: IAuthUserRepository) {
    this.authUserRepository = authUserRepository;
  }

  /**
   * Validate access token
   */
  public validateAccessToken(accessToken: string): string | JwtPayload | null {
    try {
      return jwt.verify(accessToken, process.env.JWT_SECRET as string);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get user from access token payload
   */
  public async getUserFromToken(
    decoded: string | JwtPayload
  ): Promise<User | null> {
    if (typeof decoded === 'string' || !('userId' in decoded)) {
      return null;
    }

    const user = await this.authUserRepository.findById(decoded.userId);

    return user;
  }
}

export default TokenService;
