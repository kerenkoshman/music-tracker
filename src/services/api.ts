import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, User, SpotifyConnection, RecentlyPlayed, TopArtists, TopTracks, SpotifyTimeRange } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Remove invalid token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  // Get Google OAuth URL
  getGoogleAuthUrl: async (redirectUri?: string): Promise<ApiResponse<{ authUrl: string }>> => {
    const params = redirectUri ? `?redirect_uri=${encodeURIComponent(redirectUri)}` : '';
    const response = await api.get(`/auth/google${params}`);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Verify token
  verifyToken: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.post('/auth/verify');
    return response.data;
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  },
};

// Spotify API calls
export const spotifyApi = {
  // Get Spotify connection URL
  getConnectUrl: async (redirectUri?: string): Promise<ApiResponse<{ authUrl: string }>> => {
    const params = redirectUri ? `?redirect_uri=${encodeURIComponent(redirectUri)}` : '';
    const response = await api.get(`/spotify/connect${params}`);
    return response.data;
  },

  // Get connection status
  getStatus: async (): Promise<ApiResponse<SpotifyConnection>> => {
    const response = await api.get('/spotify/status');
    return response.data;
  },

  // Disconnect Spotify account
  disconnect: async (): Promise<ApiResponse> => {
    const response = await api.post('/spotify/disconnect');
    return response.data;
  },

  // Get recently played tracks
  getRecentlyPlayed: async (limit: number = 50): Promise<ApiResponse<RecentlyPlayed>> => {
    const response = await api.get(`/spotify/recently-played?limit=${limit}`);
    return response.data;
  },

  // Get top artists
  getTopArtists: async (
    timeRange: SpotifyTimeRange = 'short_term',
    limit: number = 20
  ): Promise<ApiResponse<TopArtists>> => {
    const response = await api.get(`/spotify/top-artists?time_range=${timeRange}&limit=${limit}`);
    return response.data;
  },

  // Get top tracks
  getTopTracks: async (
    timeRange: SpotifyTimeRange = 'short_term',
    limit: number = 20
  ): Promise<ApiResponse<TopTracks>> => {
    const response = await api.get(`/spotify/top-tracks?time_range=${timeRange}&limit=${limit}`);
    return response.data;
  },

  // Sync Spotify data
  sync: async (): Promise<ApiResponse<{ syncedCount: number; totalTracks: number }>> => {
    const response = await api.post('/spotify/sync');
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<ApiResponse> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
