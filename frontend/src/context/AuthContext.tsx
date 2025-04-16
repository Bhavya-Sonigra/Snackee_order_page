import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { checkAuth, setAuth, clearAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  checkAuthentication: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      clearAuth();
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('token');
    } catch {
      clearAuth();
      return null;
    }
  });

  const handleAuthenticationFailure = useCallback(() => {
    clearAuth();
    setUser(null);
    setToken(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  // Check authentication status periodically and on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuthenticated = checkAuth();
      if (!isAuthenticated && (token || user)) {
        handleAuthenticationFailure();
      }
    };

    // Check immediately
    checkAuthStatus();

    // Set up periodic checks every 5 minutes
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [token, user, handleAuthenticationFailure]);

  // Add event listeners for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        const isAuthenticated = checkAuth();
        if (!isAuthenticated) {
          handleAuthenticationFailure();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [handleAuthenticationFailure]);

  const login = useCallback((newToken: string, newUser: User) => {
    try {
      setAuth(newToken, newUser);
      setToken(newToken);
      setUser(newUser);
      navigate('/products', { replace: true });
    } catch (error) {
      console.error('Error during login:', error);
      handleAuthenticationFailure();
    }
  }, [navigate, handleAuthenticationFailure]);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleAuthenticationFailure();
    }
  }, [token, handleAuthenticationFailure]);

  const checkAuthentication = useCallback(() => {
    return checkAuth();
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user && checkAuth(),
    login,
    logout,
    checkAuthentication,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 