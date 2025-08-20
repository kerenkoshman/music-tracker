import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 
              className="text-xl font-bold cursor-pointer" 
              style={{ color: '#ea580c' }}
              onClick={() => navigate('/dashboard')}
            >
              Music Tracker
            </h1>
            <nav className="flex gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                style={{ 
                  color: '#374151',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ea580c'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/profile')}
                style={{ 
                  color: '#374151',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ea580c'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Profile
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <img 
                  src={user.picture} 
                  alt={user.name}
                  style={{ 
                    width: '2rem', 
                    height: '2rem', 
                    borderRadius: '50%' 
                  }}
                />
                <span style={{ color: '#374151', fontWeight: '500' }}>{user.name}</span>
              </div>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
