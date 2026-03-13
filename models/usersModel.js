const pool = require("../pool");
const bcrypt = require('bcrypt');

// Create a new user
async function createUser({ firstName, lastName, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password_hash)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [firstName, lastName, email, passwordHash]
  );
  return result.rows[0];
}

// Find a user by email (for login)
async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

// Update membership status
async function updateMembership(userId, isMember) {
  await pool.query(
    `UPDATE users SET is_member = $1 WHERE id = $2`,
    [isMember, userId]
  );
}

// Update admin status
async function updateAdmin(userId, isAdmin) {
  await pool.query(
    `UPDATE users SET is_admin = $1 WHERE id = $2`,
    [isAdmin, userId]
  );
}

module.exports = {
  createUser,
  findUserByEmail,
  updateMembership,
  updateAdmin
};