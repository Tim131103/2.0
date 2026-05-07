require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');
const { pool } = require('./db');

const authRoutes    = require('./routes/auth');
const userRoutes    = require('./routes/user');
const checkinRoutes = require('./routes/checkins');
const rewardRoutes  = require('./routes/rewards');

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('DB schema ready.');
}

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN
    : true,
}));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth',     authRoutes);
app.use('/api/user',     userRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/rewards',  rewardRoutes);

const PORT = process.env.PORT || 3001;
migrate()
  .then(() => app.listen(PORT, () => console.log(`API running on port ${PORT}`)))
  .catch((err) => { console.error('Startup failed:', err.message); process.exit(1); });
