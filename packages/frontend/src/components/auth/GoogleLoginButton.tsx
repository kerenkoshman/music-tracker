import React, { useEffect, useCallback } from 'react';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../services/api';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GoogleLoginButton: React.FC = () => {
  const { setLoading, setError, setUser } = useAuthStore();

  const handleCredentialResponse = useCallback(async (response: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authAPI.login(response.credential);
      
      // Store the token
      localStorage.setItem('authToken', result.token);
      
      // Update the store
      setUser(result.user);
      
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);

  useEffect(() => {
    // Initialize Google Identity Services
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the button
      const buttonElement = document.getElementById('google-login-button');
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        });
      }
    }
  }, [handleCredentialResponse]);

  return (
    <div className="w-full">
      <div id="google-login-button" className="w-full"></div>
    </div>
  );
};

export default GoogleLoginButton;
