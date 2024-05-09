import prisma from '@/config/prisma';
import { defaultSender, transporter } from '@/config/config_url';
import { EmailData, EmailOptions } from '@/types';
import logger from '@/config/logger';

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

  /**
   * Process email appointment
   */
  public async processEmailAppointment(emailData: any) {
    const { patientEmail, date, status } = emailData;
    const from = defaultSender;
    const subject = 'Appointment Confirmation';
    const body = `Thank you for your Appointment. Your appointment is ${status} at ${date}`;

    const emailOptions = {
      from,
      to: patientEmail,
      subject,
      text: body,
    };

    // Send the email
    try {
      const { rejected } = await transporter.sendMail(emailOptions);

      if (rejected.length) {
        throw new Error(`Error sending email to ${rejected.join(',')}`);
      }

      // Save the email to the database
      await this.saveEmailToDB({
        sender: from,
        recipient: patientEmail,
        subject,
        body,
        source: 'appointment',
      });

      logger.info(`Email sent to ${patientEmail}`);
    } catch (err) {
      logger.error('Error sending email:', err);
      throw err;
    }
  }

  /**
   * Process email EHR
   */
  public async processEmailEHR(data: any) {
    const { patientEmail, medications } = data;
    const from = defaultSender;
    const subject = 'EHR Confirmation';
    const body = `Thank you for helping us with your Electronic Health Record (EHR). Your medications are ${medications}`;

    const emailOptions = {
      from,
      to: patientEmail,
      subject,
      text: body,
    };

    // Send the email
    try {
      const { rejected } = await transporter.sendMail(emailOptions);

      if (rejected.length) {
        throw new Error(`Error sending email to ${rejected.join(',')}`);
      }

      // Save the email to the database
      await this.saveEmailToDB({
        sender: from,
        recipient: patientEmail,
        subject,
        body,
        source: 'EHR',
      });

      logger.info(`Email sent to ${patientEmail}`);
    } catch (err) {
      logger.error('Error sending email:', err);
      throw err;
    }
  }
}

const emailService = new EmailService();

export default emailService;
