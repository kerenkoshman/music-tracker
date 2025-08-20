import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuthStore } from '../store/authStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, error } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="container">
        <div className="card" style={{ maxWidth: '28rem', margin: '0 auto' }}>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#111827' }}>
              Welcome to Music Tracker
            </h1>
            <p style={{ color: '#6b7280' }}>
              Connect your Spotify account and discover your music insights
            </p>
          </div>
          
          <GoogleLoginButton />
          
          {error && (
            <div className="mt-4 p-3 rounded" style={{ 
              backgroundColor: '#fef2f2', 
              border: '1px solid #f87171', 
              color: '#dc2626' 
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
