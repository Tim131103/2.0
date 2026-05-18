// api/__mocks__/db.js
// Jest manual mock — placed next to db.js so jest.mock('../db') picks it up automatically.
const query = jest.fn().mockResolvedValue({ rows: [], rowCount: 0 });
const pool  = { query, end: jest.fn() };
module.exports = { pool, query };
