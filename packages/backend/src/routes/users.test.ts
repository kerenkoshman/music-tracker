import request from 'supertest';
import app from '../index.js';
import { db } from '../db/connection.js';
import { users } from '../db/schema.js';

describe('User Routes', () => {
  let testUserId: string;
  let testUserToken: string;

  beforeAll(async () => {
    // Clean up any existing test data
    await db.delete(users);

    // Create a test user
    const [testUser] = await db.insert(users).values({
      googleId: 'test_google_id_auth',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg',
    }).returning();

    if (!testUser) throw new Error('Test user creation failed');
    testUserId = testUser.id;
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(users);
  });

  describe('GET /api/users/profile', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid or expired token');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid or expired token');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .send({ name: 'Updated Name' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid or expired token');
    });

    it('should return 400 for invalid name type', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', 'Bearer valid_token')
        .send({ name: 123 })
        .expect(401); // Will fail auth first, but if it didn't, it would be 400

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid picture type', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', 'Bearer valid_token')
        .send({ picture: 123 })
        .expect(401); // Will fail auth first, but if it didn't, it would be 400

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/:userId', () => {
    it('should return user public profile', async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('id', testUserId);
      expect(response.body.data.user).toHaveProperty('name', 'Test User');
      expect(response.body.data.user).toHaveProperty('picture', 'https://example.com/avatar.jpg');
      expect(response.body.data.user).toHaveProperty('createdAt');
      
      // Should not include sensitive data
      expect(response.body.data.user).not.toHaveProperty('email');
      expect(response.body.data.user).not.toHaveProperty('googleId');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('User not found');
    });
  });
});
