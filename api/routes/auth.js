const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { query } = require('../db');

const router = express.Router();

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function userWithCheckins(userId) {
  const u = await query('SELECT id, email, points FROM users WHERE id = $1', [userId]);
  const c = await query('SELECT shop_id FROM checkins WHERE user_id = $1', [userId]);
  return { ...u.rows[0], checkins: c.rows.map(r => r.shop_id) };
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (password.length < 6)  return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, points',
      [email.toLowerCase().trim(), hash]
    );
    const user = { ...result.rows[0], checkins: [] };
    res.status(201).json({ token: makeToken(user), user });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Email already registered' });
    throw err;
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const result = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const fullUser = await userWithCheckins(user.id);
  res.json({ token: makeToken(fullUser), user: fullUser });
});

module.exports = router;
