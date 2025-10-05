'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { deriveKey } from '@/lib/crypto';
import Cookies from 'js-cookie'

interface AuthContextType {
  isAuthenticated: boolean;
  encryptionKey: string | null;
  login: (password: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);

  const login = (password: string, email: string) => {
    const key = deriveKey(password, email);
    setEncryptionKey(key);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('token');
    setEncryptionKey(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, encryptionKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};