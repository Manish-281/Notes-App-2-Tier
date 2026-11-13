// Import the SQLite database library
const Database = require('better-sqlite3');

// Use DB_PATH env variable if set (useful for Docker volumes), else default
const dbPath = process.env.DB_PATH || './notes.db';

// Create or open the database file
const db = new Database(dbPath);

// Create the notes table if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Export the database so other files can use it
module.exports = db;
