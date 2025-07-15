const express = require('express');
const router = express.Router();
const data = require('../data');
const { v4: uuidv4 } = require('uuid');
const logData = data.logData;

// Get all talents
router.get('/', (req, res) => {
  res.json(data.talents);
});

// Get a single talent
router.get('/:id', (req, res) => {
  const talent = data.talents.find(t => t.id === req.params.id);
  if (!talent) return res.status(404).json({ error: 'Talent not found' });
  res.json(talent);
});

// Create a new talent
router.post('/', (req, res) => {
  const { name, skills, city } = req.body;
  const newTalent = { id: uuidv4(), name, skills, city };
  data.talents.push(newTalent);
  logData();
  res.status(201).json(newTalent);
});

// Update a talent
router.put('/:id', (req, res) => {
  const talent = data.talents.find(t => t.id === req.params.id);
  if (!talent) return res.status(404).json({ error: 'Talent not found' });
  const { name, skills, city } = req.body;
  talent.name = name;
  talent.skills = skills;
  talent.city = city;
  logData();
  res.json(talent);
});

// Delete a talent
router.delete('/:id', (req, res) => {
  const idx = data.talents.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Talent not found' });
  data.talents.splice(idx, 1);
  logData();
  res.status(204).end();
});

module.exports = router; 