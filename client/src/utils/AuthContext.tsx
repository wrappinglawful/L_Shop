import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Basket } from '../types/index';
import api from '../api';

interface AuthContextType {
  user: User | null;
  basket: Basket | null;
  login: (userData: User) => void;
  logout: () => void;
  refreshBasket: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [basket, setBasket] = useState<Basket | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshBasket = useCallback(async () => {
    try {
      const res = await api.get('/basket');
      setBasket(res.data);
    } catch (err) {
      setBasket(null);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get('/me');
      setUser(res.data);
      await refreshBasket();
    } catch (err) {
      setUser(null);
      setBasket(null);
    } finally {
      setLoading(false);
    }
  }, [refreshBasket]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((userData: User) => {
    setUser(userData);
    refreshBasket();
  }, [refreshBasket]);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } finally {
      setUser(null);
      setBasket(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, basket, login, logout, refreshBasket, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
