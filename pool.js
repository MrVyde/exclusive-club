const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

// Set the schema for this pool connection
pool.query('SET search_path TO clubhouse, public')
  .then(() => console.log('Schema search_path set to clubhouse'))
  .catch(err => console.error('Error setting search_path', err));

  
module.exports = pool;