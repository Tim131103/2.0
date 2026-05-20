const BASE = import.meta.env.VITE_API_URL ?? '';

/**
 * Generic HTTP request handler with JWT authentication support.
 * Throws on HTTP error status codes.
 */
async function request(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  // Attach JWT token if provided
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Request failed');
  return data;
}

export const api = {
  register: (email, password) => request('POST', '/api/auth/register', { email, password }),
  login: (email, password) => request('POST', '/api/auth/login', { email, password }),
  me: (token) => request('GET', '/api/user/me', null, token),
  checkIn: (shopId, token) => request('POST', '/api/checkins', { shopId }, token),
  redeem: (tierName, token) => request('POST', '/api/rewards/redeem', { tierName }, token),
  redeemHistory: (token) => request('GET', '/api/rewards/history', null, token),
  migrate: (localPoints, localCheckins, token) =>
    request('POST', '/api/user/migrate', { localPoints, localCheckins }, token),
};
