import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuthStore } from '../../store/authStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, error } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="container">
        <div className="card max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Music Tracker
            </h1>
            <p className="text-gray-600">
              Connect your Spotify account and discover your music insights
            </p>
          </div>
          
          <GoogleLoginButton />
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
