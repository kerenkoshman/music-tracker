import React from 'react';
import Card from '../ui/Card';

interface Song {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumImage?: string;
  duration: number;
  popularity: number;
}

interface TopSongsListProps {
  songs: Song[];
  isLoading: boolean;
  timeRange: string;
}

const TopSongsList: React.FC<TopSongsListProps> = ({ songs, isLoading, timeRange }) => {
  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'short_term': return 'Last 4 weeks';
      case 'medium_term': return 'Last 6 months';
      case 'long_term': return 'All time';
      default: return 'Last 4 weeks';
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card title="Top Songs" subtitle={getTimeRangeLabel(timeRange)}>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!songs || songs.length === 0) {
    return (
      <Card title="Top Songs" subtitle={getTimeRangeLabel(timeRange)}>
        <div className="text-center py-8">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-8 w-8 text-gray-400"
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
          <p className="text-gray-500">No songs data available</p>
          <p className="text-sm text-gray-400">Connect your Spotify account to see your top songs</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Top Songs" subtitle={getTimeRangeLabel(timeRange)}>
      <div className="space-y-4">
        {songs.map((song, index) => (
          <div key={song.id} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-lg font-bold text-gray-600">
                {index + 1}
              </div>
            </div>
            
            {song.albumImage ? (
              <img
                src={song.albumImage}
                alt={song.album}
                className="h-12 w-12 rounded object-cover"
              />
            ) : (
              <div className="h-12 w-12 bg-orange-100 rounded flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-orange-600"
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
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {song.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {song.artist} • {song.album}
              </p>
            </div>
            
            <div className="flex-shrink-0 flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                {formatDuration(song.duration)}
              </div>
              <div className="text-sm text-gray-500">
                {song.popularity}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopSongsList;
