import prisma from '@/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginHistory } from '@/types';

class UserLoginService {
  /**
   * Create login history
   */
  public async createLoginHistory(info: LoginHistory): Promise<void> {
    await prisma.loginHistory.create({
      data: {
        userId: info.userId,
        userAgent: info.userAgent,
        ipAddress: info.ipAddress,
        attempt: info.attempt,
      },
    });
  }

  /**
   * Login user with email and password
   */
  public async login(email: string, password: string) {
    // check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // check if the user is verified
    if (!user.verified) {
      throw new Error('User not verified');
    }

    // check if the account is active
    if (user.status !== 'ACTIVE') {
      throw new Error(`Your account is ${user.status.toLocaleLowerCase()}`);
    }

    return user;
  }

  /**
   * Generate access token
   */
  public generateAccessToken(
    userId: string,
    email: string,
    name: string,
    role: string
  ) {
    return jwt.sign(
      { userId, email, name, role },
      process.env.JWT_SECRET ?? 'My_Secret_Key',
      { expiresIn: '2h' }
    );
  }
}

const loginService = new UserLoginService();

export default loginService;
