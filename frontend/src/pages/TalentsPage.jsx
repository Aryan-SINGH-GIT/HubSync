import { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/talents`;

function TalentsPage() {
  const [talents, setTalents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [form, setForm] = useState({ name: '', skills: '', city: '' });
  const [loading, setLoading] = useState(false);

  // Fetch talents
  const fetchTalents = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setTalents);
  };

  useEffect(() => {
    fetchTalents();
  }, []);

  // Open modal for add or edit
  const handleShowModal = (talent) => {
    setSelectedTalent(talent);
    if (talent) {
      setForm({ name: talent.name, skills: talent.skills?.join(', ') || '', city: talent.city });
    } else {
      setForm({ name: '', skills: '', city: '' });
    }
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedTalent(null);
    setForm({ name: '', skills: '', city: '' });
    setShowModal(false);
  };

  // Handle form field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update talent
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
      if (selectedTalent) {
        // Update
        await fetch(`${API_URL}/${selectedTalent.id}`, {
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
      fetchTalents();
      handleCloseModal();
    } finally {
      setLoading(false);
    }
  };

  // Delete talent
  const handleDelete = async () => {
    if (!selectedTalent) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/${selectedTalent.id}`, { method: 'DELETE' });
      fetchTalents();
      handleCloseModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="flex-grow-1 d-flex justify-content-center">
          <h2 className="mb-0">Talents</h2>
        </div>
        <Button className="ms-3" onClick={() => handleShowModal(null)}>Add Talent</Button>
      </div>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {talents.map(talent => (
          <Col key={talent.id}>
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
              onClick={() => handleShowModal(talent)}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div className="fw-bold" style={{ fontSize: 20 }}>{talent.name}</div>
              <div style={{ fontSize: 16 }}>
                {talent.skills && talent.skills.map(skill => (
                  <Badge bg="info" className="me-1" key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTalent ? 'Edit Talent' : 'Add Talent'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Skills (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {selectedTalent && (
              <Button variant="danger" onClick={handleDelete} disabled={loading}>Delete</Button>
            )}
            <Button variant="primary" type="submit" disabled={loading}>
              {selectedTalent ? 'Update' : 'Add'}
            </Button>
            <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>Close</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default TalentsPage; 