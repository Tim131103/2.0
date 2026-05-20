import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';

/**
 * Custom hook for authentication state management.
 * Persists token to localStorage and validates it on mount.
 */
export function useAuth() {
  // Restore token from localStorage if available
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  // Set loading if we have a stored token to validate
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  // Validate token and fetch user data on token change
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.me(token)
      .then(setUser)
      .catch(() => {
        // Clear invalid token
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
