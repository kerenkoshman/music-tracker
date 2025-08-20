import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuthStore } from '../store/authStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, error } = useAuthStore();
  const [isGoogleLogin, setIsGoogleLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement email/password login API call
      console.log('Email login:', { email, password });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just show success message
      alert('Email login functionality coming soon!');
      
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

          {/* Authentication Toggle */}
          <div className="mb-6">
            <div style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '12px',
              padding: '0.25rem',
              maxWidth: '20rem',
              margin: '0 auto'
            }}>
              <button
                onClick={() => setIsGoogleLogin(true)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: isGoogleLogin ? 'white' : 'transparent',
                  color: isGoogleLogin ? '#1f2937' : '#6b7280',
                  fontWeight: isGoogleLogin ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isGoogleLogin ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                🔐 Google
              </button>
              <button
                onClick={() => setIsGoogleLogin(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: !isGoogleLogin ? 'white' : 'transparent',
                  color: !isGoogleLogin ? '#1f2937' : '#6b7280',
                  fontWeight: !isGoogleLogin ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: !isGoogleLogin ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                📧 Email
              </button>
            </div>
          </div>
          
          {/* Google Login */}
          {isGoogleLogin && (
            <div className="mb-6">
              <GoogleLoginButton />
            </div>
          )}

          {/* Email Login Form */}
          {!isGoogleLogin && (
            <form onSubmit={handleEmailLogin} className="mb-6">
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.9)',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#f59e0b';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.9)',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#f59e0b';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isLoading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isLoading && (
                  <span className="spinner" style={{ 
                    width: '1rem', 
                    height: '1rem' 
                  }}></span>
                )}
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="mb-6" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'rgba(0, 0, 0, 0.1)'
            }}></div>
            <span style={{
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              or
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'rgba(0, 0, 0, 0.1)'
            }}></div>
          </div>

          {/* Sign Up Link */}
          <div className="mb-6">
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              Don't have an account?
            </p>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#f59e0b',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textDecoration: 'underline',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#d97706'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#f59e0b'}
            >
              Create an account
            </button>
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
