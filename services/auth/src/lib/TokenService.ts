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
      // Handle invalid token (e.g., expired, malformed)
      // Depending on requirements, you might log the error or return null
      return null;
    }
  }

  /**
   * Get user from access token payload
   */
  public async getUserFromToken(decoded: string | JwtPayload): Promise<User | null> {
    // Ensure decoded is not a string and has userId property
    if (typeof decoded === 'string' || !('userId' in decoded)) {
      // Or throw an error, depending on how invalid decoded payloads should be handled
      return null; 
    }

    // The repository's findById method should return the full User object or necessary fields.
    // The previous 'select' clause is now implicitly handled by the repository.
    // IAuthUserRepository.findById returns Promise<User | null>
    const user = await this.authUserRepository.findById(decoded.userId);
    
    return user;
  }
}

export default TokenService;
