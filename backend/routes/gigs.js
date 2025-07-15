const express = require('express');
const router = express.Router();
const data = require('../data');
const { v4: uuidv4 } = require('uuid');
const logData = data.logData;

// Get all gigs
router.get('/', (req, res) => {
  res.json(data.gigs);
});

// Get a single gig
router.get('/:id', (req, res) => {
  const gig = data.gigs.find(g => g.id === req.params.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  res.json(gig);
});

// Create a new gig
router.post('/', (req, res) => {
  const { title, clientId, talentId, status, updates } = req.body;
  const newGig = { id: uuidv4(), title, clientId, talentId, status, updates: updates || [] };
  data.gigs.push(newGig);
  logData();
  res.status(201).json(newGig);
});

// Update a gig
router.put('/:id', (req, res) => {
  const gig = data.gigs.find(g => g.id === req.params.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  const { title, clientId, talentId, status, updates } = req.body;
  gig.title = title;
  gig.clientId = clientId;
  gig.talentId = talentId;
  gig.status = status;
  if (updates) gig.updates = updates;
  logData();
  res.json(gig);
});

// Delete a gig
router.delete('/:id', (req, res) => {
  const idx = data.gigs.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Gig not found' });
  data.gigs.splice(idx, 1);
  logData();
  res.status(204).end();
});

// Add an update/note to a gig
router.post('/:id/updates', (req, res) => {
  const gig = data.gigs.find(g => g.id === req.params.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  const { note, type, created_by, timestamp } = req.body;
  const newUpdate = { note, type, created_by, timestamp };
  gig.updates.push(newUpdate);
  logData();
  res.status(201).json(newUpdate);
});

module.exports = router; 