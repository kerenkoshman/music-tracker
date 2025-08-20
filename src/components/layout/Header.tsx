import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSpotifyStore } from '../../store/spotifyStore';
import { Button } from '../ui';
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  MusicalNoteIcon 
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { connection } = useSpotifyStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <MusicalNoteIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-display font-bold text-gray-900">
                Music Tracker
              </span>
            </Link>
          </div>

          {/* Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/artists"
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                Top Artists
              </Link>
              <Link
                to="/tracks"
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                Top Tracks
              </Link>
              <Link
                to="/recent"
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                Recently Played
              </Link>
            </nav>
          )}

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Spotify connection status */}
                <div className="hidden sm:flex items-center space-x-2">
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      connection.connected ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                  <span className="text-sm text-gray-600">
                    {connection.connected ? 'Spotify Connected' : 'No Spotify'}
                  </span>
                </div>

                {/* User info */}
                <div className="flex items-center space-x-3">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                  )}
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>

                {/* Logout button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
                >
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
