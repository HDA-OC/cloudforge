import { Pool } from 'pg';

// Local development pool
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'cloudforge',
  // Uses local socket auth (no password needed for local user)
});

export default pool;
