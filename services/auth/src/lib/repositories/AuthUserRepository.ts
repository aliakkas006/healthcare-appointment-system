import { IAuthUserRepository } from "./interfaces/IAuthUserRepository";
import { User, PrismaClient, Prisma } from "@prisma/client";

export class AuthUserRepository implements IAuthUserRepository {
  private readonly prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaClient.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prismaClient.user.findUnique({ where: { id } });
  }

  async createUser(userData: Prisma.UserCreateInput): Promise<User> {
    return this.prismaClient.user.create({ data: userData });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User | null> {
    return this.prismaClient.user.update({
      where: { id },
      data,
    });
  }
}
