import { IEmailService, AppointmentEmailData, EHREmailData } from "./interfaces/IEmailService";
import { IEmailRepository } from "../repositories/interfaces/IEmailRepository";
import { IEmailTransportService } from "./interfaces/IEmailTransportService";
import { Email } from "@prisma/client";
import { EmailData, EmailOptions } from "@/types"; // Resolves to services/email/src/types
import { defaultSender } from "@/config/config_url"; // Resolves to services/email/src/config/config_url
import logger from "@/config/logger"; // Resolves to services/email/src/config/logger

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
        // Log or handle rejected emails, e.g., by throwing an error
        // or by saving them with a 'FAILED' status if your DB schema supports it.
        logger.error(`Email rejected for recipients: ${rejected.join(', ')}`);
        // Optionally re-throw or handle as per application requirements
        // For now, we'll just log and proceed to save attempt.
      }
      // Even if rejected, we might want to save the attempt.
      // Or, only save if successfully sent. This depends on requirements.
      // Current implementation saves regardless of rejection by transporter.
    } catch (error) {
      logger.error(`Error sending email via transport service: ${error}`);
      // Depending on policy, might re-throw or just log and proceed to save.
      // For now, we log and proceed to save the attempt.
    }
    
    // Save the email record
    await this.emailRepository.createEmailRecord(data);
  }

  async listSentEmails(): Promise<Email[]> {
    return this.emailRepository.getAllEmailRecords();
  }

  async processAppointmentNotification(data: AppointmentEmailData): Promise<void> {
    // Logic adapted from old processEmailAppointment
    // The 'data' parameter now defined by AppointmentEmailData interface
    const emailData: EmailData = {
      sender: defaultSender,
      recipient: data.recipient, // Assuming recipient is part of AppointmentEmailData
      subject: data.subject || 'Appointment Confirmation', // Use subject from data or default
      body: data.body || `Thank you for your Appointment. Your appointment is ${data.status} at ${data.date}`, // Use body from data or construct
      source: 'appointment',
    };

    try {
      await this.sendGenericEmail(emailData);
      logger.info(`Appointment notification email processed for: ${data.recipient}`);
    } catch (error) {
      logger.error(`Error processing appointment notification for ${data.recipient}:`, error);
      // Optionally re-throw or handle as per application requirements
      throw error; // Re-throwing to indicate failure at this level
    }
  }

  async processEHRNotification(data: EHREmailData): Promise<void> {
    // Logic adapted from old processEmailEHR
    // The 'data' parameter now defined by EHREmailData interface
    const emailData: EmailData = {
      sender: defaultSender,
      recipient: data.recipient, // Assuming recipient is part of EHREmailData
      subject: data.subject || 'EHR Information', // Use subject from data or default
      body: data.body || `Please review your latest EHR information. Record type: ${data.recordType}`, // Use body from data or construct
      source: 'EHR',
    };
    
    try {
      await this.sendGenericEmail(emailData);
      logger.info(`EHR notification email processed for: ${data.recipient}`);
    } catch (error) {
      logger.error(`Error processing EHR notification for ${data.recipient}:`, error);
      // Optionally re-throw or handle as per application requirements
      throw error; // Re-throwing to indicate failure at this level
    }
  }
}

export default MainEmailService;
