require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const clientsRouter = require('./routes/clients');
const talentsRouter = require('./routes/talents');
const gigsRouter = require('./routes/gigs');
const notesRouter = require('./routes/notes');
const aiRouter = require('./routes/ai');

app.use('/api/clients', clientsRouter);
app.use('/api/talents', talentsRouter);
app.use('/api/gigs', gigsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/ai', aiRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
}); 