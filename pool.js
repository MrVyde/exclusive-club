const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

// Set the schema for this pool connection, This ensures every new connection automatically uses the clubhouse schema.
pool.on('connect', async (client) => {
  await client.query(`SET search_path TO clubhouse, public`);
  console.log('Schema search_path set for new connection');
});
  
module.exports = pool;