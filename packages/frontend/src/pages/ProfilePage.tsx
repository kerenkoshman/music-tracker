import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { spotifyAPI } from '../services/api';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface SpotifyStatus {
  connected: boolean;
  lastSync?: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [spotifyStatus, setSpotifyStatus] = useState<SpotifyStatus>({ connected: false });
  const [isLoading, setIsLoading] = useState(true);

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
    } catch (error) {
      console.error('Failed to disconnect Spotify:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await spotifyAPI.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      logout();
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center" style={{ height: '16rem' }}>
          <div className="spinner" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="main-content">
        <div className="container" style={{ maxWidth: '64rem', margin: '0 auto' }}>
          {/* Profile Header */}
          <div className="card mb-8" style={{ padding: '2rem' }}>
            <div className="flex items-center gap-6">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  style={{ width: '6rem', height: '6rem', borderRadius: '50%' }}
                />
              ) : (
                <div style={{ 
                  width: '6rem', 
                  height: '6rem', 
                  backgroundColor: '#fed7aa', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ 
                    fontSize: '2.25rem', 
                    fontWeight: '500', 
                    color: '#ea580c' 
                  }}>
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>{user?.name}</h1>
                <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>{user?.email}</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Account Information */}
          <Card title="Account Information" className="mb-8">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem' 
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '0.5rem' 
                }}>
                  Full Name
                </label>
                <p style={{ color: '#111827' }}>{user?.name}</p>
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '0.5rem' 
                }}>
                  Email Address
                </label>
                <p style={{ color: '#111827' }}>{user?.email}</p>
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '0.5rem' 
                }}>
                  Account Created
                </label>
                <p style={{ color: '#111827' }}>
                  {new Date(user?.createdAt || '').toLocaleDateString()}
                </p>
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '0.5rem' 
                }}>
                  Last Updated
                </label>
                <p style={{ color: '#111827' }}>
                  {new Date(user?.updatedAt || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Spotify Connection */}
          <Card title="Spotify Connection" className="mb-8">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Connection Status</p>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: spotifyStatus.connected ? '#059669' : '#dc2626' 
                  }}>
                    {spotifyStatus.connected ? 'Connected' : 'Not Connected'}
                  </p>
                </div>
                <div>
                  {spotifyStatus.connected ? (
                    <Button
                      variant="outline"
                      onClick={handleSpotifyDisconnect}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSpotifyConnect}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>

              {spotifyStatus.lastSync && (
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Last Data Sync</p>
                  <p style={{ fontSize: '0.875rem', color: '#111827' }}>
                    {new Date(spotifyStatus.lastSync).toLocaleString()}
                  </p>
                </div>
              )}

              <div style={{ 
                backgroundColor: '#f9fafb', 
                borderRadius: '0.5rem', 
                padding: '1rem' 
              }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>What we track:</h4>
                <ul style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>• Your top artists and songs</li>
                  <li>• Listening history and patterns</li>
                  <li>• Genre preferences and trends</li>
                  <li>• Music discovery insights</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Privacy & Data */}
          <Card title="Privacy & Data">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Data Usage</h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  We only access your Spotify listening data to provide personalized insights. 
                  Your data is never shared with third parties and is stored securely.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Data Retention</h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  We retain your listening history for 1 week to provide meaningful insights. 
                  You can disconnect your Spotify account at any time to stop data collection.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Account Deletion</h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  To delete your account and all associated data, please contact our support team.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
