// Import React hooks
import { useEffect, useState } from 'react';
import './App.css';

// Use relative URL so Nginx can proxy it to the backend automatically
const API = '/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [expandedNoteId, setExpandedNoteId] = useState(null); 
  
  // States for custom delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // Fetch notes from backend
  const fetchNotes = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add or update note
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API}/${editingId}` : API;

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      
      setTitle('');
      setContent('');
      setEditingId(null);
      fetchNotes(); 
    } catch (err) {
      console.error('Failed to save note:', err);
      alert('Backend se connect nahi ho raha! Check API URL.');
    }
  };

  // Open custom delete modal
  const confirmDelete = (e, id) => {
    e.stopPropagation(); 
    setNoteToDelete(id);
    setShowDeleteModal(true);
  };

  // Actual delete function after confirmation
  const handleDelete = async () => {
    if (!noteToDelete) return;
    try {
      await fetch(`${API}/${noteToDelete}`, { method: 'DELETE' });
      fetchNotes();
    } catch(err) {
      console.error(err);
    }
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  // Edit note
  const handleEdit = (e, note) => {
    e.stopPropagation(); 
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    window.scrollTo(0, 0); 
  };

  return (
    <div className="app">
      <h1>📝 My Notes</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="note-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          style={{ resize: 'none' }}
        />
        <div className="buttons">
          <button type="submit">{editingId ? 'Update Note' : 'Add Note'}</button>
          {editingId && (
            <button type="button" onClick={() => { setTitle(''); setContent(''); setEditingId(null); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Notes List */}
      <div className="notes-list">
        {notes.length === 0 && <p className="empty">No notes yet. Add one above! ✨</p>}

        {notes.map((note) => (
          <div 
            key={note.id} 
            className={`note-card ${expandedNoteId === note.id ? 'expanded' : ''}`}
            onClick={() => setExpandedNoteId(expandedNoteId === note.id ? null : note.id)}
          >
            <div className="note-header">
              <h3>{note.title}</h3>
              <span className="arrow">{expandedNoteId === note.id ? '▲' : '▼'}</span>
            </div>
            
            {expandedNoteId === note.id && (
              <div className="note-content">
                <p>{note.content}</p>
                <small>{new Date(note.created_at).toLocaleString()}</small>
                <div className="note-actions">
                  <button onClick={(e) => handleEdit(e, note)}>✏️ Edit</button>
                  <button onClick={(e) => confirmDelete(e, note.id)}>🗑️ Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h2>Are you sure?</h2>
            <p>Do you really want to delete this note? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-delete" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
