import React from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '@store/slices/authSlice';

// Importar dashboards específicos por rol
import BuyerDashboard from '@components/dashboard/BuyerDashboard';
import SellerDashboard from '@components/dashboard/SellerDashboard';
import AgentDashboard from '@components/dashboard/AgentDashboard';

const DashboardPage = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    navigate('/login');
    return null;
  }

  // Obtener el rol del usuario, por defecto 'buyer'
  const userRole = user.role || 'buyer';

  // Renderizar el dashboard correspondiente según el rol
  const renderDashboard = () => {
    switch (userRole) {
      case 'seller':
        return <SellerDashboard user={user} />;
      case 'agent':
      case 'intermediario':
        return <AgentDashboard user={user} />;
      case 'buyer':
      default:
        return <BuyerDashboard user={user} />;
    }
  };

  return (
    <div className="min-vh-100">
      {/* Barra de navegación superior */}
      <Navbar bg="light" expand="lg" className="border-bottom">
        <Container>
          <Navbar.Brand href="#" onClick={() => navigate('/dashboard')}>
            🏠 <strong>InmoTech</strong>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate('/properties')}>
                🏠 Propiedades
              </Nav.Link>
              <Nav.Link onClick={() => navigate('/chat')}>
                💬 Chat
              </Nav.Link>
              <Nav.Link onClick={() => navigate('/appointments')}>
                📅 Citas
              </Nav.Link>
              <Nav.Link onClick={() => navigate('/verification')}>
                🛡️ Verificación
              </Nav.Link>
              {(userRole === 'seller' || userRole === 'agent' || userRole === 'intermediario') && (
                <Nav.Link onClick={() => navigate('/analytics')}>
                  📊 Análisis
                </Nav.Link>
              )}
            </Nav>
            
            <Nav>
              <Nav.Link onClick={() => navigate('/profile')}>
                👤 {user.name || user.email}
              </Nav.Link>
              <Nav.Link onClick={() => navigate('/logout')}>
                🚪 Salir
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenido principal del dashboard específico por rol */}
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;