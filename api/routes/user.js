const express  = require('express');
const { query } = require('../db');
const verify   = require('../middleware/auth');

const router = express.Router();

const SHOP_POINTS = { bakery: 40, temple: 30, indigo: 80, tea: 50 };

async function getUserWithCheckins(userId) {
  const u = await query('SELECT id, email, points FROM users WHERE id = $1', [userId]);
  const c = await query('SELECT shop_id FROM checkins WHERE user_id = $1', [userId]);
  return { ...u.rows[0], checkins: c.rows.map(r => r.shop_id) };
}

// GET /api/user/me
router.get('/me', verify, async (req, res) => {
  const user = await getUserWithCheckins(req.user.id);
  if (!user.id) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST /api/user/migrate — import localStorage data on first login
router.post('/migrate', verify, async (req, res) => {
  const { localPoints, localCheckins } = req.body;
  const userId = req.user.id;

  const existing = await getUserWithCheckins(userId);
  if (existing.points > 0 || existing.checkins.length > 0) {
    return res.status(409).json({ error: 'Account already has data, migration skipped' });
  }

  const validCheckins = (localCheckins || []).filter(id => SHOP_POINTS[id]);
  const maxPossible   = validCheckins.reduce((sum, id) => sum + SHOP_POINTS[id], 0);
  const pts           = Math.min(parseInt(localPoints, 10) || 0, maxPossible);

  await query('UPDATE users SET points = $1 WHERE id = $2', [pts, userId]);
  for (const shopId of validCheckins) {
    await query(
      'INSERT INTO checkins (user_id, shop_id, points_awarded) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [userId, shopId, SHOP_POINTS[shopId]]
    );
  }

  res.json({ points: pts, checkins: validCheckins });
});

module.exports = router;
