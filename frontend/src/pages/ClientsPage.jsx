import { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';

const API_URL = 'http://localhost:4000/api/clients';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [form, setForm] = useState({ name: '', contact: '', industry: '' });
  const [loading, setLoading] = useState(false);

  // Fetch clients
  const fetchClients = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setClients);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Open modal for add or edit
  const handleShowModal = (client) => {
    setSelectedClient(client);
    if (client) {
      setForm({ name: client.name, contact: client.contact, industry: client.industry });
    } else {
      setForm({ name: '', contact: '', industry: '' });
    }
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedClient(null);
    setForm({ name: '', contact: '', industry: '' });
    setShowModal(false);
  };

  // Handle form field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update client
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedClient) {
        // Update
        await fetch(`${API_URL}/${selectedClient.id}`, {
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
      fetchClients();
      handleCloseModal();
    } finally {
      setLoading(false);
    }
  };

  // Delete client
  const handleDelete = async () => {
    if (!selectedClient) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/${selectedClient.id}`, { method: 'DELETE' });
      fetchClients();
      handleCloseModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="flex-grow-1 d-flex justify-content-center">
          <h2 className="mb-0">Clients</h2>
        </div>
        <Button className="ms-3" onClick={() => handleShowModal(null)}>Add Client</Button>
      </div>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {clients.map(client => (
          <Col key={client.id}>
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
              onClick={() => handleShowModal(client)}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div className="fw-bold" style={{ fontSize: 20 }}>{client.name}</div>
              <div style={{ fontSize: 16 }}>{client.industry}</div>
            </div>
          </Col>
        ))}
      </Row>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedClient ? 'Edit Client' : 'Add Client'}</Modal.Title>
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
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="email"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Industry</Form.Label>
              <Form.Control
                type="text"
                name="industry"
                value={form.industry}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            {selectedClient && (
              <Button variant="danger" onClick={handleDelete} disabled={loading}>Delete</Button>
            )}
            <Button variant="primary" type="submit" disabled={loading}>
              {selectedClient ? 'Update' : 'Add'}
            </Button>
            <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>Close</Button>
        </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ClientsPage; 