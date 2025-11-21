import React, { useState, useEffect } from 'react';
import propertiesService from '../../services/propertiesService';
import { Container, Row, Col, Card, Button, Badge, Table, ProgressBar, Alert } from 'react-bootstrap';
import { FaHome, FaEye, FaComments, FaDollarSign, FaPlus, FaEdit, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = ({ user }) => {
  const navigate = useNavigate();
  
  // Estados para datos del vendedor
  const [myProperties, setMyProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [offers, setOffers] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    // Cargar propiedades reales del vendedor
    const fetchData = async () => {
      try {
        if (!user?.id) return;
        // Obtener propiedades del vendedor
        const res = await propertiesService.getProperties({ sellerId: user.id });
        const properties = res.data?.data || res.data || [];
        setMyProperties(properties);

        // Calcular analíticas básicas
        let totalViews = 0;
        let totalInquiries = 0;
        let soldCount = 0;
        let totalDays = 0;
        properties.forEach(p => {
          totalViews += p.views || 0;
          totalInquiries += p.inquiries || 0;
          if (p.status === 'sold') soldCount++;
          if (p.createdAt) {
            const days = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            totalDays += days;
          }
        });
        setAnalytics({
          totalViews,
          totalInquiries,
          conversionRate: properties.length ? Math.round((soldCount / properties.length) * 100) : 0,
          averageTimeOnMarket: properties.length ? Math.round(totalDays / properties.length) : 0
        });

        // TODO: Cargar consultas y ofertas reales (requiere endpoints específicos)
        setInquiries([]);
        setOffers([]);
      } catch (err) {
        setMyProperties([]);
        setAnalytics({ totalViews: 0, totalInquiries: 0, conversionRate: 0, averageTimeOnMarket: 0 });
        setInquiries([]);
        setOffers([]);
      }
    };
    fetchData();
  }, [user]);

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge bg="success">Activa</Badge>;
      case 'sold': return <Badge bg="primary">Vendida</Badge>;
      case 'paused': return <Badge bg="warning">Pausada</Badge>;
      default: return <Badge bg="secondary">Borrador</Badge>;
    }
  };

  const getOfferStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge bg="warning">Pendiente</Badge>;
      case 'accepted': return <Badge bg="success">Aceptada</Badge>;
      case 'rejected': return <Badge bg="danger">Rechazada</Badge>;
      case 'counter': return <Badge bg="info">Contraoferta</Badge>;
      default: return <Badge bg="secondary">-</Badge>;
    }
  };

  const getInquiryStatusBadge = (status) => {
    switch (status) {
      case 'unread': return <Badge bg="danger">No leído</Badge>;
      case 'read': return <Badge bg="warning">Leído</Badge>;
      case 'replied': return <Badge bg="success">Respondido</Badge>;
      default: return <Badge bg="secondary">-</Badge>;
    }
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>🏡 Panel de Vendedor - {user?.name || 'Vendedor'}</h2>
              <p className="text-muted">Gestiona tus propiedades y conecta con compradores</p>
            </div>
            <Button variant="primary" onClick={() => navigate('/properties/new')}>
              <FaPlus className="me-2" />
              Publicar Propiedad
            </Button>
          </div>
        </Col>
      </Row>

      {/* Estadísticas rápidas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaHome size={24} className="text-primary mb-2" />
              <h4>{myProperties.filter(p => p.status === 'active').length}</h4>
              <small className="text-muted">Propiedades Activas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaEye size={24} className="text-info mb-2" />
              <h4>{analytics.totalViews}</h4>
              <small className="text-muted">Vistas Totales</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaComments size={24} className="text-success mb-2" />
              <h4>{analytics.totalInquiries}</h4>
              <small className="text-muted">Consultas Recibidas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaChartLine size={24} className="text-warning mb-2" />
              <h4>{analytics.conversionRate}%</h4>
              <small className="text-muted">Tasa de Conversión</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Mis Propiedades */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaHome className="text-primary me-2" />
                Mis Propiedades
              </h5>
              <Button variant="outline-primary" size="sm" onClick={() => navigate('/properties/new')}>
                <FaPlus className="me-1" />
                Nueva Propiedad
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Propiedad</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Vistas</th>
                      <th>Consultas</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myProperties.map(property => (
                      <tr key={property.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={property.image} 
                              alt={property.title}
                              className="rounded me-2"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-bold">{property.title}</div>
                              <small className="text-muted">{property.location}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong className="text-success">
                            {formatPrice(property.price)}
                          </strong>
                        </td>
                        <td>{getStatusBadge(property.status)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaEye className="text-info me-1" />
                            {property.views}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaComments className="text-success me-1" />
                            {property.inquiries}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              onClick={() => navigate(`/properties/${property.id}/edit`)}
                            >
                              <FaEdit />
                            </Button>
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              onClick={() => navigate(`/properties/${property.id}`)}
                            >
                              <FaEye />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Ofertas Recibidas */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FaDollarSign className="text-success me-2" />
                Ofertas Recibidas
              </h5>
            </Card.Header>
            <Card.Body>
              {offers.length > 0 ? (
                <Table hover>
                  <thead>
                    <tr>
                      <th>Propiedad</th>
                      <th>Comprador</th>
                      <th>Oferta</th>
                      <th>% del Precio</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map(offer => (
                      <tr key={offer.id}>
                        <td>{offer.propertyTitle}</td>
                        <td>{offer.buyerName}</td>
                        <td>
                          <strong className="text-success">
                            {formatPrice(offer.offerAmount)}
                          </strong>
                        </td>
                        <td>
                          <Badge bg={offer.offerAmount >= offer.originalPrice * 0.95 ? 'success' : 'warning'}>
                            {Math.round((offer.offerAmount / offer.originalPrice) * 100)}%
                          </Badge>
                        </td>
                        <td>{getOfferStatusBadge(offer.status)}</td>
                        <td>
                          {offer.status === 'pending' && (
                            <div className="d-flex gap-1">
                              <Button variant="success" size="sm">Aceptar</Button>
                              <Button variant="outline-warning" size="sm">Negociar</Button>
                              <Button variant="outline-danger" size="sm">Rechazar</Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <FaDollarSign size={48} className="text-muted mb-3" />
                  <p className="text-muted">No hay ofertas pendientes</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar - Consultas y Actividad */}
        <Col lg={4}>
          {/* Consultas Recientes */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaComments className="text-success me-2" />
                Consultas Recientes
              </h5>
              <Badge bg="danger" pill>
                {inquiries.filter(i => i.status === 'unread').length}
              </Badge>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {inquiries.map(inquiry => (
                <div 
                  key={inquiry.id} 
                  className={`border-bottom py-2 cursor-pointer ${inquiry.status === 'unread' ? 'bg-light' : ''}`}
                  onClick={() => navigate('/chat')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <strong>{inquiry.buyerName}</strong>
                    <div className="text-end">
                      <small className="text-muted">{formatTime(inquiry.time)}</small>
                      <br />
                      {getInquiryStatusBadge(inquiry.status)}
                    </div>
                  </div>
                  <small className="text-muted">{inquiry.propertyTitle}</small>
                  <p className="mb-0 mt-1" style={{ fontSize: '0.9em' }}>
                    {inquiry.message}
                  </p>
                </div>
              ))}
              <div className="text-center mt-3">
                <Button variant="outline-success" size="sm" onClick={() => navigate('/chat')}>
                  Ver Todas las Conversaciones
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Rendimiento */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FaChartLine className="text-warning me-2" />
                Rendimiento
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Tasa de Conversión</small>
                  <small>{analytics.conversionRate}%</small>
                </div>
                <ProgressBar 
                  now={analytics.conversionRate} 
                  variant={analytics.conversionRate > 15 ? 'success' : 'warning'}
                />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Tiempo Promedio en Mercado</small>
                  <small>{analytics.averageTimeOnMarket} días</small>
                </div>
                <ProgressBar 
                  now={Math.max(0, 100 - analytics.averageTimeOnMarket * 2)} 
                  variant={analytics.averageTimeOnMarket < 30 ? 'success' : 'warning'}
                />
              </div>

              <Alert variant="info" className="mt-3">
                <small>
                  <strong>💡 Consejo:</strong> Responde rápidamente a las consultas para mejorar tu tasa de conversión.
                </small>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SellerDashboard;