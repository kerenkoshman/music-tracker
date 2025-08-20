import { db } from '../db/connection.js';
import { users, spotifyConnections, artists, songs, listeningHistory } from '../db/schema.js';
import {
  exchangeCodeForTokens,
  refreshAccessToken,
  getSpotifyUserProfile,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
  saveSpotifyConnection,
  getSpotifyConnection,
  isTokenExpired,
  getValidAccessToken,
  saveArtist,
  saveSong,
  saveListeningHistory,
  disconnectSpotify,
} from './spotifyService.js';
import { eq } from 'drizzle-orm';

// Mock fetch globally
global.fetch = jest.fn();

describe('Spotify Service', () => {
  let testUser: any;

  beforeAll(async () => {
    // Clear database once at the start
    await db.delete(listeningHistory);
    await db.delete(songs);
    await db.delete(artists);
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
  });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up database
    await db.delete(listeningHistory);
    await db.delete(songs);
    await db.delete(artists);
    await db.delete(spotifyConnections);
    await db.delete(users);
  });

  describe('exchangeCodeForTokens', () => {
    it('should exchange code for tokens successfully', async () => {
      const mockResponse = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_in: 3600,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await exchangeCodeForTokens('test-code');

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'https://accounts.spotify.com/api/token',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        })
      );
    });

    it('should throw error when API call fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: jest.fn().mockResolvedValue('Invalid code'),
      });

      await expect(exchangeCodeForTokens('invalid-code')).rejects.toThrow(
        'Failed to exchange code for tokens: Invalid code'
      );
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token successfully', async () => {
      const mockResponse = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        expires_in: 3600,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await refreshAccessToken('test-refresh-token');

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when refresh fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: jest.fn().mockResolvedValue('Invalid refresh token'),
      });

      await expect(refreshAccessToken('invalid-refresh-token')).rejects.toThrow(
        'Failed to refresh access token: Invalid refresh token'
      );
    });
  });

  describe('getSpotifyUserProfile', () => {
    it('should get Spotify user profile successfully', async () => {
      const mockUser = {
        id: 'spotify-user-id',
        email: 'spotify@example.com',
        display_name: 'Spotify User',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await getSpotifyUserProfile('test-access-token');

      expect(result).toEqual(mockUser);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/me',
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer test-access-token',
          },
        })
      );
    });
  });

  describe('getRecentlyPlayed', () => {
    it('should get recently played tracks successfully', async () => {
      const mockResponse = {
        items: [
          {
            track: {
              id: 'track-1',
              name: 'Test Track',
              artists: [{ id: 'artist-1', name: 'Test Artist' }],
              album: { name: 'Test Album' },
              duration_ms: 180000,
              popularity: 80,
            },
            played_at: '2023-01-01T12:00:00Z',
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await getRecentlyPlayed('test-access-token', 10);

      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe('track-1');
      expect(result[0]!.played_at).toBe('2023-01-01T12:00:00Z');
    });
  });

  describe('getTopArtists', () => {
    it('should get top artists successfully', async () => {
      const mockArtists = [
        {
          id: 'artist-1',
          name: 'Test Artist',
          popularity: 85,
          genres: ['pop', 'rock'],
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ items: mockArtists }),
      });

      const result = await getTopArtists('test-access-token', 'short_term', 10);

      expect(result).toEqual(mockArtists);
    });
  });

  describe('getTopTracks', () => {
    it('should get top tracks successfully', async () => {
      const mockTracks = [
        {
          id: 'track-1',
          name: 'Test Track',
          artists: [{ id: 'artist-1', name: 'Test Artist' }],
          album: { name: 'Test Album' },
          duration_ms: 180000,
          popularity: 80,
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ items: mockTracks }),
      });

      const result = await getTopTracks('test-access-token', 'medium_term', 15);

      expect(result).toEqual(mockTracks);
    });
  });

  describe('saveSpotifyConnection', () => {
    it('should save Spotify connection successfully', async () => {
      const spotifyUser = {
        id: 'spotify-user-id',
        email: 'spotify@example.com',
        display_name: 'Spotify User',
      };

      const tokens = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_in: 3600,
      };

      await saveSpotifyConnection(testUser.id, spotifyUser, tokens);

      const connection = await db
        .select()
        .from(spotifyConnections)
        .where(eq(spotifyConnections.userId, testUser.id))
        .limit(1);

      expect(connection).toHaveLength(1);
      expect(connection[0]!.spotifyId).toBe('spotify-user-id');
      expect(connection[0]!.isActive).toBe(true);
    });

    it('should update existing connection', async () => {
      // Create initial connection
      await db.insert(spotifyConnections).values({
        userId: testUser.id,
        spotifyId: 'old-spotify-id',
        accessToken: 'old-access-token',
        refreshToken: 'old-refresh-token',
        expiresAt: new Date(),
        isActive: true,
      });

      const spotifyUser = {
        id: 'new-spotify-id',
        email: 'spotify@example.com',
        display_name: 'Spotify User',
      };

      const tokens = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        expires_in: 3600,
      };

      await saveSpotifyConnection(testUser.id, spotifyUser, tokens);

      const connection = await db
        .select()
        .from(spotifyConnections)
        .where(eq(spotifyConnections.userId, testUser.id))
        .limit(1);

      expect(connection).toHaveLength(1);
      expect(connection[0]!.spotifyId).toBe('new-spotify-id');
    });
  });

  describe('getSpotifyConnection', () => {
    it('should return connection when exists', async () => {
      await db.insert(spotifyConnections).values({
        userId: testUser.id,
        spotifyId: 'spotify-user-id',
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: new Date(),
        isActive: true,
      });

      const connection = await getSpotifyConnection(testUser.id);

      expect(connection).toBeDefined();
      expect(connection?.spotifyId).toBe('spotify-user-id');
    });

    it('should return null when connection does not exist', async () => {
      const connection = await getSpotifyConnection(testUser.id);

      expect(connection).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      const expiredDate = new Date(Date.now() - 1000); // 1 second ago
      expect(isTokenExpired(expiredDate)).toBe(true);
    });

    it('should return false for valid token', () => {
      const validDate = new Date(Date.now() + 3600000); // 1 hour from now
      expect(isTokenExpired(validDate)).toBe(false);
    });
  });

  describe('getValidAccessToken', () => {
    it('should return access token when valid', async () => {
      const validExpiresAt = new Date(Date.now() + 3600000);
      await db.insert(spotifyConnections).values({
        userId: testUser.id,
        spotifyId: 'spotify-user-id',
        accessToken: 'valid-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: validExpiresAt,
        isActive: true,
      });

      const token = await getValidAccessToken(testUser.id);

      expect(token).toBe('valid-access-token');
    });

    it('should return null when no connection exists', async () => {
      const token = await getValidAccessToken(testUser.id);

      expect(token).toBeNull();
    });
  });

  describe('saveArtist', () => {
    it('should save artist successfully', async () => {
      const spotifyArtist = {
        id: 'spotify-artist-id',
        name: 'Test Artist',
        images: [{ url: 'https://example.com/image.jpg' }],
        popularity: 85,
        genres: ['pop', 'rock'],
      };

      const artist = await saveArtist(spotifyArtist);

      expect(artist!.spotifyId).toBe('spotify-artist-id');
      expect(artist!.name).toBe('Test Artist');
      expect(artist!.popularity).toBe(85);
    });

    it('should update existing artist', async () => {
      // Create initial artist
      await db.insert(artists).values({
        spotifyId: 'spotify-artist-id',
        name: 'Old Name',
        popularity: 70,
        genres: ['old-genre'],
      });

      const spotifyArtist = {
        id: 'spotify-artist-id',
        name: 'New Name',
        images: [],
        popularity: 85,
        genres: ['new-genre'],
      };

      const artist = await saveArtist(spotifyArtist);

      expect(artist!.name).toBe('New Name');
      expect(artist!.popularity).toBe(85);
    });
  });

  describe('saveSong', () => {
    it('should save song successfully', async () => {
      // Create artist first
      const [artist] = await db.insert(artists).values({
        spotifyId: 'spotify-artist-id',
        name: 'Test Artist',
        popularity: 85,
        genres: ['pop'],
      }).returning();

      const spotifyTrack = {
        id: 'spotify-track-id',
        name: 'Test Song',
        artists: [{ id: 'spotify-artist-id', name: 'Test Artist' }],
        album: {
          name: 'Test Album',
          images: [{ url: 'https://example.com/album.jpg' }],
        },
        duration_ms: 180000,
        popularity: 80,
      };

      const song = await saveSong(spotifyTrack, artist!.id);

      expect(song!.spotifyId).toBe('spotify-track-id');
      expect(song!.name).toBe('Test Song');
      expect(song!.artistId).toBe(artist!.id);
    });
  });

  describe('saveListeningHistory', () => {
    it('should save listening history entry', async () => {
      // Create artist and song first
      const [artist] = await db.insert(artists).values({
        spotifyId: 'spotify-artist-id',
        name: 'Test Artist',
        popularity: 85,
        genres: ['pop'],
      }).returning();

      const [song] = await db.insert(songs).values({
        spotifyId: 'spotify-track-id',
        name: 'Test Song',
        artistId: artist!.id,
        albumName: 'Test Album',
        duration: 180000,
        popularity: 80,
      }).returning();

      await saveListeningHistory(testUser.id, song!.id, '2023-01-01T12:00:00Z', 180);

      const history = await db
        .select()
        .from(listeningHistory)
        .where(eq(listeningHistory.userId, testUser.id));

      expect(history).toHaveLength(1);
      expect(history[0]!.songId).toBe(song!.id);
      expect(history[0]!.duration).toBe(180);
    });
  });

  describe('disconnectSpotify', () => {
    it('should disconnect Spotify account', async () => {
      // Create connection first
      await db.insert(spotifyConnections).values({
        userId: testUser.id,
        spotifyId: 'spotify-user-id',
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: new Date(),
        isActive: true,
      });

      await disconnectSpotify(testUser.id);

      const connection = await db
        .select()
        .from(spotifyConnections)
        .where(eq(spotifyConnections.userId, testUser.id))
        .limit(1);

      expect(connection[0]!.isActive).toBe(false);
    });
  });
});
