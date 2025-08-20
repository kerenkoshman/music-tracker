import { create } from 'zustand';
import { SpotifyState, SpotifyArtist, SpotifyTrack, SpotifyTimeRange } from '../types';
import { spotifyApi } from '../services/api';

interface SpotifyStore extends SpotifyState {
  // Actions
  checkConnection: () => Promise<void>;
  connect: (redirectUri?: string) => Promise<string>;
  disconnect: () => Promise<void>;
  fetchRecentlyPlayed: () => Promise<void>;
  fetchTopArtists: (timeRange?: SpotifyTimeRange) => Promise<void>;
  fetchTopTracks: (timeRange?: SpotifyTimeRange) => Promise<void>;
  syncData: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useSpotifyStore = create<SpotifyStore>((set, get) => ({
  connection: { connected: false },
  recentlyPlayed: [],
  topArtists: [],
  topTracks: [],
  isLoading: false,
  lastSync: undefined,

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  checkConnection: async () => {
    set({ isLoading: true });
    try {
      const response = await spotifyApi.getStatus();
      if (response.success && response.data) {
        set({ connection: response.data });
      }
    } catch (error) {
      console.error('Error checking Spotify connection:', error);
      set({ connection: { connected: false } });
    } finally {
      set({ isLoading: false });
    }
  },

  connect: async (redirectUri?: string): Promise<string> => {
    try {
      const response = await spotifyApi.getConnectUrl(redirectUri);
      if (response.success && response.data) {
        return response.data.authUrl;
      }
      throw new Error('Failed to get Spotify connect URL');
    } catch (error) {
      console.error('Error connecting to Spotify:', error);
      throw error;
    }
  },

  disconnect: async () => {
    set({ isLoading: true });
    try {
      await spotifyApi.disconnect();
      set({
        connection: { connected: false },
        recentlyPlayed: [],
        topArtists: [],
        topTracks: [],
        lastSync: undefined,
      });
    } catch (error) {
      console.error('Error disconnecting Spotify:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRecentlyPlayed: async () => {
    set({ isLoading: true });
    try {
      const response = await spotifyApi.getRecentlyPlayed();
      if (response.success && response.data) {
        set({ recentlyPlayed: response.data.tracks });
      }
    } catch (error) {
      console.error('Error fetching recently played:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTopArtists: async (timeRange: SpotifyTimeRange = 'short_term') => {
    set({ isLoading: true });
    try {
      const response = await spotifyApi.getTopArtists(timeRange);
      if (response.success && response.data) {
        set({ topArtists: response.data.artists });
      }
    } catch (error) {
      console.error('Error fetching top artists:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTopTracks: async (timeRange: SpotifyTimeRange = 'short_term') => {
    set({ isLoading: true });
    try {
      const response = await spotifyApi.getTopTracks(timeRange);
      if (response.success && response.data) {
        set({ topTracks: response.data.tracks });
      }
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  syncData: async () => {
    set({ isLoading: true });
    try {
      const response = await spotifyApi.sync();
      if (response.success) {
        set({ lastSync: new Date().toISOString() });
        // Optionally refresh data after sync
        await get().fetchRecentlyPlayed();
      }
    } catch (error) {
      console.error('Error syncing Spotify data:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
});
