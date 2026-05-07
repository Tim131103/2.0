const express  = require('express');
const { query } = require('../db');
const verify   = require('../middleware/auth');

const router = express.Router();

const SHOP_POINTS = { bakery: 40, temple: 30, indigo: 80, tea: 50 };

// POST /api/checkins
router.post('/', verify, async (req, res) => {
  const { shopId } = req.body;
  const userId = req.user.id;

  if (!SHOP_POINTS[shopId]) return res.status(400).json({ error: 'Invalid shopId' });

  const pts = SHOP_POINTS[shopId];

  try {
    await query(
      'INSERT INTO checkins (user_id, shop_id, points_awarded) VALUES ($1, $2, $3)',
      [userId, shopId, pts]
    );
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Already checked in to this shop' });
    throw err;
  }

  const result = await query(
    'UPDATE users SET points = points + $1 WHERE id = $2 RETURNING points',
    [pts, userId]
  );

  res.status(201).json({ shopId, pointsAwarded: pts, totalPoints: result.rows[0].points });
});

module.exports = router;
