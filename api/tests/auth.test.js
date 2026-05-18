/**
 * Integration tests — Auth routes
 * POST /api/auth/register
 * POST /api/auth/login
 */

process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV   = 'test';

jest.mock('../db');

const request = require('supertest');
const bcrypt  = require('bcryptjs');
const app     = require('../app');
const db      = require('../db');

beforeEach(() => db.query.mockClear());

// ─── Register ────────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('returns 201 with a token and user on valid input', async () => {
    // INSERT INTO users … RETURNING
    db.query.mockResolvedValueOnce({ rows: [{ id: 1, email: 'alice@sanxia.com', points: 0 }] });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'alice@sanxia.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ email: 'alice@sanxia.com', points: 0 });
    expect(res.body.user.checkins).toEqual([]);
  });

  it('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/email/i);
  });

  it('returns 400 when password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'bob@sanxia.com', password: '12' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/6 characters/i);
  });

  it('returns 400 when email is already registered (unique constraint)', async () => {
    db.query.mockRejectedValueOnce(Object.assign(new Error('duplicate'), { code: '23505' }));

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@sanxia.com', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already registered/i);
  });
});

// ─── Login ───────────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  it('returns 200 with token on correct credentials', async () => {
    const hash = await bcrypt.hash('correctpass', 10);
    // SELECT * FROM users
    db.query.mockResolvedValueOnce({ rows: [{ id: 2, email: 'carol@sanxia.com', password_hash: hash, points: 50 }] });
    // userWithCheckins: SELECT id, email, points
    db.query.mockResolvedValueOnce({ rows: [{ id: 2, email: 'carol@sanxia.com', points: 50 }] });
    // userWithCheckins: SELECT shop_id FROM checkins
    db.query.mockResolvedValueOnce({ rows: [{ shop_id: 'bakery' }] });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'carol@sanxia.com', password: 'correctpass' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.checkins).toContain('bakery');
  });

  it('returns 401 when user does not exist', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@sanxia.com', password: 'anypass' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  it('returns 401 when password is wrong', async () => {
    const hash = await bcrypt.hash('realpass', 10);
    db.query.mockResolvedValueOnce({ rows: [{ id: 3, email: 'dave@sanxia.com', password_hash: hash, points: 0 }] });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'dave@sanxia.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'e@sanxia.com' });

    expect(res.status).toBe(400);
  });
});
