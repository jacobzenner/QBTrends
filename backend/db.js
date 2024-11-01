const { Pool } = require('pg');

// Create a new PostgreSQL pool using environment variables
const pool = new Pool({
  user: "admin",
  host: "postgres",
  database: "quarterback_stats",
  password: "admin",
  port: 5432,
});

// Function to test the database connection
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected successfully at:', res.rows[0].now);
  } catch (err) {
    console.error('Database connection error:', err.stack);
    throw err;
  }
};

// Export the pool and testConnection function
module.exports = {
  query: (text, params) => pool.query(text, params),
  testConnection,  // Ensure testConnection is part of the exports
};
