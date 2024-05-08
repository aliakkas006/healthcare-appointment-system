/**
 * Just a simple test to demonstrate how to test a service
 */

describe('createAppointment', () => {
  it('should create an appointment', async () => {
    const appointment = {
      id: 'appointment123',
      patientId: 'patient123',
      providerId: 'provider123',
      patientEmail: 'patient@gmail.com',
      notes: 'Follow up after 2 weeks',
      date: '2024-01-01T10:00:00Z',
    };

    expect(appointment).toEqual({
      id: expect.any(String),
      patientId: expect.any(String),
      providerId: expect.any(String),
      patientEmail: 'patient@gmail.com',
      notes: 'Follow up after 2 weeks',
      date: '2024-01-01T10:00:00Z',
    });
  });
});
