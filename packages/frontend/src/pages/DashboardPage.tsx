import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { spotifyAPI } from '../services/api';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import TopArtistsList from '../components/dashboard/TopArtistsList';
import TopSongsList from '../components/dashboard/TopSongsList';
import TimeRangeSelector from '../components/dashboard/TimeRangeSelector';
import Card from '../components/ui/Card';

interface SpotifyStatus {
  connected: boolean;
  lastSync?: string;
}

interface Artist {
  id: string;
  name: string;
  image?: string;
  popularity: number;
  genres: string[];
}

interface Song {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumImage?: string;
  duration: number;
  popularity: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [spotifyStatus, setSpotifyStatus] = useState<SpotifyStatus>({ connected: false });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('short_term');
  
  // Data states
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [artistsLoading, setArtistsLoading] = useState(false);
  const [songsLoading, setSongsLoading] = useState(false);

  useEffect(() => {
    const checkSpotifyStatus = async () => {
      try {
        const status = await spotifyAPI.getStatus();
        setSpotifyStatus(status);
      } catch (error) {
        console.error('Failed to check Spotify status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSpotifyStatus();
  }, []);

  useEffect(() => {
    if (spotifyStatus.connected) {
      fetchTopArtists();
      fetchTopSongs();
    }
  }, [spotifyStatus.connected, selectedTimeRange]);

  const fetchTopArtists = async () => {
    try {
      setArtistsLoading(true);
      const artists = await spotifyAPI.getTopArtists(selectedTimeRange);
      setTopArtists(artists);
    } catch (error) {
      console.error('Failed to fetch top artists:', error);
    } finally {
      setArtistsLoading(false);
    }
  };

  const fetchTopSongs = async () => {
    try {
      setSongsLoading(true);
      const songs = await spotifyAPI.getTopSongs(selectedTimeRange);
      setTopSongs(songs);
    } catch (error) {
      console.error('Failed to fetch top songs:', error);
    } finally {
      setSongsLoading(false);
    }
  };

  const handleSpotifyConnect = async () => {
    try {
      const result = await spotifyAPI.connect();
      if (result.authUrl) {
        window.location.href = result.authUrl;
      }
    } catch (error) {
      console.error('Failed to connect Spotify:', error);
    }
  };

  const handleSpotifyDisconnect = async () => {
    try {
      await spotifyAPI.disconnect();
      setSpotifyStatus({ connected: false });
      setTopArtists([]);
      setTopSongs([]);
    } catch (error) {
      console.error('Failed to disconnect Spotify:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="h-16 w-16 rounded-full"
              />
            ) : (
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-medium text-orange-600">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name}! 🎵
              </h1>
              <p className="text-gray-600">
                Track your music listening habits and discover your favorite artists
              </p>
            </div>
          </div>
        </div>

        {/* Spotify Connection Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Spotify Connection
              </h2>
              <p className="text-gray-600">
                {spotifyStatus.connected 
                  ? 'Connected to Spotify - Your listening data is being tracked'
                  : 'Connect your Spotify account to start tracking your music'
                }
              </p>
              {spotifyStatus.lastSync && (
                <p className="text-sm text-gray-500 mt-1">
                  Last synced: {new Date(spotifyStatus.lastSync).toLocaleDateString()}
                </p>
              )}
            </div>
            <div>
              {spotifyStatus.connected ? (
                <Button
                  variant="outline"
                  onClick={handleSpotifyDisconnect}
                >
                  Disconnect Spotify
                </Button>
              ) : (
                <Button
                  onClick={handleSpotifyConnect}
                >
                  Connect Spotify
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tracks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {spotifyStatus.connected ? topSongs.length : '0'}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Top Artists</p>
                <p className="text-2xl font-bold text-gray-900">
                  {spotifyStatus.connected ? topArtists.length : '0'}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Listening Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {spotifyStatus.connected ? 'Calculating...' : '0h'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Music Data Section */}
        {spotifyStatus.connected && (
          <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex justify-center">
              <TimeRangeSelector
                selectedRange={selectedTimeRange}
                onRangeChange={setSelectedTimeRange}
              />
            </div>

            {/* Top Artists and Songs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopArtistsList
                artists={topArtists}
                isLoading={artistsLoading}
                timeRange={selectedTimeRange}
              />
              <TopSongsList
                songs={topSongs}
                isLoading={songsLoading}
                timeRange={selectedTimeRange}
              />
            </div>
          </div>
        )}

        {/* Call to Action */}
        {!spotifyStatus.connected && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to discover your music taste?
            </h3>
            <p className="text-gray-600 mb-4">
              Connect your Spotify account to see your top artists, favorite songs, and listening patterns
            </p>
            <Button onClick={handleSpotifyConnect}>
              Connect Spotify Now
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
