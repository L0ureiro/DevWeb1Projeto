const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

async function getUserByEmail(email) {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const user = await db.get(sql, [email]);
  return user;
}

async function getUserById(id) {
  const sql = 'SELECT * FROM users WHERE id = ?';
  const user = await db.get(sql, [id]);
  return user;
}

module.exports = { db, getUserByEmail, getUserById };
