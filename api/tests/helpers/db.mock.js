// tests/helpers/db.mock.js
// Replaces the real pg pool with an in-memory mock for integration tests.
// Call mockQuery(rows) before any test that triggers a DB call.

const pendingRows = [];

const pool = {
  query: jest.fn(async (sql, params) => {
    if (pendingRows.length > 0) {
      return { rows: pendingRows.shift(), rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }),
  end: jest.fn(),
};

// Expose a helper to pre-load response rows in order
function mockQuery(...rowSets) {
  rowSets.forEach((rows) => pendingRows.push(rows));
}

function clearMocks() {
  pendingRows.length = 0;
  pool.query.mockClear();
}

jest.mock('../../db', () => ({ pool, query: pool.query }));

module.exports = { pool, mockQuery, clearMocks };
