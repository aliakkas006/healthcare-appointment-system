import prisma from '@/prisma';
import jwt from 'jsonwebtoken';

class TokenService {
  /**
   * Validate access token
   */
  validateAccessToken(accessToken: string) {
    return jwt.verify(accessToken, process.env.JWT_SECRET as string);
  }

  /**
   * Get user from access token
   */
  public async getUserFromToken(decoded: any) {
    const user = await prisma.user.findUnique({
      where: { id: (decoded as any).userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return user;
  }
}

const tokenService = new TokenService();

export default tokenService;
