// Import express and cors libraries
const express = require('express');
const cors = require('cors');

// Import our database connection
const db = require('./db');

// Create the express app
const app = express();

// Allow the frontend to talk to this backend (CORS enabled for all origins)
app.use(cors());

// Allow the server to read JSON from requests
app.use(express.json());

// Health check endpoint (useful for Kubernetes probes and CI/CD checks)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'notes-backend' });
});

// Route: Get all notes from the database
app.get('/api/notes', (req, res) => {
  const notes = db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all();
  res.json(notes);
});

// Route: Create a new note
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;

  // Check that title and content are not empty
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  // Insert the note into the database
  const result = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)').run(title, content);

  // Fetch the newly created note and return it
  const newNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newNote);
});

// Route: Update an existing note
app.put('/api/notes/:id', (req, res) => {
  const { title, content } = req.body;

  // Update the note in the database
  const result = db.prepare('UPDATE notes SET title = ?, content = ? WHERE id = ?')
    .run(title, content, req.params.id);

  // If no row was changed, the note was not found
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Note not found' });
  }

  // Return the updated note
  const updated = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// Route: Delete a note
app.delete('/api/notes/:id', (req, res) => {
  // Delete the note from the database
  const result = db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);

  // If no row was deleted, the note was not found
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Note not found' });
  }

  res.json({ message: 'Note deleted' });
});

// Read PORT from env (useful for Docker/K8s), default to 5000
const PORT = process.env.PORT || 5000;

// Start the server on all interfaces so Docker/K8s can reach it
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
