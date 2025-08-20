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
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#111827' }}>
              Welcome back, {user?.name}! 🎵
            </h1>
            <p style={{ color: '#6b7280' }}>
              Track your music listening habits and discover insights about your taste
            </p>
          </div>

          {/* Spotify Connection Status */}
          <Card title="Spotify Connection" className="mb-6">
            {spotifyStatus.connected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div style={{ 
                    width: '0.75rem', 
                    height: '0.75rem', 
                    backgroundColor: '#10b981', 
                    borderRadius: '50%' 
                  }}></div>
                  <span style={{ color: '#047857', fontWeight: '500' }}>
                    Connected to Spotify
                  </span>
                  {spotifyStatus.username && (
                    <span style={{ color: '#6b7280' }}>
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
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem', 
            marginBottom: '2rem' 
          }}>
            <Card title="Total Tracks" className="text-center">
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#ea580c' }}>0</div>
              <p style={{ color: '#6b7280' }}>tracks analyzed</p>
            </Card>
            <Card title="Top Artists" className="text-center">
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#ea580c' }}>0</div>
              <p style={{ color: '#6b7280' }}>artists discovered</p>
            </Card>
            <Card title="Listening Time" className="text-center">
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#ea580c' }}>0h</div>
              <p style={{ color: '#6b7280' }}>total time</p>
            </Card>
          </div>

          {/* Call to Action */}
          {!spotifyStatus.connected && (
            <Card className="text-center" style={{ 
              backgroundColor: '#fff7ed', 
              border: '1px solid #fed7aa' 
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#9a3412', 
                marginBottom: '0.5rem' 
              }}>
                Ready to discover your music taste?
              </h3>
              <p style={{ color: '#c2410c', marginBottom: '1rem' }}>
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
