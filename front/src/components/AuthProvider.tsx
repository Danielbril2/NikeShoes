// src/components/AuthProvider.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../API/AuthContext';
import { AuthAPI } from '../API/authAPI';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check token validity on initial load
  useEffect(() => {
    const verifyStoredToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const isValid = await AuthAPI.verifyToken(storedToken);
          if (isValid) {
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('token');
            setToken(null);
            setIsAuthenticated(false);
          }
        } catch (err) {
          // In case of error, reset auth state
          localStorage.removeItem('token');
          setToken(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    verifyStoredToken();
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    AuthAPI.getToken(); // Make sure the API also has the token
  };

  const logout = () => {
    AuthAPI.logout(); // Clear token from API
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (isLoading) {
    // You could show a loading indicator here
    return null;
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};