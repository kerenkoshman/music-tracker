import { db } from './connection';
import { users, artists, songs, spotifyConnections, listeningHistory } from './schema';
import { eq } from 'drizzle-orm';

describe('Database Schema', () => {
  // Test data
  let testUserId: string;
  let testArtistId: string;
  let testSongId: string;

  beforeAll(async () => {
    // Clean up any existing test data
    await db.delete(listeningHistory);
    await db.delete(songs);
    await db.delete(artists);
    await db.delete(spotifyConnections);
    await db.delete(users);
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(listeningHistory);
    await db.delete(songs);
    await db.delete(artists);
    await db.delete(spotifyConnections);
    await db.delete(users);
  });

  describe('Users table', () => {
    it('should create a user successfully', async () => {
      const [user] = await db.insert(users).values({
        googleId: 'test_google_id',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
      }).returning();

      expect(user).toBeDefined();
      expect(user.googleId).toBe('test_google_id');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();

      testUserId = user.id;
    });

    it('should enforce unique Google ID constraint', async () => {
      await expect(
        db.insert(users).values({
          googleId: 'test_google_id', // Same as above
          email: 'different@example.com',
          name: 'Different User',
        })
      ).rejects.toThrow();
    });
  });

  describe('Artists table', () => {
    it('should create an artist successfully', async () => {
      const [artist] = await db.insert(artists).values({
        spotifyId: 'test_spotify_artist_id',
        name: 'Test Artist',
        imageUrl: 'https://example.com/artist.jpg',
        popularity: 85,
        genres: ['pop', 'rock'],
      }).returning();

      expect(artist).toBeDefined();
      expect(artist.spotifyId).toBe('test_spotify_artist_id');
      expect(artist.name).toBe('Test Artist');
      expect(artist.popularity).toBe(85);
      expect(artist.genres).toEqual(['pop', 'rock']);

      testArtistId = artist.id;
    });

    it('should enforce unique Spotify ID constraint', async () => {
      await expect(
        db.insert(artists).values({
          spotifyId: 'test_spotify_artist_id', // Same as above
          name: 'Different Artist',
        })
      ).rejects.toThrow();
    });
  });

  describe('Songs table', () => {
    it('should create a song successfully', async () => {
      const [song] = await db.insert(songs).values({
        spotifyId: 'test_spotify_song_id',
        name: 'Test Song',
        artistId: testArtistId,
        albumName: 'Test Album',
        albumImageUrl: 'https://example.com/album.jpg',
        duration: 180000,
        popularity: 75,
      }).returning();

      expect(song).toBeDefined();
      expect(song.spotifyId).toBe('test_spotify_song_id');
      expect(song.name).toBe('Test Song');
      expect(song.artistId).toBe(testArtistId);
      expect(song.duration).toBe(180000);

      testSongId = song.id;
    });

    it('should enforce foreign key constraint with artists', async () => {
      await expect(
        db.insert(songs).values({
          spotifyId: 'test_spotify_song_id_2',
          name: 'Invalid Song',
          artistId: 'non-existent-artist-id',
        })
      ).rejects.toThrow();
    });
  });

  describe('Spotify Connections table', () => {
    it('should create a Spotify connection successfully', async () => {
      const [connection] = await db.insert(spotifyConnections).values({
        userId: testUserId,
        spotifyId: 'test_spotify_user_id',
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token',
        expiresAt: new Date(Date.now() + 3600000),
        isActive: true,
      }).returning();

      expect(connection).toBeDefined();
      expect(connection.userId).toBe(testUserId);
      expect(connection.spotifyId).toBe('test_spotify_user_id');
      expect(connection.isActive).toBe(true);
    });
  });

  describe('Listening History table', () => {
    it('should create listening history successfully', async () => {
      const playedAt = new Date();
      const [history] = await db.insert(listeningHistory).values({
        userId: testUserId,
        songId: testSongId,
        playedAt,
        duration: 120,
      }).returning();

      expect(history).toBeDefined();
      expect(history.userId).toBe(testUserId);
      expect(history.songId).toBe(testSongId);
      expect(history.duration).toBe(120);
    });

    it('should enforce foreign key constraints', async () => {
      await expect(
        db.insert(listeningHistory).values({
          userId: 'non-existent-user-id',
          songId: testSongId,
          playedAt: new Date(),
          duration: 120,
        })
      ).rejects.toThrow();
    });
  });

  describe('Relationships', () => {
    it('should cascade delete when user is deleted', async () => {
      // First verify data exists
      const existingHistory = await db.select().from(listeningHistory).where(eq(listeningHistory.userId, testUserId));
      const existingConnection = await db.select().from(spotifyConnections).where(eq(spotifyConnections.userId, testUserId));
      
      expect(existingHistory.length).toBeGreaterThan(0);
      expect(existingConnection.length).toBeGreaterThan(0);

      // Delete user
      await db.delete(users).where(eq(users.id, testUserId));

      // Verify cascaded deletes
      const remainingHistory = await db.select().from(listeningHistory).where(eq(listeningHistory.userId, testUserId));
      const remainingConnection = await db.select().from(spotifyConnections).where(eq(spotifyConnections.userId, testUserId));
      
      expect(remainingHistory.length).toBe(0);
      expect(remainingConnection.length).toBe(0);
    });
  });
});
