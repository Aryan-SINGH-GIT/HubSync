import { Container, Row, Col, Nav, Button, Offcanvas } from 'react-bootstrap';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import ClientsPage from './pages/ClientsPage';
import TalentsPage from './pages/TalentsPage';
import GigsPage from './pages/GigsPage';
import NotesPage from './pages/NotesPage';
import './App.css';

function Sidebar({ onHide }) {
  const location = useLocation();
  return (
    <Nav className="flex-column" style={{ minWidth: 200 }}>
      <Nav.Link as={Link} to="/clients" active={location.pathname === '/clients'} onClick={onHide}>Clients</Nav.Link>
      <Nav.Link as={Link} to="/talents" active={location.pathname === '/talents'} onClick={onHide}>Talents</Nav.Link>
      <Nav.Link as={Link} to="/gigs" active={location.pathname === '/gigs'} onClick={onHide}>Gigs</Nav.Link>
      <Nav.Link as={Link} to="/notes" active={location.pathname === '/notes'} onClick={onHide}>Notes & Communication</Nav.Link>
    </Nav>
  );
}

function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleClose = () => setShowSidebar(false);
  const handleShow = () => setShowSidebar(true);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000 0%, #1e3c72 100%)',
      }}
    >
      {/* Top Bar */}
      <div
        className="d-flex align-items-center justify-content-between px-3"
        style={{ height: 64, background: '#111', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <div className="d-flex align-items-center">
          <Button
            variant="primary"
            className="me-3"
            style={{ width: 40, height: 40, borderRadius: 8, fontSize: 24, fontWeight: 'bold', padding: 0 }}
            onClick={handleShow}
            aria-label="Open sidebar"
          >
            {'<'}
          </Button>
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #e0e0e0, #b0b0b0 60%, #fff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 2,
            }}
          >
           HubSync
          </span>
        </div>
        {/* Placeholder for Add button, will be implemented per page */}
        <div></div>
      </div>
      {/* Offcanvas Sidebar for all screen sizes */}
      <Offcanvas show={showSidebar} onHide={handleClose} backdrop scroll id="sidebarOffcanvas"
        style={{ background: 'linear-gradient(135deg, #000 0%, #1e3c72 100%)', color: '#fff' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Sidebar onHide={handleClose} />
        </Offcanvas.Body>
      </Offcanvas>
      {/* Main Content */}
      <Container fluid className="py-4">
        <Routes>
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/talents" element={<TalentsPage />} />
          <Route path="/gigs" element={<GigsPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="*" element={<ClientsPage />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
