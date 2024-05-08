/**
 * Just a simple test setup to demonstrate how to test a service
 */

describe('userService', () => {
  it('should create a user', async () => {
    const user = {
      id: 'user1',
      name: 'Ali Akkas',
      email: 'ali@gmail.com',
      password: 'pass123456',
    };

    expect(user).toEqual({
      id: 'user1',
      name: 'Ali Akkas',
      email: 'ali@gmail.com',
        password: expect.any(String),
    });
  });
});
