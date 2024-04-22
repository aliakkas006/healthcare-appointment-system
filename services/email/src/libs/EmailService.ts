import { defaultSender, transporter } from '@/config';
import prisma from '@/prisma';
import { EmailData, EmailOptions } from '@/types';

class EmailService {
  /**
   * Send an email
   */
  public async sendEmail(emailOptions: EmailOptions) {
    const { rejected } = await transporter.sendMail(emailOptions);
    return { rejected };
  }

  /**
   * Save the email to the database
   */
  public async saveEmailToDB(emailData: EmailData) {
    await prisma.email.create({
      data: {
        sender: emailData.sender || defaultSender,
        recipient: emailData.recipient,
        subject: emailData.subject,
        body: emailData.body,
        source: emailData.source,
      },
    });
  }

  /**
   * Get all emails from the database
   */
  public async getEmails() {
    return prisma.email.findMany();
  }
}

const emailService = new EmailService();

export default emailService;
