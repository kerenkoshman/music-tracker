import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1rem 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h1 
              style={{ 
                fontSize: '1.5rem', 
                fontWeight: '800',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                transition: 'all 0.3s ease'
              }}
              onClick={() => navigate('/dashboard')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              🎵 Music Tracker
            </h1>
            
            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <button 
                onClick={() => navigate('/dashboard')}
                style={{ 
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f59e0b';
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#374151';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Dashboard
              </button>
              
              <button 
                onClick={() => navigate('/profile')}
                style={{ 
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f59e0b';
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#374151';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Profile
              </button>
            </nav>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <img 
                  src={user.picture} 
                  alt={user.name}
                  style={{ 
                    width: '2.5rem', 
                    height: '2.5rem', 
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <div>
                  <span style={{ 
                    color: '#1f2937', 
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    display: 'block'
                  }}>
                    {user.name}
                  </span>
                  <span style={{ 
                    color: '#6b7280',
                    fontSize: '0.75rem'
                  }}>
                    {user.email}
                  </span>
                </div>
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              style={{
                borderColor: '#f59e0b',
                color: '#f59e0b',
                fontWeight: '600'
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
