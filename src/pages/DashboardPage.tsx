import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSpotifyStore } from '../store/spotifyStore';
import { Layout } from '../components/layout';
import { Button, Card, CardHeader, CardContent, LoadingSpinner } from '../components/ui';
import { 
  MusicalNoteIcon, 
  UserGroupIcon, 
  ClockIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import { spotifyApi } from '../services/api';
import { getErrorMessage } from '../utils';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    connection, 
    isLoading, 
    checkConnection,
    fetchRecentlyPlayed,
    fetchTopArtists,
    fetchTopTracks,
    recentlyPlayed,
    topArtists,
    topTracks
  } = useSpotifyStore();

  const [isConnecting, setIsConnecting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    // Check Spotify connection status
    checkConnection();
  }, [checkConnection]);

  useEffect(() => {
    // If connected, fetch initial data
    if (connection.connected) {
      loadDashboardData();
    }
  }, [connection.connected]);

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        fetchRecentlyPlayed(),
        fetchTopArtists(),
        fetchTopTracks()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(getErrorMessage(error));
    }
  };

  const handleSpotifyConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const response = await spotifyApi.getConnectUrl(
        `${window.location.origin}/dashboard`
      );
      
      if (response.success && response.data) {
        window.location.href = response.data.authUrl;
      } else {
        throw new Error('Failed to get Spotify connect URL');
      }
    } catch (error) {
      console.error('Spotify connect failed:', error);
      setError(getErrorMessage(error));
      setIsConnecting(false);
    }
  };

  const stats = [
    {
      name: 'Recent Tracks',
      value: recentlyPlayed.length,
      icon: ClockIcon,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      name: 'Top Artists',
      value: topArtists.length,
      icon: UserGroupIcon,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      name: 'Top Tracks',
      value: topTracks.length,
      icon: MusicalNoteIcon,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold mb-2">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-primary-100">
                Track your music listening habits and discover your music taste
              </p>
            </div>
            <SparklesIcon className="h-16 w-16 text-primary-200" />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Spotify connection status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                  <MusicalNoteIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Spotify Connection
                  </h3>
                  <p className="text-sm text-gray-600">
                    {connection.connected 
                      ? 'Your Spotify account is connected'
                      : 'Connect your Spotify account to start tracking'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  connection.connected ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className="text-sm font-medium text-gray-700">
                  {connection.connected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>
          </CardHeader>

          {!connection.connected && (
            <CardContent>
              <div className="text-center py-6">
                <MusicalNoteIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Connect to Spotify
                </h4>
                <p className="text-gray-600 mb-6">
                  Connect your Spotify account to start tracking your music listening habits
                </p>
                <Button
                  onClick={handleSpotifyConnect}
                  isLoading={isConnecting}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Connect Spotify Account
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Stats overview */}
        {connection.connected && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat) => (
                <Card key={stat.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          {stat.name}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {isLoading ? '...' : stat.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent tracks preview */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recently Played
                  </h3>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : recentlyPlayed.length > 0 ? (
                    <div className="space-y-3">
                      {recentlyPlayed.slice(0, 5).map((track, index) => (
                        <div key={`${track.id}-${index}`} className="flex items-center space-x-3">
                          {track.album.images?.[0] && (
                            <img
                              src={track.album.images[0].url}
                              alt={track.album.name}
                              className="w-10 h-10 rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {track.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {track.artists.map(artist => artist.name).join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                      {recentlyPlayed.length > 5 && (
                        <div className="text-center pt-4">
                          <Button variant="outline" size="sm">
                            View All Recent Tracks
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No recent tracks found
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top artists preview */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Top Artists
                  </h3>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : topArtists.length > 0 ? (
                    <div className="space-y-3">
                      {topArtists.slice(0, 5).map((artist, index) => (
                        <div key={artist.id} className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full text-primary-600 font-semibold text-sm">
                            {index + 1}
                          </div>
                          {artist.images?.[0] && (
                            <img
                              src={artist.images[0].url}
                              alt={artist.name}
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {artist.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {artist.genres.slice(0, 2).join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                      {topArtists.length > 5 && (
                        <div className="text-center pt-4">
                          <Button variant="outline" size="sm">
                            View All Top Artists
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No top artists found
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
