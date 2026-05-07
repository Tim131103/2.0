import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export function useAuth() {
  const [token, setToken]   = useState(() => localStorage.getItem('token'));
  const [user,  setUser]    = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.me(token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback(async (email, password) => {
    const { token: t, user: u } = await api.login(email, password);
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (email, password) => {
    const { token: t, user: u } = await api.register(email, password);
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  return { token, user, setUser, loading, login, register, logout };
}
