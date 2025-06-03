import {
  IEmailService,
  AppointmentEmailData,
  EHREmailData,
} from './interfaces/IEmailService';
import { IEmailRepository } from '../repositories/interfaces/IEmailRepository';
import { IEmailTransportService } from './interfaces/IEmailTransportService';
import { Email } from '@prisma/client';
import { EmailData, EmailOptions } from '@/types';
import { defaultSender } from '@/config/config_url';
import logger from '@/config/logger';

export class MainEmailService implements IEmailService {
  private readonly emailRepository: IEmailRepository;
  private readonly emailTransportService: IEmailTransportService;

  constructor(
    emailRepository: IEmailRepository,
    emailTransportService: IEmailTransportService
  ) {
    this.emailRepository = emailRepository;
    this.emailTransportService = emailTransportService;
  }

  async sendGenericEmail(data: EmailData): Promise<void> {
    const emailOptions: EmailOptions = {
      from: data.sender || defaultSender,
      to: data.recipient,
      subject: data.subject,
      text: data.body,
    };

    try {
      const { rejected } = await this.emailTransportService.send(emailOptions);
      if (rejected && rejected.length > 0) {
        logger.error(`Email rejected for recipients: ${rejected.join(', ')}`);
      }
    } catch (error) {
      logger.error(`Error sending email via transport service: ${error}`);
    }

    // Save the email record
    await this.emailRepository.createEmailRecord(data);
  }

  async listSentEmails(): Promise<Email[]> {
    return this.emailRepository.getAllEmailRecords();
  }

  async processAppointmentNotification(
    data: AppointmentEmailData
  ): Promise<void> {
    const emailData: EmailData = {
      sender: defaultSender,
      recipient: data.recipient,
      subject: data.subject || 'Appointment Confirmation',
      body:
        data.body ||
        `Thank you for your Appointment. Your appointment is ${data.status} at ${data.date}`,
      source: 'appointment',
    };

    try {
      await this.sendGenericEmail(emailData);
      logger.info(
        `Appointment notification email processed for: ${data.recipient}`
      );
    } catch (error) {
      logger.error(
        `Error processing appointment notification for ${data.recipient}:`,
        error
      );

      throw error;
    }
  }

  async processEHRNotification(data: EHREmailData): Promise<void> {
    const emailData: EmailData = {
      sender: defaultSender,
      recipient: data.recipient,
      subject: data.subject || 'EHR Information',
      body:
        data.body ||
        `Please review your latest EHR information. Record type: ${data.recordType}`,
      source: 'EHR',
    };

    try {
      await this.sendGenericEmail(emailData);
      logger.info(`EHR notification email processed for: ${data.recipient}`);
    } catch (error) {
      logger.error(
        `Error processing EHR notification for ${data.recipient}:`,
        error
      );

      throw error;
    }
  }
}

export default MainEmailService;
