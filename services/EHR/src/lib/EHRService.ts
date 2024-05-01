import prisma from '@/prisma';
import sendToQueue from '@/queue';
import redis from '@/redis';

class EHRService {
  /**
   * Create a new EHR
   * Send an email notification to the patient
   * Invalidate cache for all EHRs
   * @param EHRData - Data for the new EHR
   */
  public async createEHR(EHRData: any) {
    try {
      const ehr = await prisma.eHR.create({
        data: EHRData,
      });

      await sendToQueue('send-email', JSON.stringify(ehr));

      await redis.del('EHRs');

      return ehr;
    } catch (err) {
      console.error('Error creating EHR:', err);
      throw err;
    }
  }

  /**
   * Get All EHRs from cache or database
   * Cache EHRs data for future requests
   */
  public async getEHRs() {
    try {
      // Check if EHRs data is cached
      const cachedEHRs = await redis.get('EHRs');
      if (cachedEHRs) {
        return JSON.parse(cachedEHRs);
      }

      // If not cached, fetch EHRs from the database
      const EHRs = await prisma.eHR.findMany();

      // Cache EHRs data for future requests
      await redis.set('EHRs', JSON.stringify(EHRs));

      return EHRs;
    } catch (err) {
      console.error('Error fetching EHRs:', err);
      throw err;
    }
  }
}

const ehrService = new EHRService();

export default ehrService;
