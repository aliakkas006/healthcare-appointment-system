import prisma from '@/prisma';
import sendToQueue from '@/queue';
import redis from '@/redis';

class EHRService {
  /**
   * Check if the patient already has an EHR
   * @param patientEmail - Patient email
   */
  public async checkExistingEHR(patientEmail: string) {
    const existingEHR = await prisma.eHR.findUnique({
      where: {
        patientEmail,
      },
    });

    return existingEHR;
  }

  /**
   * Create a new medication for an EHR
   * @param medication - Medication data
   */
  public async createMedication(medication: any) {
    const createdMedication = await prisma.medication.create({
      data: medication,
    });

    return createdMedication;
  }

  /**
   * Create a new diagnostic report for an EHR
   * @param diagnosticReport - Diagnostic Report data
   */
  public async createDiagnosticReport(diagnosticReport: any) {
    const createdDiagnosticReport = await prisma.diagnosticReport.create({
      data: diagnosticReport,
    });

    return createdDiagnosticReport;
  }

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
        select: {
          id: true,
          patientId: true,
          patientEmail: true,
          medicalHistories: true,
          allergies: true,
        },
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
   * @returns EHRs data
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

  /**
   * Get EHR by patientId and aggregate data from Medications and Diagnostic Reports
   * Cache EHR data for future requests
   * @param patientId - Patient ID
   */
  public async getEHRByPatientId(patientId: string) {
    try {
      // Check if EHRs data is cached
      const cachedEHRs = await redis.get(`EHR:${patientId}`);
      if (cachedEHRs) {
        return JSON.parse(cachedEHRs);
      }

      // If not cached, fetch EHR from the database
      const EHR = await prisma.eHR.findFirst({
        where: {
          patientId,
        },
      });

      // Cache EHRs data for future requests
      await redis.set(`EHR:${patientId}`, JSON.stringify(EHR));

      return EHR;
    } catch (err) {
      console.error('Error fetching EHRs:', err);
      throw err;
    }
  }

  /**
   * Get EHR by EHR ID and aggregate data from Medications and Diagnostic Reports
   * Cache EHR data for future requests
   * @param ehrId - EHR ID
   * @returns EHR data
   */
  public async getEHRById(ehrId: string) {
    try {
      // Check if EHR data is cached
      const cachedEHR = await redis.get(`EHR:${ehrId}`);
      if (cachedEHR) {
        return JSON.parse(cachedEHR);
      }

      // If not cached, fetch EHR from the database
      const EHR = await prisma.eHR.findUnique({
        where: {
          id: ehrId,
        },
        include: {
          medications: true,
          diagnosticReports: true,
        },
      });

      // Cache EHR data for future requests
      await redis.set(`EHR:${ehrId}`, JSON.stringify(EHR));

      return EHR;
    } catch (err) {
      console.error('Error fetching EHR:', err);
      throw err;
    }
  }

  /**
   * Update EHR by EHR ID
   * Invalidate cache for the updated EHR data and all EHRs
   * @param ehrId - EHR ID
   * @param EHRData - Updated EHR data
   * @returns Updated EHR data
   */
  public async updateEHRById(ehrId: string, EHRData: any) {
    try {
      const ehr = await prisma.eHR.update({
        where: {
          id: ehrId,
        },
        data: EHRData,
      });

      await redis.del(`EHR:${ehrId}`);
      await redis.del('EHRs');

      return ehr;
    } catch (err) {
      console.error('Error updating EHR:', err);
      throw err;
    }
  }

  /**
   * Delete EHR by EHR ID
   * Invalidate cache for the deleted EHR data and all EHRs
   * @param ehrId - EHR ID
   * @returns Deleted EHR data
   */
  public async deleteEHRById(ehrId: string) {
    try {
      const ehr = await prisma.eHR.delete({
        where: {
          id: ehrId,
        },
      });

      await redis.del(`EHR:${ehrId}`);
      await redis.del('EHRs');

      return ehr;
    } catch (err) {
      console.error('Error deleting EHR:', err);
      throw err;
    }
  }

  /**
   * Get all medications for an EHR
   * @returns Medications data
   */
  public async getMedications() {
    console.log('Fetching Medications from the database');
    return prisma.medication.findMany();
  }

  /**
   * Get all diagnostic reports for an EHR
   * @returns Diagnostic Reports data
   */
  public async getDiagnosticReports() {
    return prisma.diagnosticReport.findMany();
  }

  /**
   * Check if the patient already exists
   */
  public async checkExistingPatient(userId: string) {
    return prisma.patient.findUnique({
      where: { userId },
    });
  }

  /**
   * Create a new patient
   */
  public async createPatient(patientData: any) {
    const patient = await prisma.patient.create({
      data: patientData,
    });

    return patient;
  }
}

const ehrService = new EHRService();

export default ehrService;
