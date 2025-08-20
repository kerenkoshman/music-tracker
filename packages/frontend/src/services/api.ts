import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (token: string) => {
    const response = await api.post('/auth/google', { token });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export const spotifyAPI = {
  connect: async () => {
    const response = await api.get('/spotify/connect');
    return response.data;
  },
  
  disconnect: async () => {
    const response = await api.post('/spotify/disconnect');
    return response.data;
  },
  
  getStatus: async () => {
    const response = await api.get('/spotify/status');
    return response.data;
  },
  
  getTopArtists: async (timeRange: string = 'short_term') => {
    const response = await api.get(`/spotify/top-artists?timeRange=${timeRange}`);
    return response.data;
  },
  
  getTopSongs: async (timeRange: string = 'short_term') => {
    const response = await api.get(`/spotify/top-songs?timeRange=${timeRange}`);
    return response.data;
  },
  
  getRecentTracks: async () => {
    const response = await api.get('/spotify/recent-tracks');
    return response.data;
  },
};

export default api;
