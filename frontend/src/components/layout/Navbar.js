import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Container, Badge, Offcanvas } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FaBell, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import NotificationCenter from '@components/notifications/NotificationCenter';
import { logout } from '@store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { unreadCount } = useSelector(state => state.notifications);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => dispatch(logout());
  const getRoleLabel = (role) => ({
    buyer: 'Comprador',
    seller: 'Vendedor',
    agent: 'Intermediario'
  }[role] || role);

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        <LinkContainer to="/dashboard">
          <BootstrapNavbar.Brand className="fw-bold">InmoTech</BootstrapNavbar.Brand>
        </LinkContainer>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/dashboard"><Nav.Link>Dashboard</Nav.Link></LinkContainer>
            <LinkContainer to="/chat"><Nav.Link>Chat</Nav.Link></LinkContainer>
            <LinkContainer to="/properties"><Nav.Link>Propiedades</Nav.Link></LinkContainer>
            <LinkContainer to="/offers"><Nav.Link>Ofertas</Nav.Link></LinkContainer>
            <LinkContainer to="/agents"><Nav.Link>Agentes</Nav.Link></LinkContainer>
          </Nav>
          <Nav>
            <Nav.Link className="position-relative" onClick={() => setShowNotifications(true)} style={{ cursor: 'pointer' }}>
              <FaBell />
              {unreadCount > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.6rem' }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Nav.Link>
            <Offcanvas show={showNotifications} onHide={() => setShowNotifications(false)} placement="end">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Centro de Notificaciones</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <NotificationCenter />
              </Offcanvas.Body>
            </Offcanvas>
            <NavDropdown
              title={<span><FaUser className="me-2" />{user?.firstName}</span>}
              id="user-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item disabled className="text-muted small">{getRoleLabel(user?.role)}</NavDropdown.Item>
              <NavDropdown.Divider />
              <LinkContainer to="/profile">
                <NavDropdown.Item><FaUser className="me-2" />Mi Perfil</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Item><FaCog className="me-2" />Configuración</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}><FaSignOutAlt className="me-2" />Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;