// src/context/AuthContext.tsx
// Global authentication state management

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';
import { authAPI } from '@/services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('portfolio_token'),
    isAuthenticated: false,
    isLoading: true,
  });

  // On mount, verify token with backend
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('portfolio_token');
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      try {
        const res = await authAPI.getMe();
        setState({
          user: res.data.user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('portfolio_token');
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    };
    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    const { token, user } = res.data;
    localStorage.setItem('portfolio_token', token);
    setState({ user, token, isAuthenticated: true, isLoading: false });
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    localStorage.removeItem('portfolio_token');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
