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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center space-x-6">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="h-24 w-24 rounded-full"
              />
            ) : (
              <div className="h-24 w-24 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-4xl font-medium text-orange-600">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-lg text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
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
        <Card title="Account Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <p className="text-gray-900">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Created
              </label>
              <p className="text-gray-900">
                {new Date(user?.createdAt || '').toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Updated
              </label>
              <p className="text-gray-900">
                {new Date(user?.updatedAt || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Spotify Connection */}
        <Card title="Spotify Connection">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Connection Status</p>
                <p className={`text-sm ${spotifyStatus.connected ? 'text-green-600' : 'text-red-600'}`}>
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
                <p className="text-sm font-medium text-gray-700">Last Data Sync</p>
                <p className="text-sm text-gray-900">
                  {new Date(spotifyStatus.lastSync).toLocaleString()}
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">What we track:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
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
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Data Usage</h4>
              <p className="text-sm text-gray-600">
                We only access your Spotify listening data to provide personalized insights. 
                Your data is never shared with third parties and is stored securely.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Data Retention</h4>
              <p className="text-sm text-gray-600">
                We retain your listening history for 1 week to provide meaningful insights. 
                You can disconnect your Spotify account at any time to stop data collection.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Account Deletion</h4>
              <p className="text-sm text-gray-600">
                To delete your account and all associated data, please contact our support team.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;
