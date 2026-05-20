/**
 * Integration Test: Complete User Journey
 * Tests the full flow: Registration → Check-in → Points Accumulation → Data Retrieval
 */

jest.mock('../db');
jest.mock('bcryptjs');

const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db');
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/user');
const checkinRoutes = require('../routes/checkins');

process.env.JWT_SECRET = 'test-secret';

describe('User Journey Integration Test', () => {
  let app;
  let userToken;
  let userId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/checkins', checkinRoutes);
  });

  it('should complete full user journey: register, check-in to shops, accumulate points', async () => {
    const email = 'traveler@sanxia.tw';
    const password = 'exploreTaiwan2024';

    // Step 1: User registers
    bcrypt.hash.mockResolvedValueOnce('hashedPassword');
    query.mockResolvedValueOnce({
      rows: [{ id: userId, email, points: 0 }],
    });

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ email, password });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty('token');
    expect(registerRes.body.user).toEqual({
      id: userId,
      email,
      points: 0,
      checkins: [],
    });

    userToken = registerRes.body.token;

    // Step 2: Verify user is created (GET /api/user/me)
    query.mockResolvedValueOnce({
      rows: [{ id: userId, email, points: 0 }],
    });
    query.mockResolvedValueOnce({ rows: [] });

    const meRes = await request(app)
      .get('/api/user/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.points).toBe(0);
    expect(meRes.body.checkins).toEqual([]);

    // Step 3: User checks in to Bakery (+40 points)
    // Mock: INSERT into checkins (succeeds)
    query.mockResolvedValueOnce({ rows: [] });
    // Mock: UPDATE users SET points (returns new points)
    query.mockResolvedValueOnce({ rows: [{ points: 40 }] });

    const bakeryRes = await request(app)
      .post('/api/checkins')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ shopId: 'bakery' });

    expect(bakeryRes.status).toBe(201);
    expect(bakeryRes.body).toEqual({
      shopId: 'bakery',
      pointsAwarded: 40,
      totalPoints: 40,
    });

    // Step 4: User checks in to Temple (+30 points)
    // Mock: INSERT into checkins (succeeds)
    query.mockResolvedValueOnce({ rows: [] });
    // Mock: UPDATE users SET points (returns new points)
    query.mockResolvedValueOnce({ rows: [{ points: 70 }] });

    const templeRes = await request(app)
      .post('/api/checkins')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ shopId: 'temple' });

    expect(templeRes.status).toBe(201);
    expect(templeRes.body).toEqual({
      shopId: 'temple',
      pointsAwarded: 30,
      totalPoints: 70,
    });

    // Step 5: User checks in to Indigo (+80 points)
    // Mock: INSERT into checkins (succeeds)
    query.mockResolvedValueOnce({ rows: [] });
    // Mock: UPDATE users SET points (returns new points)
    query.mockResolvedValueOnce({ rows: [{ points: 150 }] });

    const indigoRes = await request(app)
      .post('/api/checkins')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ shopId: 'indigo' });

    expect(indigoRes.status).toBe(201);
    expect(indigoRes.body.totalPoints).toBe(150);

    // Step 6: Verify final user state
    query.mockResolvedValueOnce({
      rows: [{ id: userId, email, points: 150 }],
    });
    query.mockResolvedValueOnce({
      rows: [
        { shop_id: 'bakery' },
        { shop_id: 'temple' },
        { shop_id: 'indigo' },
      ],
    });

    const finalRes = await request(app)
      .get('/api/user/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(finalRes.status).toBe(200);
    expect(finalRes.body).toEqual({
      id: userId,
      email,
      points: 150,
      checkins: ['bakery', 'temple', 'indigo'],
    });
  });
});
