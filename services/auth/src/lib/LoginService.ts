import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginHistory } from '@/types';
import { User } from '@prisma/client';
import { ILoginService } from './services/interfaces/ILoginService';
import { IAuthUserRepository } from './repositories/interfaces/IAuthUserRepository';
import { ILoginHistoryRepository } from './repositories/interfaces/ILoginHistoryRepository';

class LoginService implements ILoginService {
  private readonly authUserRepository: IAuthUserRepository;
  private readonly loginHistoryRepository: ILoginHistoryRepository;

  constructor(
    authUserRepository: IAuthUserRepository,
    loginHistoryRepository: ILoginHistoryRepository
  ) {
    this.authUserRepository = authUserRepository;
    this.loginHistoryRepository = loginHistoryRepository;
  }

  /**
   * Create login history
   */
  public async createLoginHistory(info: LoginHistory): Promise<void> {
    await this.loginHistoryRepository.create(info);
  }

  /**
   * Login user with email and password
   */
  public async login(email: string, password: string): Promise<User> {
    // check if the user exists
    const user = await this.authUserRepository.findByEmail(email);
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
  ): string {
    return jwt.sign(
      { userId, email, name, role },
      process.env.JWT_SECRET ?? 'My_Secret_Key',
      { expiresIn: '2h' }
    );
  }
}

export default LoginService;
