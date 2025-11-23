import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, ProgressBar } from 'react-bootstrap';
import { FaHome, FaHeart, FaEye, FaComments, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BuyerDashboard = ({ user }) => {
  const navigate = useNavigate();
  
  // Estados para datos del comprador
  const [savedProperties, setSavedProperties] = useState([]);
  const [recentViews, setRecentViews] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Simular carga de datos del comprador
    setSavedProperties([
      {
        id: 1,
        title: 'Apartamento Moderno Zona Norte',
        price: 350000000,
        location: 'Bogotá, Zona Norte',
        image: 'https://via.placeholder.com/300x200?text=Apt1',
        savedDate: new Date(Date.now() - 86400000), // Ayer
        status: 'available'
      },
      {
        id: 2,
        title: 'Casa Familiar con Jardín',
        price: 580000000,
        location: 'Medellín, El Poblado',
        image: 'https://via.placeholder.com/300x200?text=Casa1',
        savedDate: new Date(Date.now() - 172800000), // Hace 2 días
        status: 'available'
      }
    ]);

    setRecentViews([
      { id: 3, title: 'Penthouse Centro', viewDate: new Date(Date.now() - 3600000) },
      { id: 4, title: 'Estudio Universitario', viewDate: new Date(Date.now() - 7200000) },
      { id: 5, title: 'Loft Industrial', viewDate: new Date(Date.now() - 10800000) }
    ]);

    setActiveChats([
      {
        id: 1,
        propertyTitle: 'Apartamento Moderno Zona Norte',
        sellerName: 'María González',
        lastMessage: 'La visita puede ser mañana a las 3pm',
        unreadCount: 2,
        lastMessageTime: new Date(Date.now() - 1800000)
      },
      {
        id: 2,
        propertyTitle: 'Casa Familiar con Jardín',
        sellerName: 'Carlos Rodríguez',
        lastMessage: 'El precio incluye todos los acabados',
        unreadCount: 0,
        lastMessageTime: new Date(Date.now() - 7200000)
      }
    ]);

    setRecommendations([
      {
        id: 6,
        title: 'Apartamento Similar Zona Rosa',
        price: 320000000,
        match: 95,
        reason: 'Similar presupuesto y ubicación'
      },
      {
        id: 7,
        title: 'Casa Moderna El Poblado',
        price: 550000000,
        match: 87,
        reason: 'Basado en tus búsquedas recientes'
      }
    ]);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatTime = (date) => {
    return new Intl.RelativeTimeFormat('es-CO', { numeric: 'auto' }).format(
      Math.round((date - new Date()) / (1000 * 60 * 60)),
      'hour'
    );
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2>👋 Bienvenido, {user?.name || 'Comprador'}</h2>
          <p className="text-muted">Tu dashboard personalizado para encontrar la propiedad perfecta</p>
        </Col>
      </Row>

      {/* Estadísticas rápidas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaHeart size={24} className="text-danger mb-2" />
              <h4>{savedProperties.length}</h4>
              <small className="text-muted">Propiedades Guardadas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaEye size={24} className="text-info mb-2" />
              <h4>{recentViews.length}</h4>
              <small className="text-muted">Vistas Recientes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaComments size={24} className="text-success mb-2" />
              <h4>{activeChats.length}</h4>
              <small className="text-muted">Conversaciones Activas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaCalendarAlt size={24} className="text-warning mb-2" />
              <h4>3</h4>
              <small className="text-muted">Visitas Programadas</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Propiedades Guardadas */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaHeart className="text-danger me-2" />
                Propiedades Guardadas
              </h5>
              <Button variant="outline-primary" size="sm" onClick={() => navigate('/properties')}>
                <FaSearch className="me-1" />
                Buscar Más
              </Button>
            </Card.Header>
            <Card.Body>
              {savedProperties.length > 0 ? (
                <Row>
                  {savedProperties.map(property => (
                    <Col md={6} key={property.id} className="mb-3">
                      <Card className="h-100">
                        <Card.Img 
                          variant="top" 
                          src={property.image} 
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                        <Card.Body>
                          <Card.Title style={{ fontSize: '1rem' }}>{property.title}</Card.Title>
                          <Card.Text>
                            <small className="text-muted">📍 {property.location}</small>
                            <br />
                            <strong className="text-success">{formatPrice(property.price)}</strong>
                          </Card.Text>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => navigate(`/properties/${property.id}`)}
                            >
                              Ver Detalles
                            </Button>
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => navigate('/chat')}
                            >
                              <FaComments />
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-4">
                  <FaHeart size={48} className="text-muted mb-3" />
                  <p className="text-muted">No tienes propiedades guardadas aún</p>
                  <Button variant="primary" onClick={() => navigate('/properties')}>
                    Explorar Propiedades
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Recomendaciones */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FaHome className="text-primary me-2" />
                Recomendaciones para Ti
              </h5>
            </Card.Header>
            <Card.Body>
              {recommendations.map(rec => (
                <div key={rec.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                  <div>
                    <h6 className="mb-1">{rec.title}</h6>
                    <small className="text-muted">{rec.reason}</small>
                    <br />
                    <strong className="text-success">{formatPrice(rec.price)}</strong>
                  </div>
                  <div className="text-end">
                    <div className="mb-1">
                      <Badge bg="success">{rec.match}% match</Badge>
                    </div>
                    <Button variant="outline-primary" size="sm">
                      Ver Propiedad
                    </Button>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar - Conversaciones y Actividad */}
        <Col lg={4}>
          {/* Conversaciones Activas */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FaComments className="text-success me-2" />
                Conversaciones Activas
              </h5>
            </Card.Header>
            <Card.Body>
              {activeChats.map(chat => (
                <div 
                  key={chat.id} 
                  className="d-flex justify-content-between align-items-start border-bottom py-2 cursor-pointer"
                  onClick={() => navigate('/chat')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{chat.propertyTitle}</h6>
                    <small className="text-muted">con {chat.sellerName}</small>
                    <br />
                    <small className="text-muted">{chat.lastMessage}</small>
                  </div>
                  <div className="text-end">
                    <small className="text-muted">{formatTime(chat.lastMessageTime)}</small>
                    {chat.unreadCount > 0 && (
                      <div>
                        <Badge bg="danger" pill>{chat.unreadCount}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="text-center mt-3">
                <Button variant="outline-success" size="sm" onClick={() => navigate('/chat')}>
                  Ver Todas las Conversaciones
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Actividad Reciente */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FaEye className="text-info me-2" />
                Actividad Reciente
              </h5>
            </Card.Header>
            <Card.Body>
              {recentViews.map(view => (
                <div key={view.id} className="d-flex justify-content-between align-items-center py-1">
                  <span>{view.title}</span>
                  <small className="text-muted">{formatTime(view.viewDate)}</small>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BuyerDashboard;