import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';

// ---------------------------------------------------------------------------
// Mock the api module so no real HTTP calls are made
// ---------------------------------------------------------------------------
vi.mock('../api', () => ({
  api: {
    login:    vi.fn(),
    register: vi.fn(),
    me:       vi.fn(),
  },
}));

import { api } from '../api';

// ---------------------------------------------------------------------------
// localStorage mock (jsdom provides a real one — just clear it between tests)
// ---------------------------------------------------------------------------
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
describe('useAuth – initial state', () => {
  it('has no user and is not loading when there is no stored token', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.token).toBeNull();
  });

  it('calls api.me when a token already exists in localStorage', async () => {
    localStorage.setItem('token', 'existing-token');
    api.me.mockResolvedValueOnce({ id: 1, email: 'a@b.com', points: 0, checkins: [] });

    const { result } = renderHook(() => useAuth());

    // loading starts true while the async call resolves
    expect(result.current.loading).toBe(true);

    // wait for the effect to settle
    await act(async () => {});

    expect(api.me).toHaveBeenCalledWith('existing-token');
    expect(result.current.user).toMatchObject({ id: 1, email: 'a@b.com' });
    expect(result.current.loading).toBe(false);
  });

  it('clears the token when api.me rejects (invalid stored token)', async () => {
    localStorage.setItem('token', 'bad-token');
    api.me.mockRejectedValueOnce(new Error('Invalid token'));

    const { result } = renderHook(() => useAuth());
    await act(async () => {});

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
describe('useAuth – login', () => {
  it('stores token in localStorage and sets user on successful login', async () => {
    const fakeUser = { id: 2, email: 'user@sanxia.com', points: 0, checkins: [] };
    api.login.mockResolvedValueOnce({ token: 'jwt-abc', user: fakeUser });
    // useEffect re-runs after token is set — mock api.me for that call
    api.me.mockResolvedValueOnce(fakeUser);

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('user@sanxia.com', 'password123');
    });

    expect(localStorage.getItem('token')).toBe('jwt-abc');
    expect(result.current.token).toBe('jwt-abc');
    expect(result.current.user).toEqual(fakeUser);
  });

  it('throws when api.login rejects', async () => {
    api.login.mockRejectedValueOnce(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth());
    await expect(
      act(async () => { await result.current.login('x@x.com', 'wrong'); })
    ).rejects.toThrow('Invalid credentials');
  });
});

// ---------------------------------------------------------------------------
describe('useAuth – register', () => {
  it('stores token and sets user on successful registration', async () => {
    const fakeUser = { id: 3, email: 'new@sanxia.com', points: 0, checkins: [] };
    api.register.mockResolvedValueOnce({ token: 'jwt-new', user: fakeUser });
    api.me.mockResolvedValueOnce(fakeUser);

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.register('new@sanxia.com', 'securepass');
    });

    expect(localStorage.getItem('token')).toBe('jwt-new');
    expect(result.current.user).toEqual(fakeUser);
  });
});

// ---------------------------------------------------------------------------
describe('useAuth – logout', () => {
  it('clears token and user on logout', async () => {
    const fakeUser = { id: 4, email: 'bye@sanxia.com', points: 10, checkins: [] };
    api.login.mockResolvedValueOnce({ token: 'jwt-bye', user: fakeUser });
    api.me.mockResolvedValueOnce(fakeUser);

    const { result } = renderHook(() => useAuth());
    await act(async () => { await result.current.login('bye@sanxia.com', 'pass'); });

    act(() => { result.current.logout(); });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
