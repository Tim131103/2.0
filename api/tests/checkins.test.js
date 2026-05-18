/**
 * Integration tests — Check-in route
 * POST /api/checkins
 *
 * Requires a valid JWT in the Authorization header.
 */

process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV   = 'test';

jest.mock('../db');

const request = require('supertest');
const jwt     = require('jsonwebtoken');
const app     = require('../app');
const db      = require('../db');

const validToken = jwt.sign({ id: 1, email: 'user@sanxia.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });
const authHeader = `Bearer ${validToken}`;

beforeEach(() => db.query.mockClear());

// ─── POST /api/checkins ───────────────────────────────────────────────────────

describe('POST /api/checkins', () => {
  it('returns 201 with points awarded on valid check-in', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });            // INSERT INTO checkins
    db.query.mockResolvedValueOnce({ rows: [{ points: 40 }] }); // UPDATE users RETURNING

    const res = await request(app)
      .post('/api/checkins')
      .set('Authorization', authHeader)
      .send({ shopId: 'bakery' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      shopId: 'bakery',
      pointsAwarded: 40,
      totalPoints: 40,
    });
  });

  it('awards the correct points per shop', async () => {
    const cases = [
      { shopId: 'bakery', expected: 40 },
      { shopId: 'temple', expected: 30 },
      { shopId: 'indigo', expected: 80 },
      { shopId: 'tea',    expected: 50 },
    ];

    for (const { shopId, expected } of cases) {
      db.query.mockClear();
      db.query.mockResolvedValueOnce({ rows: [] });
      db.query.mockResolvedValueOnce({ rows: [{ points: expected }] });

      const res = await request(app)
        .post('/api/checkins')
        .set('Authorization', authHeader)
        .send({ shopId });

      expect(res.status).toBe(201);
      expect(res.body.pointsAwarded).toBe(expected);
    }
  });

  it('returns 400 for an unknown shopId', async () => {
    const res = await request(app)
      .post('/api/checkins')
      .set('Authorization', authHeader)
      .send({ shopId: 'nonexistent-shop' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid shopId/i);
  });

  it('returns 409 when the user already checked in to that shop', async () => {
    db.query.mockRejectedValueOnce(Object.assign(new Error('duplicate'), { code: '23505' }));

    const res = await request(app)
      .post('/api/checkins')
      .set('Authorization', authHeader)
      .send({ shopId: 'bakery' });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already checked in/i);
  });

  it('returns 401 without an Authorization header', async () => {
    const res = await request(app)
      .post('/api/checkins')
      .send({ shopId: 'bakery' });

    expect(res.status).toBe(401);
  });

  it('returns 401 with an invalid token', async () => {
    const res = await request(app)
      .post('/api/checkins')
      .set('Authorization', 'Bearer not.a.valid.token')
      .send({ shopId: 'bakery' });

    expect(res.status).toBe(401);
  });
});
