import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, ProgressBar, ListGroup } from 'react-bootstrap';
import { FaUsers, FaHome, FaDollarSign, FaChartLine, FaCalendarAlt, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AgentDashboard = ({ user }) => {
  const navigate = useNavigate();
  
  // Estados para datos del agente
  const [clients, setClients] = useState([]);
  const [listings, setListings] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [deals, setDeals] = useState([]);
  const [performance, setPerformance] = useState({});

  useEffect(() => {
    // Simular carga de datos del agente
    setClients([
      {
        id: 1,
        name: 'Ana García',
        type: 'buyer',
        status: 'active',
        budget: 400000000,
        preferences: 'Apartamento 3 hab, Zona Norte',
        lastContact: new Date(Date.now() - 86400000), // Ayer
        stage: 'viewing'
      },
      {
        id: 2,
        name: 'Carlos Rodríguez',
        type: 'seller',
        status: 'active',
        property: 'Casa El Poblado',
        asking: 580000000,
        lastContact: new Date(Date.now() - 172800000), // Hace 2 días
        stage: 'listing'
      },
      {
        id: 3,
        name: 'María López',
        type: 'buyer',
        status: 'hot',
        budget: 350000000,
        preferences: 'Apartamento moderno, Centro',
        lastContact: new Date(Date.now() - 3600000), // Hace 1 hora
        stage: 'negotiating'
      }
    ]);

    setListings([
      {
        id: 1,
        title: 'Apartamento Moderno Zona Norte',
        price: 350000000,
        status: 'active',
        views: 45,
        inquiries: 8,
        commission: 3.5,
        daysOnMarket: 15
      },
      {
        id: 2,
        title: 'Casa Familiar El Poblado',
        price: 580000000,
        status: 'under_offer',
        views: 67,
        inquiries: 12,
        commission: 3.0,
        daysOnMarket: 22
      },
      {
        id: 3,
        title: 'Penthouse Centro',
        price: 850000000,
        status: 'active',
        views: 23,
        inquiries: 5,
        commission: 4.0,
        daysOnMarket: 8
      }
    ]);

    setAppointments([
      {
        id: 1,
        type: 'viewing',
        clientName: 'Ana García',
        property: 'Apartamento Zona Norte',
        date: new Date(Date.now() + 86400000), // Mañana
        time: '15:00',
        status: 'confirmed'
      },
      {
        id: 2,
        type: 'listing',
        clientName: 'Roberto Silva',
        property: 'Evaluación Casa Chapinero',
        date: new Date(Date.now() + 172800000), // Pasado mañana
        time: '10:30',
        status: 'pending'
      },
      {
        id: 3,
        type: 'closing',
        clientName: 'María López',
        property: 'Firma Apartamento Centro',
        date: new Date(Date.now() + 259200000), // En 3 días
        time: '14:00',
        status: 'confirmed'
      }
    ]);

    setDeals([
      {
        id: 1,
        property: 'Estudio Universitario',
        seller: 'Carmen Pérez',
        buyer: 'Luis Martínez',
        amount: 180000000,
        commission: 5400000,
        status: 'closed',
        closeDate: new Date(Date.now() - 604800000) // Hace 1 semana
      },
      {
        id: 2,
        property: 'Apartamento Rosales',
        seller: 'Pedro González',
        buyer: 'Sandra Torres',
        amount: 420000000,
        commission: 14700000,
        status: 'pending',
        expectedClose: new Date(Date.now() + 604800000) // En 1 semana
      }
    ]);

    setPerformance({
      monthlyGoal: 50000000,
      monthlyEarned: 34200000,
      dealsThisMonth: 3,
      averageDealSize: 11400000,
      clientSatisfaction: 4.8,
      responseTime: 2.3 // horas
    });
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-CO', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getClientTypeIcon = (type) => {
    return type === 'buyer' ? '🏠' : '💰';
  };

  const getClientStatusBadge = (status) => {
    switch (status) {
      case 'hot': return <Badge bg="danger">Caliente</Badge>;
      case 'active': return <Badge bg="success">Activo</Badge>;
      case 'cold': return <Badge bg="secondary">Frío</Badge>;
      default: return <Badge bg="secondary">-</Badge>;
    }
  };

  const getListingStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge bg="success">Activa</Badge>;
      case 'under_offer': return <Badge bg="warning">Con Oferta</Badge>;
      case 'sold': return <Badge bg="primary">Vendida</Badge>;
      case 'paused': return <Badge bg="secondary">Pausada</Badge>;
      default: return <Badge bg="secondary">-</Badge>;
    }
  };

  const getAppointmentStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <Badge bg="success">Confirmada</Badge>;
      case 'pending': return <Badge bg="warning">Pendiente</Badge>;
      case 'cancelled': return <Badge bg="danger">Cancelada</Badge>;
      default: return <Badge bg="secondary">-</Badge>;
    }
  };

  const progressPercentage = (performance.monthlyEarned / performance.monthlyGoal) * 100;

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>🏢 Panel de Agente - {user?.name || 'Agente Inmobiliario'}</h2>
              <p className="text-muted">Gestiona clientes, propiedades y cierra más negocios</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={() => navigate('/clients/new')}>
                <FaUsers className="me-1" />
                Nuevo Cliente
              </Button>
              <Button variant="primary" onClick={() => navigate('/properties/new')}>
                <FaHome className="me-1" />
                Nueva Propiedad
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Estadísticas rápidas */}
      <Row className="mb-4">
        <Col md={2}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaUsers size={24} className="text-primary mb-2" />
              <h4>{clients.length}</h4>
              <small className="text-muted">Clientes Activos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaHome size={24} className="text-success mb-2" />
              <h4>{listings.filter(l => l.status === 'active').length}</h4>
              <small className="text-muted">Propiedades Activas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaCalendarAlt size={24} className="text-warning mb-2" />
              <h4>{appointments.filter(a => a.status === 'confirmed').length}</h4>
              <small className="text-muted">Citas Programadas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaDollarSign size={24} className="text-info mb-2" />
              <h4>{performance.dealsThisMonth}</h4>
              <small className="text-muted">Ventas Este Mes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaStar size={24} className="text-danger mb-2" />
              <h4>{performance.clientSatisfaction}</h4>
              <small className="text-muted">Satisfacción Cliente</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaChartLine size={24} className="text-success mb-2" />
              <h4>{Math.round(progressPercentage)}%</h4>
              <small className="text-muted">Meta Mensual</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Panel Principal */}
        <Col lg={8}>
          {/* Meta Mensual */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FaDollarSign className="text-success me-2" />
                Progreso Meta Mensual
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Ganado: {formatPrice(performance.monthlyEarned)}</span>
                <span>Meta: {formatPrice(performance.monthlyGoal)}</span>
              </div>
              <ProgressBar 
                now={progressPercentage} 
                variant={progressPercentage >= 80 ? 'success' : progressPercentage >= 60 ? 'warning' : 'danger'}
                className="mb-2"
              />
              <small className="text-muted">
                {progressPercentage >= 100 
                  ? '🎉 ¡Meta superada!' 
                  : `Faltan ${formatPrice(performance.monthlyGoal - performance.monthlyEarned)} para alcanzar la meta`
                }
              </small>
            </Card.Body>
          </Card>

          {/* Mis Clientes */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaUsers className="text-primary me-2" />
                Mis Clientes
              </h5>
              <Button variant="outline-primary" size="sm">
                Ver Todos
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th>Detalles</th>
                      <th>Último Contacto</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(client => (
                      <tr key={client.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="me-2">{getClientTypeIcon(client.type)}</span>
                            <strong>{client.name}</strong>
                          </div>
                        </td>
                        <td>
                          <Badge bg={client.type === 'buyer' ? 'info' : 'success'}>
                            {client.type === 'buyer' ? 'Comprador' : 'Vendedor'}
                          </Badge>
                        </td>
                        <td>{getClientStatusBadge(client.status)}</td>
                        <td>
                          <small>
                            {client.type === 'buyer' 
                              ? `${formatPrice(client.budget)} - ${client.preferences}`
                              : `${client.property} - ${formatPrice(client.asking)}`
                            }
                          </small>
                        </td>
                        <td>
                          <small>{formatDate(client.lastContact)}</small>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-success" size="sm" title="Llamar">
                              <FaPhone />
                            </Button>
                            <Button variant="outline-primary" size="sm" title="Email">
                              <FaEnvelope />
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

          {/* Mis Propiedades */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FaHome className="text-success me-2" />
                Mis Propiedades
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Propiedad</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Actividad</th>
                      <th>Comisión</th>
                      <th>Días en Mercado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map(listing => (
                      <tr key={listing.id}>
                        <td>{listing.title}</td>
                        <td>
                          <strong className="text-success">
                            {formatPrice(listing.price)}
                          </strong>
                        </td>
                        <td>{getListingStatusBadge(listing.status)}</td>
                        <td>
                          <small>
                            {listing.views} vistas • {listing.inquiries} consultas
                          </small>
                        </td>
                        <td>
                          <strong>
                            {formatPrice(listing.price * (listing.commission / 100))}
                          </strong>
                          <br />
                          <small className="text-muted">({listing.commission}%)</small>
                        </td>
                        <td>
                          <Badge bg={listing.daysOnMarket < 30 ? 'success' : 'warning'}>
                            {listing.daysOnMarket} días
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          {/* Próximas Citas */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FaCalendarAlt className="text-warning me-2" />
                Próximas Citas
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {appointments.map(appointment => (
                  <ListGroup.Item key={appointment.id} className="px-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold">{appointment.clientName}</div>
                        <small className="text-muted">{appointment.property}</small>
                        <br />
                        <small>
                          {formatDate(appointment.date)} - {appointment.time}
                        </small>
                      </div>
                      <div className="text-end">
                        {getAppointmentStatusBadge(appointment.status)}
                        <br />
                        <Badge bg="info" className="mt-1">
                          {appointment.type === 'viewing' ? 'Visita' :
                           appointment.type === 'listing' ? 'Listado' : 'Cierre'}
                        </Badge>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="text-center mt-3">
                <Button variant="outline-warning" size="sm">
                  Ver Calendario Completo
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Negocios Recientes */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FaChartLine className="text-info me-2" />
                Negocios Recientes
              </h5>
            </Card.Header>
            <Card.Body>
              {deals.map(deal => (
                <div key={deal.id} className="border-bottom py-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">{deal.property}</div>
                      <small className="text-muted">
                        {deal.seller} → {deal.buyer}
                      </small>
                      <br />
                      <strong className="text-success">
                        {formatPrice(deal.amount)}
                      </strong>
                    </div>
                    <div className="text-end">
                      <Badge bg={deal.status === 'closed' ? 'success' : 'warning'}>
                        {deal.status === 'closed' ? 'Cerrado' : 'Pendiente'}
                      </Badge>
                      <br />
                      <strong className="text-primary">
                        {formatPrice(deal.commission)}
                      </strong>
                      <br />
                      <small className="text-muted">comisión</small>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-3 p-2 bg-light rounded">
                <div className="text-center">
                  <strong>Total Comisiones Este Mes</strong>
                  <br />
                  <h4 className="text-success mb-0">
                    {formatPrice(performance.monthlyEarned)}
                  </h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AgentDashboard;