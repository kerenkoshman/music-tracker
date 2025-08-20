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
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div className="container">
        <div className="card fade-in" style={{ 
          maxWidth: '32rem', 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          {/* Logo/Icon */}
          <div className="mb-6">
            <div style={{
              width: '4rem',
              height: '4rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px -3px rgba(245, 158, 11, 0.4)'
            }}>
              <span style={{ 
                fontSize: '2rem', 
                color: 'white',
                fontWeight: 'bold'
              }}>
                🎵
              </span>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              color: '#1f2937',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome to Music Tracker
            </h1>
            <p style={{ 
              fontSize: '1.125rem',
              color: '#6b7280',
              lineHeight: '1.7',
              maxWidth: '24rem',
              margin: '0 auto'
            }}>
              Connect your Spotify account and discover your music insights with beautiful analytics
            </p>
          </div>
          
          {/* Google Login Button */}
          <div className="mb-6">
            <GoogleLoginButton />
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="fade-in" style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.3)', 
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          {/* Features Preview */}
          <div className="mt-8 pt-6" style={{
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '50%',
                margin: '0 auto 0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.25rem' }}>📊</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Analytics</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                margin: '0 auto 0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.25rem' }}>🎯</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Insights</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '50%',
                margin: '0 auto 0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.25rem' }}>🎵</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Music</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
