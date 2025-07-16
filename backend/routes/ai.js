const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Use google/pegasus-xsum for summarization
const HF_API_URL = 'https://api-inference.huggingface.co/models/google/pegasus-xsum';
const HF_API_TOKEN = process.env.HF_API_TOKEN;

// Check for missing API token at startup
if (!HF_API_TOKEN) {
  console.error('ERROR: Hugging Face API token (HF_API_TOKEN) is not set in environment variables.');
}

router.post('/summary', async (req, res) => {
  const { note } = req.body;
  // Check for missing API token on each request
  if (!HF_API_TOKEN) {
    return res.status(500).json({ error: 'Hugging Face API token is not set on the server. Please set HF_API_TOKEN in your environment.' });
  }
  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: note,
        parameters: { max_new_tokens: 128 }
      })
    });
    let data;
    try {
      data = await response.json();
    } catch (err) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      return res.status(500).json({ error: 'Model not available or API error', details: text });
    }
    console.log('Hugging Face API response:', data); // Debug log
    // Handle invalid credentials error from Hugging Face
    if (data.error && /invalid credentials/i.test(data.error)) {
      return res.status(401).json({ error: 'Invalid Hugging Face API token. Please check your HF_API_TOKEN.' });
    }
    let summary = '';
    if (Array.isArray(data) && data[0]?.summary_text) {
      summary = data[0].summary_text;
    } else if (data.summary_text) {
      summary = data.summary_text;
    } else {
      summary = JSON.stringify(data);
    }
    // Simple tag extraction (look for #tags or keywords)
    const tags = [];
    const tagMatches = summary.match(/#\w+/g);
    if (tagMatches) tags.push(...tagMatches.map(t => t.replace('#', '')));
    if (/budget/i.test(summary)) tags.push('budget');
    if (/creative/i.test(summary)) tags.push('creative direction');
    if (/next steps|todo|task/i.test(summary)) tags.push('next steps');
    res.json({ summary, tags });
  } catch (err) {
    console.error('AI summary error:', err);
    res.status(500).json({ error: 'Summarization failed', details: err.message });
  }
});

module.exports = router; 