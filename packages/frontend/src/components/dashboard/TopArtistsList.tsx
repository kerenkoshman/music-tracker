import React from 'react';
import Card from '../ui/Card';

interface Artist {
  id: string;
  name: string;
  image?: string;
  popularity: number;
  genres: string[];
}

interface TopArtistsListProps {
  artists: Artist[];
  isLoading: boolean;
  timeRange: string;
}

const TopArtistsList: React.FC<TopArtistsListProps> = ({ artists, isLoading, timeRange }) => {
  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'short_term': return 'Last 4 weeks';
      case 'medium_term': return 'Last 6 months';
      case 'long_term': return 'All time';
      default: return 'Last 4 weeks';
    }
  };

  if (isLoading) {
    return (
      <Card title="Top Artists" subtitle={getTimeRangeLabel(timeRange)}>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
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

  if (!artists || artists.length === 0) {
    return (
      <Card title="Top Artists" subtitle={getTimeRangeLabel(timeRange)}>
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <p className="text-gray-500">No artists data available</p>
          <p className="text-sm text-gray-400">Connect your Spotify account to see your top artists</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Top Artists" subtitle={getTimeRangeLabel(timeRange)}>
      <div className="space-y-4">
        {artists.map((artist, index) => (
          <div key={artist.id} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-lg font-bold text-gray-600">
                {index + 1}
              </div>
            </div>
            
            {artist.image ? (
              <img
                src={artist.image}
                alt={artist.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {artist.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {artist.genres.slice(0, 2).join(', ')}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <div className="text-sm text-gray-500">
                {artist.popularity}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopArtistsList;
