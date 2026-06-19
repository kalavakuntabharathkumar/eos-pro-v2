import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

interface User { id: number; email: string; full_name: string; role: string; department_id?: number; }
interface AuthContextValue {
  user: User | null; token: string | null; isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void; isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get<User>('/api/auth/me')
        .then(r => setUser(r.data))
        .catch(() => { setToken(null); localStorage.removeItem('access_token'); });
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    const form = new URLSearchParams({ username: email, password });
    const { data } = await axios.post('/api/auth/login', form);
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
    setToken(data.access_token);
    const me = await axios.get<User>('/api/auth/me');
    setUser(me.data);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null); setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
