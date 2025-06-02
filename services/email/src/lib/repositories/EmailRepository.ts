import { IEmailRepository } from "./interfaces/IEmailRepository";
import { Email, PrismaClient, Prisma } from "@prisma/client";
import { EmailData } from "@/types"; // Resolves to services/email/src/types
import { defaultSender } from "@/config/config_url"; // Resolves to services/email/src/config/config_url

export class EmailRepository implements IEmailRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async createEmailRecord(data: EmailData): Promise<Email> {
    const emailDataToSave: Prisma.EmailCreateInput = {
      ...data,
      sender: data.sender || defaultSender,
    };
    return this.prisma.email.create({ data: emailDataToSave });
  }

  async getAllEmailRecords(): Promise<Email[]> {
    return this.prisma.email.findMany();
  }
}
