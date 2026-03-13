const pool = require("../pool");

// Create a new message
async function createMessage({ userId, title, text }) {
  const result = await pool.query(
    `INSERT INTO messages (user_id, title, text)
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, title, text]
  );
  return result.rows[0];
}

// Get messages for non-members (no author)
async function getMessagesForNonMembers() {
  const result = await pool.query(
    `SELECT id, title, text, created_at
     FROM messages
     ORDER BY created_at DESC`
  );
  return result.rows;
}

// Get messages for members (with author)
async function getMessagesForMembers() {
  const result = await pool.query(
    `SELECT m.id, m.title, m.text, m.created_at,
            u.first_name || ' ' || u.last_name AS author
     FROM messages m
     JOIN users u ON m.user_id = u.id
     ORDER BY m.created_at DESC`
  );
  return result.rows;
}

// Delete a message by ID
async function deleteMessage(id) {
  await pool.query(`DELETE FROM messages WHERE id = $1`, [id]);
}

module.exports = {
  createMessage,
  getMessagesForNonMembers,
  getMessagesForMembers,
  deleteMessage
};