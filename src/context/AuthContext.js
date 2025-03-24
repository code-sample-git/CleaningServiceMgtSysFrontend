import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import config from '../config/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem(config.TOKEN_KEY);
    if (token) {
      // Validate token and get user data
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}${config.AUTH_ENDPOINTS.VALIDATE}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem(config.TOKEN_KEY);
      localStorage.removeItem(config.REFRESH_TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}${config.AUTH_ENDPOINTS.LOGIN}`, {
        email,
        password
      });
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem(config.TOKEN_KEY, accessToken);
      localStorage.setItem(config.REFRESH_TOKEN_KEY, refreshToken);
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(config.TOKEN_KEY);
    localStorage.removeItem(config.REFRESH_TOKEN_KEY);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 