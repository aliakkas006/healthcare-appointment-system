import {
  IEHRService,
  EHRWithRelations,
} from './services/interfaces/IEHRService';
import { IEHRRepository } from './repositories/interfaces/IEHRRepository';
import { ICacheService } from './services/interfaces/ICacheService';
import { IMessageQueueService } from './services/interfaces/IMessageQueueService';
import { EHR, Prisma } from '@prisma/client';
import logger from '@/config/logger';

// Cache key constants
const EHRS_CACHE_KEY = 'EHRs';
const EHR_DETAIL_CACHE_PREFIX = 'EHR:';
const EHR_PATIENT_CACHE_PREFIX = 'EHR:patient:';

export class EHRCentralService implements IEHRService {
  private readonly ehrRepository: IEHRRepository;
  private readonly cacheService: ICacheService;
  private readonly messageQueueService: IMessageQueueService;
  private readonly defaultCacheTTL = 3600;

  constructor(
    ehrRepository: IEHRRepository,
    cacheService: ICacheService,
    messageQueueService: IMessageQueueService
  ) {
    this.ehrRepository = ehrRepository;
    this.cacheService = cacheService;
    this.messageQueueService = messageQueueService;
  }

  async checkExistingEHR(patientEmail: string): Promise<EHR | null> {
    return this.ehrRepository.findByPatientEmail(patientEmail);
  }

  async createEHR(EHRData: Prisma.EHRCreateInput): Promise<EHR> {
    try {
      const ehr = await this.ehrRepository.create(EHRData);

      // Publish to queue (using 'ehr' as exchange, 'send-email' as routing key based on original sendToQueue)
      await this.messageQueueService.publish(
        'ehr',
        'send-email',
        JSON.stringify(ehr)
      );

      // Invalidate caches
      await this.cacheService.delete(EHRS_CACHE_KEY);
      if (ehr.patientId) {
        await this.cacheService.delete(
          `${EHR_PATIENT_CACHE_PREFIX}${ehr.patientId}`
        );
      }

      logger.info('EHR created successfully by EHRCentralService:', ehr);
      return ehr;
    } catch (err) {
      logger.error('Error creating EHR in EHRCentralService:', err);
      throw err;
    }
  }

  async getEHRs(): Promise<EHR[]> {
    const cacheKey = EHRS_CACHE_KEY;
    try {
      const cachedEHRs = await this.cacheService.get<EHR[]>(cacheKey);
      if (cachedEHRs) {
        logger.info('EHRs fetched from cache');
        return cachedEHRs;
      }

      const ehRs = await this.ehrRepository.findMany();
      await this.cacheService.set(cacheKey, ehRs, this.defaultCacheTTL);
      logger.info('EHRs fetched from repository and cached');
      return ehRs;
    } catch (err) {
      logger.error('Error fetching EHRs in EHRCentralService:', err);
      throw err;
    }
  }

  async getEHRByPatientId(patientId: string): Promise<EHR | null> {
    const cacheKey = `${EHR_PATIENT_CACHE_PREFIX}${patientId}`;
    try {
      const cachedEHR = await this.cacheService.get<EHR>(cacheKey);
      if (cachedEHR) {
        logger.info(`EHR for patient ${patientId} fetched from cache`);
        return cachedEHR;
      }

      const ehr = await this.ehrRepository.findFirstByPatientId(patientId);
      if (ehr) {
        await this.cacheService.set(cacheKey, ehr, this.defaultCacheTTL);
        logger.info(
          `EHR for patient ${patientId} fetched from repository and cached`
        );
      }
      return ehr;
    } catch (err) {
      logger.error(
        `Error fetching EHR for patient ${patientId} in EHRCentralService:`,
        err
      );
      throw err;
    }
  }

  async getEHRById(ehrId: string): Promise<EHRWithRelations | null> {
    const cacheKey = `${EHR_DETAIL_CACHE_PREFIX}${ehrId}`;
    try {
      const cachedEHR = await this.cacheService.get<EHRWithRelations>(cacheKey);
      if (cachedEHR) {
        logger.info(`EHR ${ehrId} with relations fetched from cache`);
        return cachedEHR;
      }

      const ehr = await this.ehrRepository.findByIdWithRelations(ehrId);
      if (ehr) {
        await this.cacheService.set(cacheKey, ehr, this.defaultCacheTTL);
        logger.info(
          `EHR ${ehrId} with relations fetched from repository and cached`
        );
      }
      return ehr;
    } catch (err) {
      logger.error(
        `Error fetching EHR ${ehrId} with relations in EHRCentralService:`,
        err
      );
      throw err;
    }
  }

  async updateEHRById(
    ehrId: string,
    EHRData: Prisma.EHRUpdateInput
  ): Promise<EHR | null> {
    try {
      const ehr = await this.ehrRepository.update(ehrId, EHRData);
      if (ehr) {
        await this.cacheService.delete(`${EHR_DETAIL_CACHE_PREFIX}${ehrId}`);
        await this.cacheService.delete(EHRS_CACHE_KEY);
        if (ehr.patientId) {
          await this.cacheService.delete(
            `${EHR_PATIENT_CACHE_PREFIX}${ehr.patientId}`
          );
        }
        logger.info(
          `EHR ${ehrId} updated successfully and caches invalidated.`
        );
      }
      return ehr;
    } catch (err) {
      logger.error(`Error updating EHR ${ehrId} in EHRCentralService:`, err);
      throw err;
    }
  }

  async deleteEHRById(ehrId: string): Promise<EHR | null> {
    try {
      const ehr = await this.ehrRepository.deleteById(ehrId);
      if (ehr) {
        await this.cacheService.delete(`${EHR_DETAIL_CACHE_PREFIX}${ehrId}`);
        await this.cacheService.delete(EHRS_CACHE_KEY);
        if (ehr.patientId) {
          await this.cacheService.delete(
            `${EHR_PATIENT_CACHE_PREFIX}${ehr.patientId}`
          );
        }
        logger.info(
          `EHR ${ehrId} deleted successfully and caches invalidated.`
        );
      }
      return ehr;
    } catch (err) {
      logger.error(`Error deleting EHR ${ehrId} in EHRCentralService:`, err);
      throw err;
    }
  }
}

export default EHRCentralService;
