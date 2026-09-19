import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, role: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sentinelx_token'));
  const [role, setRole] = useState<'ADMIN' | 'ANALYST' | 'VIEWER' | null>(
    (localStorage.getItem('sentinelx_role') as any) || null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('sentinelx_token');
      if (storedToken) {
        try {
          const res = await api.get('/api/auth/me');
          setUser(res.data);
          setRole(res.data.role);
          localStorage.setItem('sentinelx_role', res.data.role);
        } catch (err) {
          // Token expired or invalid
          localStorage.removeItem('sentinelx_token');
          localStorage.removeItem('sentinelx_role');
          setUser(null);
          setToken(null);
          setRole(null);
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = (newToken: string, newRole: string, username: string) => {
    localStorage.setItem('sentinelx_token', newToken);
    localStorage.setItem('sentinelx_role', newRole);
    setToken(newToken);
    setRole(newRole as any);
    setUser({
      id: 1,
      username,
      email: `${username}@sentinelx.ai`,
      role: newRole as any,
      created_at: new Date().toISOString()
    });
  };

  const logout = () => {
    localStorage.removeItem('sentinelx_token');
    localStorage.removeItem('sentinelx_role');
    setToken(null);
    setUser(null);
    setRole(null);
    try {
      api.post('/api/auth/logout').catch(() => {});
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout
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
