require('dotenv').config();
const fs      = require('fs');
const path    = require('path');
const { pool } = require('./db');
const app     = require('./app');

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('DB schema ready.');
}

const PORT = process.env.PORT || 3001;
migrate()
  .then(() => app.listen(PORT, () => console.log(`API running on port ${PORT}`)))
  .catch((err) => { console.error('Startup failed:', err.message); process.exit(1); });
