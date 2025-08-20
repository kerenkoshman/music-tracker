import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { authAPI } from './services/api';
import LoginPage from './components/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './index.css';

function App() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          setLoading(true);
          const user = await authAPI.getProfile();
          setUser(user);
        } catch (error) {
          console.error('Failed to get user profile:', error);
          localStorage.removeItem('authToken');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
