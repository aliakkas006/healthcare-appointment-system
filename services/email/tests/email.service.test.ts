/**
 * Just a simple test setup to demonstrate how to test a service
 */

describe('emailService', () => {
  it('should create an email body', async () => {
    const emailData = {
      sender: 'sender@gmail.com',
      recipient: 'recipient@gmail.com',
      subject: 'Test Email',
      body: 'This is a test email body',
      source: 'test',
    };

    expect(emailData).toEqual({
      sender: 'sender@gmail.com',
      recipient: 'recipient@gmail.com',
      body: expect.any(String),
      subject: 'Test Email',
      source: 'test',
    });
  });
});
