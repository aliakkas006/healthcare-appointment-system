import { AppointmentService } from '@/lib/AppointmentService'; // Direct import of the class
import { IAppointmentRepository } from '@/lib/repositories/interfaces/IAppointmentRepository';
import { ICacheService } from '@/lib/services/interfaces/ICacheService';
import { IMessageQueueService } from '@/lib/services/interfaces/IMessageQueueService';
import { Appointment, Prisma, AppointmentStatus, Role as UserRole } from '@prisma/client'; // Assuming Role is UserRole
import logger from '@/config/logger';

// Mock logger
jest.mock('@/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Cache key constants (mirroring those in AppointmentService)
const APPOINTMENTS_CACHE_KEY = 'appointments';
const APPOINTMENT_DETAIL_CACHE_PREFIX = 'appointment:';
const APPOINTMENTS_PATIENT_CACHE_PREFIX = 'appointments:patient:';
const APPOINTMENTS_PROVIDER_CACHE_PREFIX = 'appointments:provider:';
const APPOINTMENTS_DATE_CACHE_PREFIX = 'appointments:date:';

const mockAppointmentRepository: jest.Mocked<IAppointmentRepository> = {
  create: jest.fn(),
  findMany: jest.fn(),
  findManyByPatientId: jest.fn(),
  findManyByProviderId: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
  findManyByDate: jest.fn(),
};

const mockCacheService: jest.Mocked<ICacheService> = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  deleteAllWithPrefix: jest.fn(), // Though not used by current service impl, good to have if interface has it
};

const mockMessageQueueService: jest.Mocked<IMessageQueueService> = {
  publish: jest.fn(),
};

describe('AppointmentService', () => {
  let appointmentService: AppointmentService;
  const defaultCacheTTL = 3600; // Matching the service's default TTL for assertions

  beforeEach(() => {
    jest.clearAllMocks();
    appointmentService = new AppointmentService(
      mockAppointmentRepository,
      mockCacheService,
      mockMessageQueueService
    );
  });

  const sampleAppointment: Appointment = {
    id: 'apt-123',
    patientId: 'patient-123',
    providerId: 'provider-123',
    date: '2024-01-01T10:00:00.000Z',
    reason: 'Checkup',
    status: AppointmentStatus.SCHEDULED,
    createdAt: new Date(),
    updatedAt: new Date(),
    notes: null,
    duration: 60,
  };

  const sampleAppointmentInput: Prisma.AppointmentCreateInput = {
    patient: { connect: { id: 'patient-123' } },
    provider: { connect: { id: 'provider-123' } },
    date: '2024-01-01T10:00:00.000Z',
    reason: 'Checkup',
    status: AppointmentStatus.SCHEDULED,
    duration: 60,
  };

  describe('createAppointment', () => {
    it('should create an appointment, publish to queue, and invalidate caches', async () => {
      mockAppointmentRepository.create.mockResolvedValue(sampleAppointment);

      const result = await appointmentService.createAppointment(sampleAppointmentInput);

      expect(mockAppointmentRepository.create).toHaveBeenCalledWith(sampleAppointmentInput);
      expect(mockMessageQueueService.publish).toHaveBeenCalledWith(
        'appointment', // exchange
        'send-email',  // routing key
        JSON.stringify(sampleAppointment)
      );
      expect(mockCacheService.delete).toHaveBeenCalledWith(APPOINTMENTS_CACHE_KEY);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`${APPOINTMENTS_PATIENT_CACHE_PREFIX}${sampleAppointment.patientId}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`${APPOINTMENTS_PROVIDER_CACHE_PREFIX}${sampleAppointment.providerId}`);
      expect(result).toEqual(sampleAppointment);
      expect(logger.info).toHaveBeenCalledWith('Appointment created successfully:', sampleAppointment);
    });
  });

  describe('getAppointments', () => {
    it('should return appointments from cache if available', async () => {
      mockCacheService.get.mockResolvedValue([sampleAppointment]);
      const result = await appointmentService.getAppointments();
      expect(mockCacheService.get).toHaveBeenCalledWith(APPOINTMENTS_CACHE_KEY);
      expect(mockAppointmentRepository.findMany).not.toHaveBeenCalled();
      expect(result).toEqual([sampleAppointment]);
      expect(logger.info).toHaveBeenCalledWith('Appointments fetched from cache');
    });

    it('should fetch from repository and set to cache if not in cache', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockAppointmentRepository.findMany.mockResolvedValue([sampleAppointment]);
      const result = await appointmentService.getAppointments();
      expect(mockCacheService.get).toHaveBeenCalledWith(APPOINTMENTS_CACHE_KEY);
      expect(mockAppointmentRepository.findMany).toHaveBeenCalled();
      expect(mockCacheService.set).toHaveBeenCalledWith(APPOINTMENTS_CACHE_KEY, [sampleAppointment], defaultCacheTTL);
      expect(result).toEqual([sampleAppointment]);
      expect(logger.info).toHaveBeenCalledWith('Appointments fetched from repository and cached');
    });
  });

  describe('getAppointmentById', () => {
    const id = 'apt-123';
    const cacheKey = `${APPOINTMENT_DETAIL_CACHE_PREFIX}${id}`;
    it('should return appointment from cache if available', async () => {
        mockCacheService.get.mockResolvedValue(sampleAppointment);
        const result = await appointmentService.getAppointmentById(id);
        expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
        expect(mockAppointmentRepository.findById).not.toHaveBeenCalled();
        expect(result).toEqual(sampleAppointment);
    });
    it('should fetch from repository, set to cache if not in cache, and return appointment', async () => {
        mockCacheService.get.mockResolvedValue(null);
        mockAppointmentRepository.findById.mockResolvedValue(sampleAppointment);
        const result = await appointmentService.getAppointmentById(id);
        expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
        expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(id);
        expect(mockCacheService.set).toHaveBeenCalledWith(cacheKey, sampleAppointment, defaultCacheTTL);
        expect(result).toEqual(sampleAppointment);
    });
    it('should return null if appointment not found in repo and not in cache', async () => {
        mockCacheService.get.mockResolvedValue(null);
        mockAppointmentRepository.findById.mockResolvedValue(null);
        const result = await appointmentService.getAppointmentById(id);
        expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
        expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(id);
        expect(mockCacheService.set).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });
  });

  describe('getAppointmentsByPatientId', () => {
    const patientId = 'patient-123';
    const cacheKey = `${APPOINTMENTS_PATIENT_CACHE_PREFIX}${patientId}`;
    it('should return appointments from cache if available', async () => {
        mockCacheService.get.mockResolvedValue([sampleAppointment]);
        const result = await appointmentService.getAppointmentsByPatientId(patientId);
        expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
        expect(mockAppointmentRepository.findManyByPatientId).not.toHaveBeenCalled();
        expect(result).toEqual([sampleAppointment]);
    });
    it('should fetch from repository, set to cache, and return appointments', async () => {
        mockCacheService.get.mockResolvedValue(null);
        mockAppointmentRepository.findManyByPatientId.mockResolvedValue([sampleAppointment]);
        const result = await appointmentService.getAppointmentsByPatientId(patientId);
        expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
        expect(mockAppointmentRepository.findManyByPatientId).toHaveBeenCalledWith(patientId);
        expect(mockCacheService.set).toHaveBeenCalledWith(cacheKey, [sampleAppointment], defaultCacheTTL);
        expect(result).toEqual([sampleAppointment]);
    });
  });

  describe('getAppointmentsByProviderId', () => {
    const providerId = 'provider-123';
    const cacheKey = `${APPOINTMENTS_PROVIDER_CACHE_PREFIX}${providerId}`;
     it('should return appointments from cache if available', async () => {
        mockCacheService.get.mockResolvedValue([sampleAppointment]);
        const result = await appointmentService.getAppointmentsByProviderId(providerId);
        expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
        expect(mockAppointmentRepository.findManyByProviderId).not.toHaveBeenCalled();
        expect(result).toEqual([sampleAppointment]);
    });
    it('should fetch from repository, set to cache, and return appointments', async () => {
        mockCacheService.get.mockResolvedValue(null);
        mockAppointmentRepository.findManyByProviderId.mockResolvedValue([sampleAppointment]);
        const result = await appointmentService.getAppointmentsByProviderId(providerId);
        expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
        expect(mockAppointmentRepository.findManyByProviderId).toHaveBeenCalledWith(providerId);
        expect(mockCacheService.set).toHaveBeenCalledWith(cacheKey, [sampleAppointment], defaultCacheTTL);
        expect(result).toEqual([sampleAppointment]);
    });
  });

  describe('getAppointmentsByDate', () => {
    const date = '2024-01-01T10:00:00.000Z';
    const cacheKey = `${APPOINTMENTS_DATE_CACHE_PREFIX}${date}`;
    it('should return appointments from cache if available', async () => {
        mockCacheService.get.mockResolvedValue([sampleAppointment]);
        const result = await appointmentService.getAppointmentsByDate(date);
        expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
        expect(mockAppointmentRepository.findManyByDate).not.toHaveBeenCalled();
        expect(result).toEqual([sampleAppointment]);
    });
    it('should fetch from repository, set to cache, and return appointments', async () => {
        mockCacheService.get.mockResolvedValue(null);
        mockAppointmentRepository.findManyByDate.mockResolvedValue([sampleAppointment]);
        const result = await appointmentService.getAppointmentsByDate(date);
        expect(mockCacheService.get).toHaveBeenCalledWith(cacheKey);
        expect(mockAppointmentRepository.findManyByDate).toHaveBeenCalledWith(date);
        expect(mockCacheService.set).toHaveBeenCalledWith(cacheKey, [sampleAppointment], defaultCacheTTL);
        expect(result).toEqual([sampleAppointment]);
    });
  });

  describe('updateAppointment', () => {
    const appointmentId = 'apt-123';
    const updateData: Prisma.AppointmentUpdateInput = { reason: 'Follow-up' };
    const updatedAppointment = { ...sampleAppointment, reason: 'Follow-up' };

    it('should update appointment in repository and invalidate relevant caches', async () => {
      mockAppointmentRepository.update.mockResolvedValue(updatedAppointment);
      const result = await appointmentService.updateAppointment(appointmentId, updateData);
      expect(mockAppointmentRepository.update).toHaveBeenCalledWith(appointmentId, updateData);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`${APPOINTMENT_DETAIL_CACHE_PREFIX}${appointmentId}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(APPOINTMENTS_CACHE_KEY);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`${APPOINTMENTS_PATIENT_CACHE_PREFIX}${updatedAppointment.patientId}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`${APPOINTMENTS_PROVIDER_CACHE_PREFIX}${updatedAppointment.providerId}`);
      expect(result).toEqual(updatedAppointment);
    });
    it('should return null if appointment to update is not found', async () => {
        mockAppointmentRepository.update.mockResolvedValue(null);
        const result = await appointmentService.updateAppointment(appointmentId, updateData);
        expect(mockAppointmentRepository.update).toHaveBeenCalledWith(appointmentId, updateData);
        expect(mockCacheService.delete).not.toHaveBeenCalled(); // No cache invalidation if not found
        expect(result).toBeNull();
    });
  });

  describe('deleteAppointment', () => {
    const appointmentId = 'apt-123';
    it('should delete appointment from repository and invalidate relevant caches', async () => {
      mockAppointmentRepository.deleteById.mockResolvedValue(sampleAppointment); // Assuming delete returns the deleted item
      const result = await appointmentService.deleteAppointment(appointmentId);
      expect(mockAppointmentRepository.deleteById).toHaveBeenCalledWith(appointmentId);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`${APPOINTMENT_DETAIL_CACHE_PREFIX}${appointmentId}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(APPOINTMENTS_CACHE_KEY);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`${APPOINTMENTS_PATIENT_CACHE_PREFIX}${sampleAppointment.patientId}`);
      expect(mockCacheService.delete).toHaveBeenCalledWith(`${APPOINTMENTS_PROVIDER_CACHE_PREFIX}${sampleAppointment.providerId}`);
      expect(result).toEqual(sampleAppointment);
    });
     it('should return null if appointment to delete is not found', async () => {
        mockAppointmentRepository.deleteById.mockResolvedValue(null);
        const result = await appointmentService.deleteAppointment(appointmentId);
        expect(mockAppointmentRepository.deleteById).toHaveBeenCalledWith(appointmentId);
        expect(mockCacheService.delete).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });
  });
});
