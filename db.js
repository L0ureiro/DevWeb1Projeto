const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
      console.error('Error connecting to SQLite database:', err.message);
    } else {
      console.log('Connected to SQLite database');
    }
  });

module.exports = db