import { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/gigs`;

function GigsPage() {
  const [gigs, setGigs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);
  const [form, setForm] = useState({ title: '', clientId: '', talentId: '', status: '', updates: '' });
  const [loading, setLoading] = useState(false);

  // Fetch gigs
  const fetchGigs = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setGigs);
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  // Open modal for add or edit
  const handleShowModal = (gig) => {
    setSelectedGig(gig);
    if (gig) {
      setForm({
        title: gig.title,
        clientId: gig.clientId,
        talentId: gig.talentId,
        status: gig.status,
        updates: gig.updates?.map(u => u.note).join(', ') || '',
      });
    } else {
      setForm({ title: '', clientId: '', talentId: '', status: '', updates: '' });
    }
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedGig(null);
    setForm({ title: '', clientId: '', talentId: '', status: '', updates: '' });
    setShowModal(false);
  };

  // Handle form field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update gig
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let payload = {
        ...form,
        updates: form.updates
          ? form.updates.split(',').map(note => ({ note: note.trim(), type: 'text', created_by: '', timestamp: '' })).filter(u => u.note)
          : [],
      };
      if (selectedGig) {
        // Update
        await fetch(`${API_URL}/${selectedGig.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Add
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      fetchGigs();
      handleCloseModal();
    } finally {
      setLoading(false);
    }
  };

  // Delete gig
  const handleDelete = async () => {
    if (!selectedGig) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/${selectedGig.id}`, { method: 'DELETE' });
      fetchGigs();
      handleCloseModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="flex-grow-1 d-flex justify-content-center">
          <h2 className="mb-0">Gigs</h2>
        </div>
        <Button className="ms-3" onClick={() => handleShowModal(null)}>Add Gig</Button>
      </div>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {gigs.map(gig => (
          <Col key={gig.id}>
            <div
              className="card h-100 border-0 shadow-sm rounded-4"
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
              }}
              onClick={() => handleShowModal(gig)}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div className="fw-bold" style={{ fontSize: 20 }}>{gig.title}</div>
              <div style={{ fontSize: 16 }}><Badge bg="secondary">{gig.status}</Badge></div>
            </div>
          </Col>
        ))}
      </Row>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedGig ? 'Edit Gig' : 'Add Gig'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Control
                type="text"
                name="clientId"
                value={form.clientId}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Talent</Form.Label>
              <Form.Control
                type="text"
                name="talentId"
                value={form.talentId}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Updates (comma separated notes)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="updates"
                value={form.updates}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {selectedGig && (
              <Button variant="danger" onClick={handleDelete} disabled={loading}>Delete</Button>
            )}
            <Button variant="primary" type="submit" disabled={loading}>
              {selectedGig ? 'Update' : 'Add'}
            </Button>
            <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>Close</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default GigsPage; 