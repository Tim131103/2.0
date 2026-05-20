const express  = require('express');
const { query } = require('../db');
const verify   = require('../middleware/auth');

const router = express.Router();

const REWARDS = {
  Explorer:      { requiredPts: 0,   cost: 0  },
  Wanderer:      { requiredPts: 200, cost: 50 },
  'Local Legend':{ requiredPts: 500, cost: 100 },
};

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SANXIA-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// POST /api/rewards/redeem
router.post('/redeem', verify, async (req, res) => { //Refactoring dieser funktion nötig für ISO 25010:Wartbarkeit
  const { tierName } = req.body;
  const reward = REWARDS[tierName];
  if (!reward) return res.status(400).json({ error: 'Unknown tier' });

  const userId = req.user.id;
  const userResult = await query('SELECT points FROM users WHERE id = $1', [userId]);
  const currentPts = userResult.rows[0].points;

  if (currentPts < reward.requiredPts) { //outsourcen der Geschäftslogik in RewardService.js
    return res.status(400).json({ error: 'Not enough points to redeem this reward' });
  }

  const code = randomCode();
  await query(
    'INSERT INTO redemptions (user_id, reward_code, tier_name, points_spent) VALUES ($1, $2, $3, $4)',
    [userId, code, tierName, reward.cost]
  );

  let remainingPoints = currentPts;
  if (reward.cost > 0) {
    const updated = await query(
      'UPDATE users SET points = points - $1 WHERE id = $2 RETURNING points', //fehlendes Begin
      [reward.cost, userId] //fehlendes Rollback
    );
    remainingPoints = updated.rows[0].points;
  }

  res.status(201).json({ rewardCode: code, tierName, pointsSpent: reward.cost, remainingPoints });
});

// GET /api/rewards/history
router.get('/history', verify, async (req, res) => {
  const result = await query(
    'SELECT reward_code, tier_name, points_spent, redeemed_at FROM redemptions WHERE user_id = $1 ORDER BY redeemed_at DESC', //fehlendes Rollback
    [req.user.id]
  );
  res.json(result.rows.map(r => ({
    rewardCode:  r.reward_code,
    tierName:    r.tier_name,
    pointsSpent: r.points_spent,
    redeemedAt:  r.redeemed_at,
  })));
});

module.exports = router;
