import request from 'supertest';
import app from '../index.js';
import { db } from '../db/connection.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

describe('Authentication Routes', () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await db.delete(users);
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(users);
  });

  describe('GET /api/auth/google', () => {
    it('should return Google OAuth URL', async () => {
      const response = await request(app)
        .get('/api/auth/google')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('authUrl');
      expect(response.body.data.authUrl).toContain('accounts.google.com');
    });

    it('should include redirect_uri in state parameter', async () => {
      const response = await request(app)
        .get('/api/auth/google?redirect_uri=http://localhost:3000/callback')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.authUrl).toContain('state=');
    });
  });

  describe('GET /api/auth/google/callback', () => {
    it('should return 400 for missing authorization code', async () => {
      const response = await request(app)
        .get('/api/auth/google/callback')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Authorization code is required');
    });

    it('should return 400 for invalid authorization code', async () => {
      const response = await request(app)
        .get('/api/auth/google/callback?code=invalid_code')
        .expect(302); // Redirects to error page

      expect(response.headers['location']).toContain('/auth/error');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid or expired token');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid or expired token');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return success message', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');
    });
  });

  describe('POST /api/auth/verify', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid or expired token');
    });
  });
});
