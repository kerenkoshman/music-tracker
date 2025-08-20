import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { spotifyAPI } from '../services/api';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface SpotifyStatus {
  connected: boolean;
  username?: string;
}

interface Artist {
  id: string;
  name: string;
  image: string;
  genres: string[];
  popularity: number;
}

interface Song {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  duration: number;
  popularity: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [spotifyStatus, setSpotifyStatus] = useState<SpotifyStatus>({ connected: false });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkSpotifyStatus();
  }, []);

  const checkSpotifyStatus = async () => {
    try {
      const status = await spotifyAPI.getStatus();
      setSpotifyStatus(status);
    } catch (error) {
      console.error('Failed to check Spotify status:', error);
    }
  };

  const handleConnectSpotify = async () => {
    try {
      setIsLoading(true);
      const authUrl = await spotifyAPI.connect();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to connect Spotify:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectSpotify = async () => {
    try {
      setIsLoading(true);
      await spotifyAPI.disconnect();
      setSpotifyStatus({ connected: false });
    } catch (error) {
      console.error('Failed to disconnect Spotify:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="main-content">
        <div className="container">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}! 🎵
            </h1>
            <p className="text-gray-600">
              Track your music listening habits and discover insights about your taste
            </p>
          </div>

          {/* Spotify Connection Status */}
          <Card title="Spotify Connection" className="mb-6">
            {spotifyStatus.connected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    Connected to Spotify
                  </span>
                  {spotifyStatus.username && (
                    <span className="text-gray-600">
                      as {spotifyStatus.username}
                    </span>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleDisconnectSpotify}
                  isLoading={isLoading}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Connect your Spotify account to start tracking your music
                </p>
                <Button 
                  onClick={handleConnectSpotify}
                  isLoading={isLoading}
                >
                  Connect Spotify
                </Button>
              </div>
            )}
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card title="Total Tracks" className="text-center">
              <div className="text-3xl font-bold text-orange-600">0</div>
              <p className="text-gray-600">tracks analyzed</p>
            </Card>
            <Card title="Top Artists" className="text-center">
              <div className="text-3xl font-bold text-orange-600">0</div>
              <p className="text-gray-600">artists discovered</p>
            </Card>
            <Card title="Listening Time" className="text-center">
              <div className="text-3xl font-bold text-orange-600">0h</div>
              <p className="text-gray-600">total time</p>
            </Card>
          </div>

          {/* Call to Action */}
          {!spotifyStatus.connected && (
            <Card className="text-center bg-orange-50 border-orange-200">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">
                Ready to discover your music taste?
              </h3>
              <p className="text-orange-700 mb-4">
                Connect your Spotify account to see your top artists, songs, and listening patterns
              </p>
              <Button onClick={handleConnectSpotify} isLoading={isLoading}>
                Get Started with Spotify
              </Button>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
