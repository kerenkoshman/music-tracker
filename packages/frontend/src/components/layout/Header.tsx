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
            <h1 className="text-xl font-bold text-orange-600 cursor-pointer" onClick={() => navigate('/dashboard')}>
              Music Tracker
            </h1>
            <nav className="flex gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="text-gray-700 hover:text-orange-600 transition-colors"
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
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700 font-medium">{user.name}</span>
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
