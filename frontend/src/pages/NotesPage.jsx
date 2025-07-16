import { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col, Badge, Spinner } from 'react-bootstrap';

const API_URL = 'http://localhost:4000/api/notes';
const AI_URL = 'http://localhost:4000/api/ai/summary';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [form, setForm] = useState({ profileType: '', profileId: '', note: '', type: '', created_by: '', timestamp: '' });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiTags, setAiTags] = useState([]);

  // Fetch notes
  const fetchNotes = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setNotes);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Open modal for add or edit
  const handleShowModal = (note) => {
    setSelectedNote(note);
    setAiSummary('');
    setAiTags([]);
    if (note) {
      setForm({
        profileType: note.profileType,
        profileId: note.profileId,
        note: note.note,
        type: note.type,
        created_by: note.created_by,
        timestamp: note.timestamp,
      });
    } else {
      setForm({ profileType: '', profileId: '', note: '', type: '', created_by: '', timestamp: '' });
    }
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedNote(null);
    setForm({ profileType: '', profileId: '', note: '', type: '', created_by: '', timestamp: '' });
    setAiSummary('');
    setAiTags([]);
    setShowModal(false);
  };

  // Handle form field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update note
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedNote) {
        // Update
        await fetch(`${API_URL}/${selectedNote.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        // Add
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      fetchNotes();
      handleCloseModal();
    } finally {
      setLoading(false);
    }
  };

  // Delete note
  const handleDelete = async () => {
    if (!selectedNote) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/${selectedNote.id}`, { method: 'DELETE' });
      fetchNotes();
      handleCloseModal();
    } finally {
      setLoading(false);
    }
  };

  // AI Summarize
  const handleAISummarize = async () => {
    setAiLoading(true);
    setAiSummary('');
    setAiTags([]);
    try {
      const res = await fetch(AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: form.note }),
      });
      const data = await res.json();
      setAiSummary(data.summary);
      setAiTags(data.tags);
    } finally {
      setAiLoading(false);
    }
  };

  // Replace note with AI summary
  const handleReplaceWithSummary = () => {
    setForm({ ...form, note: aiSummary });
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="flex-grow-1 d-flex justify-content-center">
          <h2 className="mb-0">Notes & Communication</h2>
        </div>
        <Button className="ms-3" onClick={() => handleShowModal(null)}>Add Note</Button>
      </div>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {notes.map(note => (
          <Col key={note.id}>
            <div
              className="card h-100 border-0 shadow-sm rounded-4 position-relative"
              style={{
                background: 'linear-gradient(135deg, #ff9800 0%, #fff3e0 100%)',
                color: '#222',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 32,
              }}
              onClick={() => handleShowModal(note)}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div className="fw-bold" style={{ fontSize: 20 }}>{note.profileType}</div>
              <div style={{ fontSize: 16 }}>{note.note}</div>
              <div className="mt-2"><Badge bg="info">{note.type}</Badge></div>
              <div style={{ position: 'absolute', bottom: 8, right: 16, fontSize: 12, color: '#555' }}>
                {note.timestamp && new Date(note.timestamp).toLocaleString()}
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedNote ? 'Edit Note' : 'Add Note'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Profile Type</Form.Label>
              <Form.Control
                type="text"
                name="profileType"
                value={form.profileType}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile ID</Form.Label>
              <Form.Control
                type="text"
                name="profileId"
                value={form.profileId}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="note"
                value={form.note}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Button
              variant="info"
              className="mb-2"
              onClick={handleAISummarize}
              disabled={aiLoading || loading || !form.note}
              type="button"
            >
              {aiLoading ? <Spinner size="sm" animation="border" /> : 'Summarize with AI'}
            </Button>
            {aiSummary && (
              <div className="mb-2">
                <div><b>AI Summary:</b> {aiSummary}</div>
                {aiTags.length > 0 && (
                  <div className="mt-1">
                    <b>Tags:</b> {aiTags.map(tag => <Badge bg="secondary" className="me-1" key={tag}>{tag}</Badge>)}
                  </div>
                )}
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="mt-2"
                  onClick={handleReplaceWithSummary}
                  type="button"
                >
                  Replace Note with AI Summary
                </Button>
              </div>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Created By</Form.Label>
              <Form.Control
                type="text"
                name="created_by"
                value={form.created_by}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {selectedNote && (
              <Button variant="danger" onClick={handleDelete} disabled={loading}>Delete</Button>
            )}
            <Button variant="primary" type="submit" disabled={loading}>
              {selectedNote ? 'Update' : 'Add'}
            </Button>
            <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>Close</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default NotesPage; 