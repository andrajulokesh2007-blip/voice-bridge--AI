import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('voicebridge_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('voicebridge_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate or restore session on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const savedToken = localStorage.getItem('voicebridge_token');
      if (!savedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('voicebridge_user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err?.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('voicebridge_token', receivedToken);
    localStorage.setItem('voicebridge_user', JSON.stringify(receivedUser));
    return receivedUser;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token: receivedToken, user: receivedUser } = res.data;
    
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('voicebridge_token', receivedToken);
    localStorage.setItem('voicebridge_user', JSON.stringify(receivedUser));
    return receivedUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('voicebridge_token');
    localStorage.removeItem('voicebridge_user');
  };

  const updatePreferences = async (newPreferences) => {
    const res = await api.patch('/settings', newPreferences);
    const updated = res.data.settings;
    setUser((prev) => {
      const merged = { ...prev, ...updated };
      localStorage.setItem('voicebridge_user', JSON.stringify(merged));
      return merged;
    });
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updatePreferences,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
