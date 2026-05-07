const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

pool.query(sql)
  .then(() => { console.log('Schema created successfully.'); process.exit(0); })
  .catch((err) => { console.error('Migration failed:', err.message); process.exit(1); });
