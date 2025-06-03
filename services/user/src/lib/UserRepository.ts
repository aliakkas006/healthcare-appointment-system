import { IUserRepository } from './IUserRepository';
import { User, PrismaClient } from '@prisma/client';
import prisma from '@/config/prisma';
export class UserRepository implements IUserRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient;
  }

  async findByAuthId(authUserId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { authUserId } });
  }

  async create(userData: any): Promise<User> {
    return this.prisma.user.create({ data: userData });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, userData: any): Promise<User | null> {
    return this.prisma.user.update({ where: { id }, data: userData });
  }

  async delete(id: string): Promise<User | null> {
    return this.prisma.user.delete({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
