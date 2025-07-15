const express = require('express');
const router = express.Router();
const data = require('../data');
const { v4: uuidv4 } = require('uuid');
const logData = data.logData;

// Get all clients
router.get('/', (req, res) => {
  res.json(data.clients);
});

// Get a single client
router.get('/:id', (req, res) => {
  const client = data.clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  res.json(client);
});

// Create a new client
router.post('/', (req, res) => {
  const { name, contact, industry } = req.body;
  const newClient = { id: uuidv4(), name, contact, industry };
  data.clients.push(newClient);
  logData();
  res.status(201).json(newClient);
});

// Update a client
router.put('/:id', (req, res) => {
  const client = data.clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  const { name, contact, industry } = req.body;
  client.name = name;
  client.contact = contact;
  client.industry = industry;
  logData();
  res.json(client);
});

// Delete a client
router.delete('/:id', (req, res) => {
  const idx = data.clients.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Client not found' });
  data.clients.splice(idx, 1);
  logData();
  res.status(204).end();
});

module.exports = router; 