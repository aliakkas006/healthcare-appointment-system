import prisma from '@/prisma';

class PatientService {
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

  /**
   * Get all patients
   */
  public async getPatients() {
    return prisma.patient.findMany();
  }

  /**
   * Get patient by patientId
   */
  public async getPatientById(patientId: string) {
    return prisma.patient.findUnique({
      where: { id: patientId },
    });

  }
}

const patientService = new PatientService();

export default patientService;
