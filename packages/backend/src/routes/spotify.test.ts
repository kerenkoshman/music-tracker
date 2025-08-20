import request from 'supertest';
import app from '../index.js';
import { db } from '../db/connection.js';
import { users, spotifyConnections } from '../db/schema.js';
import { generateToken } from '../utils/jwt.js';

// Mock Spotify service
jest.mock('../services/spotifyService.js', () => ({
  generateSpotifyAuthUrl: jest.fn(() => 'https://accounts.spotify.com/authorize?mock=true'),
  exchangeCodeForTokens: jest.fn(),
  getSpotifyUserProfile: jest.fn(),
  saveSpotifyConnection: jest.fn(),
  getSpotifyConnection: jest.fn(),
  getValidAccessToken: jest.fn(),
  getRecentlyPlayed: jest.fn(),
  getTopArtists: jest.fn(),
  getTopTracks: jest.fn(),
  saveArtist: jest.fn(),
  saveSong: jest.fn(),
  saveListeningHistory: jest.fn(),
  disconnectSpotify: jest.fn(),
}));

const mockSpotifyService = jest.requireMock('../services/spotifyService.js');

describe('Spotify Routes', () => {
  let testUser: any;
  let authToken: string;

  beforeEach(async () => {
    // Clear database
    await db.delete(spotifyConnections);
    await db.delete(users);

    // Create test user
    const [user] = await db
      .insert(users)
      .values({
        googleId: 'test-google-id',
        email: 'test@example.com',
        name: 'Test User',
      })
      .returning();

    testUser = user!;
    authToken = generateToken({
      userId: user!.id,
      email: user!.email,
      googleId: user!.googleId,
    });

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('GET /api/spotify/connect', () => {
    it('should return Spotify auth URL for authenticated user', async () => {
      const response = await request(app)
        .get('/api/spotify/connect')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.authUrl).toBe('https://accounts.spotify.com/authorize?mock=true');
    });

    it('should return 401 for unauthenticated user', async () => {
      await request(app)
        .get('/api/spotify/connect')
        .expect(401);
    });
  });

  describe('GET /api/spotify/callback', () => {
    beforeEach(() => {
      mockSpotifyService.exchangeCodeForTokens.mockResolvedValue({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
      });

      mockSpotifyService.getSpotifyUserProfile.mockResolvedValue({
        id: 'spotify-user-id',
        email: 'spotify@example.com',
        display_name: 'Spotify User',
      });

      mockSpotifyService.saveSpotifyConnection.mockResolvedValue(undefined);
    });

    it('should handle Spotify OAuth callback successfully', async () => {
      const response = await request(app)
        .get('/api/spotify/callback?code=mock-code&state=http://localhost:5173/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(302); // Redirect

      expect(mockSpotifyService.exchangeCodeForTokens).toHaveBeenCalledWith('mock-code');
      expect(mockSpotifyService.getSpotifyUserProfile).toHaveBeenCalledWith('mock-access-token');
      expect(mockSpotifyService.saveSpotifyConnection).toHaveBeenCalledWith(
        testUser.id,
        {
          id: 'spotify-user-id',
          email: 'spotify@example.com',
          display_name: 'Spotify User',
        },
        {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
        }
      );
    });

    it('should return 400 when code is missing', async () => {
      await request(app)
        .get('/api/spotify/callback')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('should return 401 for unauthenticated user', async () => {
      await request(app)
        .get('/api/spotify/callback?code=mock-code')
        .expect(401);
    });
  });

  describe('GET /api/spotify/status', () => {
    it('should return connection status when connected', async () => {
      mockSpotifyService.getSpotifyConnection.mockResolvedValue({
        id: 'connection-id',
        userId: testUser.id,
        spotifyId: 'spotify-user-id',
        isActive: true,
        expiresAt: new Date(Date.now() + 3600000),
      });

      const response = await request(app)
        .get('/api/spotify/status')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.connected).toBe(true);
      expect(response.body.data.spotifyId).toBe('spotify-user-id');
    });

    it('should return connection status when not connected', async () => {
      mockSpotifyService.getSpotifyConnection.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/spotify/status')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.connected).toBe(false);
    });

    it('should return 401 for unauthenticated user', async () => {
      await request(app)
        .get('/api/spotify/status')
        .expect(401);
    });
  });

  describe('POST /api/spotify/disconnect', () => {
    it('should disconnect Spotify account successfully', async () => {
      mockSpotifyService.disconnectSpotify.mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/spotify/disconnect')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockSpotifyService.disconnectSpotify).toHaveBeenCalledWith(testUser.id);
    });

    it('should return 401 for unauthenticated user', async () => {
      await request(app)
        .post('/api/spotify/disconnect')
        .expect(401);
    });
  });

  describe('GET /api/spotify/recently-played', () => {
    beforeEach(() => {
      mockSpotifyService.getValidAccessToken.mockResolvedValue('mock-access-token');
      mockSpotifyService.getRecentlyPlayed.mockResolvedValue([
        {
          id: 'track-1',
          name: 'Test Track',
          artists: [{ id: 'artist-1', name: 'Test Artist' }],
          album: { name: 'Test Album' },
          duration_ms: 180000,
          popularity: 80,
        },
      ]);
    });

    it('should return recently played tracks', async () => {
      const response = await request(app)
        .get('/api/spotify/recently-played')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tracks).toHaveLength(1);
      expect(response.body.data.tracks[0].name).toBe('Test Track');
    });

    it('should return 401 when Spotify not connected', async () => {
      mockSpotifyService.getValidAccessToken.mockResolvedValue(null);

      await request(app)
        .get('/api/spotify/recently-played')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);
    });

    it('should return 401 for unauthenticated user', async () => {
      await request(app)
        .get('/api/spotify/recently-played')
        .expect(401);
    });
  });

  describe('GET /api/spotify/top-artists', () => {
    beforeEach(() => {
      mockSpotifyService.getValidAccessToken.mockResolvedValue('mock-access-token');
      mockSpotifyService.getTopArtists.mockResolvedValue([
        {
          id: 'artist-1',
          name: 'Test Artist',
          popularity: 85,
          genres: ['pop', 'rock'],
        },
      ]);
    });

    it('should return top artists', async () => {
      const response = await request(app)
        .get('/api/spotify/top-artists?time_range=short_term&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.artists).toHaveLength(1);
      expect(response.body.data.artists[0].name).toBe('Test Artist');
    });

    it('should return 401 when Spotify not connected', async () => {
      mockSpotifyService.getValidAccessToken.mockResolvedValue(null);

      await request(app)
        .get('/api/spotify/top-artists')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);
    });
  });

  describe('GET /api/spotify/top-tracks', () => {
    beforeEach(() => {
      mockSpotifyService.getValidAccessToken.mockResolvedValue('mock-access-token');
      mockSpotifyService.getTopTracks.mockResolvedValue([
        {
          id: 'track-1',
          name: 'Test Track',
          artists: [{ id: 'artist-1', name: 'Test Artist' }],
          album: { name: 'Test Album' },
          duration_ms: 180000,
          popularity: 80,
        },
      ]);
    });

    it('should return top tracks', async () => {
      const response = await request(app)
        .get('/api/spotify/top-tracks?time_range=medium_term&limit=15')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tracks).toHaveLength(1);
      expect(response.body.data.tracks[0].name).toBe('Test Track');
    });

    it('should return 401 when Spotify not connected', async () => {
      mockSpotifyService.getValidAccessToken.mockResolvedValue(null);

      await request(app)
        .get('/api/spotify/top-tracks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);
    });
  });

  describe('POST /api/spotify/sync', () => {
    beforeEach(() => {
      mockSpotifyService.getValidAccessToken.mockResolvedValue('mock-access-token');
      mockSpotifyService.getRecentlyPlayed.mockResolvedValue([
        {
          id: 'track-1',
          name: 'Test Track',
          artists: [{ id: 'artist-1', name: 'Test Artist' }],
          album: { name: 'Test Album' },
          duration_ms: 180000,
          popularity: 80,
          played_at: '2023-01-01T12:00:00Z',
        },
      ]);
      mockSpotifyService.saveArtist.mockResolvedValue({ id: 'artist-db-id' });
      mockSpotifyService.saveSong.mockResolvedValue({ id: 'song-db-id' });
      mockSpotifyService.saveListeningHistory.mockResolvedValue(undefined);
    });

    it('should sync Spotify data successfully', async () => {
      const response = await request(app)
        .post('/api/spotify/sync')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.syncedCount).toBe(1);
      expect(response.body.data.totalTracks).toBe(1);
    });

    it('should return 401 when Spotify not connected', async () => {
      mockSpotifyService.getValidAccessToken.mockResolvedValue(null);

      await request(app)
        .post('/api/spotify/sync')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);
    });
  });
});
