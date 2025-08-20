import { spotifyConfig } from '../config/spotify.js';
import { db } from '../db/connection.js';
import { spotifyConnections, users, artists, songs, listeningHistory } from '../db/schema.js';
import { eq, and, desc, gte } from 'drizzle-orm';

interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface SpotifyUser {
  id: string;
  email: string;
  display_name: string;
  images?: Array<{ url: string }>;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    name: string;
    images?: Array<{ url: string }>;
  };
  duration_ms: number;
  popularity: number;
  played_at?: string;
}

interface SpotifyArtist {
  id: string;
  name: string;
  images?: Array<{ url: string }>;
  popularity: number;
  genres: string[];
}

// Exchange authorization code for access token
export async function exchangeCodeForTokens(code: string): Promise<SpotifyTokens> {
  const response = await fetch(`${spotifyConfig.authBaseUrl}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: spotifyConfig.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for tokens: ${error}`);
  }

  return response.json();
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
  const response = await fetch(`${spotifyConfig.authBaseUrl}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh access token: ${error}`);
  }

  return response.json();
}

// Get Spotify user profile
export async function getSpotifyUserProfile(accessToken: string): Promise<SpotifyUser> {
  const response = await fetch(`${spotifyConfig.apiBaseUrl}/me`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Spotify user profile: ${error}`);
  }

  return response.json();
}

// Get user's recently played tracks
export async function getRecentlyPlayed(accessToken: string, limit: number = 50): Promise<SpotifyTrack[]> {
  const response = await fetch(`${spotifyConfig.apiBaseUrl}/me/player/recently-played?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get recently played tracks: ${error}`);
  }

  const data = await response.json();
  return data.items.map((item: any) => ({
    ...item.track,
    played_at: item.played_at,
  }));
}

// Get user's top artists
export async function getTopArtists(accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term', limit: number = 20): Promise<SpotifyArtist[]> {
  const response = await fetch(`${spotifyConfig.apiBaseUrl}/me/top/artists?time_range=${timeRange}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get top artists: ${error}`);
  }

  const data = await response.json();
  return data.items;
}

// Get user's top tracks
export async function getTopTracks(accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term', limit: number = 20): Promise<SpotifyTrack[]> {
  const response = await fetch(`${spotifyConfig.apiBaseUrl}/me/top/tracks?time_range=${timeRange}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get top tracks: ${error}`);
  }

  const data = await response.json();
  return data.items;
}

// Save or update Spotify connection
export async function saveSpotifyConnection(userId: string, spotifyUser: SpotifyUser, tokens: SpotifyTokens): Promise<void> {
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  await db
    .insert(spotifyConnections)
    .values({
      userId,
      spotifyId: spotifyUser.id,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      isActive: true,
    })
    .onConflictDoUpdate({
      target: spotifyConnections.userId,
      set: {
        spotifyId: spotifyUser.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
        isActive: true,
        updatedAt: new Date(),
      },
    });
}

// Get Spotify connection for user
export async function getSpotifyConnection(userId: string) {
  const connection = await db
    .select()
    .from(spotifyConnections)
    .where(eq(spotifyConnections.userId, userId))
    .limit(1);

  return connection[0] || null;
}

// Check if Spotify token is expired
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() >= expiresAt;
}

// Get valid access token (refresh if needed)
export async function getValidAccessToken(userId: string): Promise<string | null> {
  const connection = await getSpotifyConnection(userId);
  
  if (!connection) {
    return null;
  }

  if (isTokenExpired(connection.expiresAt)) {
    try {
      const newTokens = await refreshAccessToken(connection.refreshToken);
      const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000);

      await db
        .update(spotifyConnections)
        .set({
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token || connection.refreshToken,
          expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(spotifyConnections.userId, userId));

      return newTokens.access_token;
    } catch (error) {
      console.error('Failed to refresh Spotify token:', error);
      // Mark connection as inactive
      await db
        .update(spotifyConnections)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(spotifyConnections.userId, userId));
      return null;
    }
  }

  return connection.accessToken;
}

// Save artist to database
export async function saveArtist(spotifyArtist: SpotifyArtist) {
  const [artist] = await db
    .insert(artists)
    .values({
      spotifyId: spotifyArtist.id,
      name: spotifyArtist.name,
      imageUrl: spotifyArtist.images?.[0]?.url || null,
      popularity: spotifyArtist.popularity,
      genres: spotifyArtist.genres,
    })
    .onConflictDoUpdate({
      target: artists.spotifyId,
      set: {
        name: spotifyArtist.name,
        imageUrl: spotifyArtist.images?.[0]?.url || null,
        popularity: spotifyArtist.popularity,
        genres: spotifyArtist.genres,
        updatedAt: new Date(),
      },
    })
    .returning();

  return artist;
}

// Save song to database
export async function saveSong(spotifyTrack: SpotifyTrack, artistId: string) {
  const [song] = await db
    .insert(songs)
    .values({
      spotifyId: spotifyTrack.id,
      name: spotifyTrack.name,
      artistId,
      albumName: spotifyTrack.album.name,
      albumImageUrl: spotifyTrack.album.images?.[0]?.url || null,
      duration: spotifyTrack.duration_ms,
      popularity: spotifyTrack.popularity,
    })
    .onConflictDoUpdate({
      target: songs.spotifyId,
      set: {
        name: spotifyTrack.name,
        artistId,
        albumName: spotifyTrack.album.name,
        albumImageUrl: spotifyTrack.album.images?.[0]?.url || null,
        duration: spotifyTrack.duration_ms,
        popularity: spotifyTrack.popularity,
        updatedAt: new Date(),
      },
    })
    .returning();

  return song;
}

// Save listening history entry
export async function saveListeningHistory(userId: string, songId: string, playedAt: string, duration?: number) {
  await db
    .insert(listeningHistory)
    .values({
      userId,
      songId,
      playedAt: new Date(playedAt),
      duration: duration || null,
    })
    .onConflictDoNothing();
}

// Disconnect Spotify account
export async function disconnectSpotify(userId: string): Promise<void> {
  await db
    .update(spotifyConnections)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(spotifyConnections.userId, userId));
}
