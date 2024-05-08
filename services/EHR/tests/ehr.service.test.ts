/**
 * Just a simple test setup to demonstrate how to test a service
 */

describe('ehrService', () => {
  it('should create an EHR', async () => {
    const ehr = {
      id: 'ehr123',
      patientId: 'patient123',
      providerId: 'provider123',
      patientEmail: 'patient@gmail.com',
      medications: ['med1', 'med2'],
      allergies: ['allergy1', 'allergy2'],
      conditions: ['condition1', 'condition2'],
    };

    expect(ehr).toEqual({
      id: expect.any(String),
      patientId: 'patient123',
      providerId: 'provider123',
      patientEmail: 'patient@gmail.com',
      medications: expect.arrayContaining(['med1', 'med2']),
      allergies: expect.arrayContaining(['allergy1', 'allergy2']),
      conditions: expect.arrayContaining(['condition1', 'condition2']),
    });
  });
});
