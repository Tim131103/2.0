CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  points        INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS checkins (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shop_id        TEXT NOT NULL,
  points_awarded INTEGER NOT NULL,
  checked_in_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, shop_id)
);

CREATE TABLE IF NOT EXISTS redemptions (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_code  TEXT NOT NULL,
  tier_name    TEXT NOT NULL,
  points_spent INTEGER NOT NULL,
  redeemed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
