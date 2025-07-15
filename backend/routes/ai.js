const express = require('express');
const router = express.Router();

// Mock AI summary endpoint
router.post('/summary', (req, res) => {
  const { note } = req.body;
  // Simulate AI summary and topic tags
  const summary = note.length > 50 ? note.slice(0, 50) + '...' : note;
  const tags = [];
  if (/budget/i.test(note)) tags.push('budget');
  if (/creative/i.test(note)) tags.push('creative direction');
  if (/next steps|todo|task/i.test(note)) tags.push('next steps');
  res.json({ summary: `Summary: ${summary}`, tags });
});

module.exports = router; 