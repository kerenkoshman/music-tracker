// User types
export interface User {
  id: string;
  email: string;
  googleId: string;
  name: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
}

// Spotify types
export interface SpotifyConnection {
  connected: boolean;
  spotifyId?: string;
  expiresAt?: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images?: Array<{ url: string }>;
  popularity: number;
  genres: string[];
}

export interface SpotifyTrack {
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

export interface RecentlyPlayed {
  tracks: SpotifyTrack[];
}

export interface TopArtists {
  artists: SpotifyArtist[];
}

export interface TopTracks {
  tracks: SpotifyTrack[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
  message?: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Spotify state types
export interface SpotifyState {
  connection: SpotifyConnection;
  recentlyPlayed: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
  isLoading: boolean;
  lastSync?: string;
}

// Time range options for Spotify top data
export type SpotifyTimeRange = 'short_term' | 'medium_term' | 'long_term';

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  current: boolean;
}
