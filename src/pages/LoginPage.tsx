import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/api';
import { Button, Card, CardContent, LoadingSpinner } from '../components/ui';
import { MusicalNoteIcon } from '@heroicons/react/24/outline';
import { getErrorMessage } from '../utils';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, isLoading } = useAuthStore();
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Handle token from URL params (after OAuth callback)
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleTokenLogin(token);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleTokenLogin = async (token: string) => {
    try {
      await login(token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Token login failed:', error);
      setError(getErrorMessage(error));
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    
    try {
      const response = await authApi.getGoogleAuthUrl(
        `${window.location.origin}/login`
      );
      
      if (response.success && response.data) {
        window.location.href = response.data.authUrl;
      } else {
        throw new Error('Failed to get Google OAuth URL');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      setError(getErrorMessage(error));
      setIsGoogleLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Signing you in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MusicalNoteIcon className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Music Tracker
          </h1>
          <p className="text-gray-600">
            Track your music listening habits with Spotify
          </p>
        </div>

        {/* Login card */}
        <Card>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600">
                  Sign in to access your music statistics
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <Button
                  onClick={handleGoogleLogin}
                  isLoading={isGoogleLoading}
                  className="w-full"
                  size="lg"
                  leftIcon={
                    !isGoogleLoading && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )
                  }
                >
                  Continue with Google
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            What you'll get:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                <MusicalNoteIcon className="w-4 h-4 text-primary-600" />
              </div>
              <span className="text-gray-700">Track Listening</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center mb-2">
                <MusicalNoteIcon className="w-4 h-4 text-secondary-600" />
              </div>
              <span className="text-gray-700">Top Artists</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center mb-2">
                <MusicalNoteIcon className="w-4 h-4 text-accent-600" />
              </div>
              <span className="text-gray-700">Statistics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
