// app.js — Express app without listen(), for use in tests and index.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes    = require('./routes/auth');
const userRoutes    = require('./routes/user');
const checkinRoutes = require('./routes/checkins');
const rewardRoutes  = require('./routes/rewards');

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

module.exports = app;
