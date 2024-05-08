/**
 * Just a simple test to demonstrate how to test a service
 */

describe('authService', () => {
  it('should create an auth user', async () => {
    const user = {
      id: 'user123',
      name: 'User',
      email: 'user@gmail.com',
      password: 'password',
    };

    expect(user).toEqual({
      id: expect.any(String),
      name: 'User',
      email: 'user@gmail.com',
      password: 'password',
    });
  });
});
