/**
 * Integration tests — Rewards routes
 * POST /api/rewards/redeem
 * GET  /api/rewards/history
 */

process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV   = 'test';

jest.mock('../db');

const request = require('supertest');
const jwt     = require('jsonwebtoken');
const app     = require('../app');
const db      = require('../db');

const validToken = jwt.sign({ id: 1, email: 'user@sanxia.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });
const auth = `Bearer ${validToken}`;

beforeEach(() => db.query.mockClear());

// ─── POST /api/rewards/redeem ─────────────────────────────────────────────────

describe('POST /api/rewards/redeem', () => {
  it('redeems Explorer tier (free, no points deducted)', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ points: 0 }] });   // SELECT points
    db.query.mockResolvedValueOnce({ rows: [] });                 // INSERT redemptions

    const res = await request(app)
      .post('/api/rewards/redeem')
      .set('Authorization', auth)
      .send({ tierName: 'Explorer' });

    expect(res.status).toBe(201);
    expect(res.body.tierName).toBe('Explorer');
    expect(res.body.pointsSpent).toBe(0);
    expect(res.body.rewardCode).toMatch(/^SANXIA-/);
    expect(res.body.remainingPoints).toBe(0);
  });

  it('redeems Wanderer tier (costs 50 points)', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ points: 250 }] }); // SELECT points
    db.query.mockResolvedValueOnce({ rows: [] });                 // INSERT redemptions
    db.query.mockResolvedValueOnce({ rows: [{ points: 200 }] }); // UPDATE RETURNING

    const res = await request(app)
      .post('/api/rewards/redeem')
      .set('Authorization', auth)
      .send({ tierName: 'Wanderer' });

    expect(res.status).toBe(201);
    expect(res.body.pointsSpent).toBe(50);
    expect(res.body.remainingPoints).toBe(200);
    expect(res.body.rewardCode).toMatch(/^SANXIA-[A-Z0-9]{6}$/);
  });

  it('redeems Local Legend tier (costs 100 points)', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ points: 600 }] });
    db.query.mockResolvedValueOnce({ rows: [] });
    db.query.mockResolvedValueOnce({ rows: [{ points: 500 }] });

    const res = await request(app)
      .post('/api/rewards/redeem')
      .set('Authorization', auth)
      .send({ tierName: 'Local Legend' });

    expect(res.status).toBe(201);
    expect(res.body.pointsSpent).toBe(100);
    expect(res.body.remainingPoints).toBe(500);
  });

  it('returns 400 when user has insufficient points for Wanderer', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ points: 50 }] }); // only 50, needs 200

    const res = await request(app)
      .post('/api/rewards/redeem')
      .set('Authorization', auth)
      .send({ tierName: 'Wanderer' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/not enough points/i);
  });

  it('returns 400 for an unknown tier name', async () => {
    const res = await request(app)
      .post('/api/rewards/redeem')
      .set('Authorization', auth)
      .send({ tierName: 'Diamond King' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/unknown tier/i);
  });

  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post('/api/rewards/redeem')
      .send({ tierName: 'Explorer' });

    expect(res.status).toBe(401);
  });
});

// ─── GET /api/rewards/history ─────────────────────────────────────────────────

describe('GET /api/rewards/history', () => {
  it('returns an empty array when no rewards have been redeemed', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .get('/api/rewards/history')
      .set('Authorization', auth);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns redemption history in correct shape', async () => {
    const now = new Date().toISOString();
    db.query.mockResolvedValueOnce({ rows: [
      { reward_code: 'SANXIA-ABC123', tier_name: 'Wanderer', points_spent: 50, redeemed_at: now },
    ] });

    const res = await request(app)
      .get('/api/rewards/history')
      .set('Authorization', auth);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({
      rewardCode:  'SANXIA-ABC123',
      tierName:    'Wanderer',
      pointsSpent: 50,
    });
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/rewards/history');
    expect(res.status).toBe(401);
  });
});
