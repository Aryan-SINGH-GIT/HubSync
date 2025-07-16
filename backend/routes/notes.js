const express = require('express');
const router = express.Router();
const data = require('../data');
const { v4: uuidv4 } = require('uuid');
const logData = data.logData;

// Get all notes
router.get('/', (req, res) => {
  res.json(data.notes);
});

// Get notes for a specific profile
router.get('/profile/:profileType/:profileId', (req, res) => {
  const { profileType, profileId } = req.params;
  const notes = data.notes.filter(
    n => n.profileType === profileType && n.profileId === profileId
  );
  res.json(notes);
});

// Get a single note
router.get('/:id', (req, res) => {
  const note = data.notes.find(n => n.id === req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// Create a new note
router.post('/', (req, res) => {
  let { profileType, profileId, note, type, created_by, timestamp } = req.body;
  if (!timestamp) timestamp = new Date().toISOString();
  const newNote = { id: uuidv4(), profileType, profileId, note, type, created_by, timestamp };
  data.notes.push(newNote);
  logData();
  res.status(201).json(newNote);
});

// Update a note
router.put('/:id', (req, res) => {
  const note = data.notes.find(n => n.id === req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  let { profileType, profileId, note: noteText, type, created_by, timestamp } = req.body;
  if (!timestamp) timestamp = new Date().toISOString();
  note.profileType = profileType;
  note.profileId = profileId;
  note.note = noteText;
  note.type = type;
  note.created_by = created_by;
  note.timestamp = timestamp;
  logData();
  res.json(note);
});

// Delete a note
router.delete('/:id', (req, res) => {
  const idx = data.notes.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });
  data.notes.splice(idx, 1);
  logData();
  res.status(204).end();
});

module.exports = router; 