import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, Modal, Alert, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaPhone, FaCheckCircle, FaTimes, FaEdit, FaEye, FaCalendarCheck, FaCalendarTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AppointmentsPage = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Datos simulados de citas
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      property: {
        id: 1,
        title: 'Apartamento Moderno Zona Norte',
        location: 'Bogotá, Zona Norte',
        price: 350000000,
        image: 'https://via.placeholder.com/200x150?text=Apt1',
        seller: { name: 'María González', phone: '+57 300 123 4567' }
      },
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Mañana
      time: '10:00',
      visitor: {
        name: 'Ana García',
        phone: '+57 315 987 6543',
        email: 'ana@email.com',
        notes: 'Interesada en compra inmediata, busca apartamento para familia joven'
      },
      status: 'scheduled',
      confirmationCode: 'VISIT-123456',
      scheduledAt: new Date(Date.now() - 3600000).toISOString(),
      type: currentUser?.role === 'buyer' ? 'outgoing' : 'incoming'
    },
    {
      id: 2,
      property: {
        id: 2,
        title: 'Casa Familiar con Jardín',
        location: 'Medellín, El Poblado',
        price: 580000000,
        image: 'https://via.placeholder.com/200x150?text=Casa1',
        seller: { name: 'Carlos Rodríguez', phone: '+57 301 555 7890' }
      },
      date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // Pasado mañana
      time: '15:30',
      visitor: {
        name: 'Roberto Silva',
        phone: '+57 320 111 2222',
        email: 'roberto@email.com',
        notes: 'Primera visita, tiene preguntas sobre financiación'
      },
      status: 'confirmed',
      confirmationCode: 'VISIT-789012',
      scheduledAt: new Date(Date.now() - 86400000).toISOString(),
      confirmedAt: new Date(Date.now() - 43200000).toISOString(),
      type: currentUser?.role === 'buyer' ? 'outgoing' : 'incoming'
    },
    {
      id: 3,
      property: {
        id: 3,
        title: 'Oficina Ejecutiva Centro',
        location: 'Bogotá, Centro',
        price: 420000000,
        image: 'https://via.placeholder.com/200x150?text=Ofi1',
        seller: { name: 'Ana Martínez', phone: '+57 302 444 5555' }
      },
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Ayer
      time: '14:00',
      visitor: {
        name: 'Luisa Fernández',
        phone: '+57 318 666 7777',
        email: 'luisa@email.com',
        notes: 'Inversión comercial, necesita información sobre rentabilidad'
      },
      status: 'completed',
      confirmationCode: 'VISIT-345678',
      scheduledAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      confirmedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
      completedAt: new Date(Date.now() - 86400000 + 3600000).toISOString(),
      type: currentUser?.role === 'buyer' ? 'outgoing' : 'incoming'
    },
    {
      id: 4,
      property: {
        id: 4,
        title: 'Penthouse con Terraza',
        location: 'Bogotá, Chapinero',
        price: 750000000,
        image: 'https://via.placeholder.com/200x150?text=Pent1',
        seller: { name: 'Diego Morales', phone: '+57 310 888 9999' }
      },
      date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], // Hace 2 días
      time: '11:00',
      visitor: {
        name: 'Carmen Pérez',
        phone: '+57 317 000 1111',
        email: 'carmen@email.com',
        notes: 'Cancelada por emergencia familiar'
      },
      status: 'cancelled',
      confirmationCode: 'VISIT-901234',
      scheduledAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      cancelledAt: new Date(Date.now() - 2 * 86400000 + 7200000).toISOString(),
      cancelReason: 'Emergencia familiar, reprogramar para la próxima semana',
      type: currentUser?.role === 'buyer' ? 'outgoing' : 'incoming'
    }
  ]);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const formatDateTime = (dateString) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status) => {
    const config = {
      scheduled: { bg: 'warning', text: 'Programada', icon: <FaClock /> },
      confirmed: { bg: 'success', text: 'Confirmada', icon: <FaCheckCircle /> },
      completed: { bg: 'info', text: 'Completada', icon: <FaCalendarCheck /> },
      cancelled: { bg: 'danger', text: 'Cancelada', icon: <FaTimes /> },
      rescheduled: { bg: 'secondary', text: 'Reprogramada', icon: <FaEdit /> }
    };
    
    const statusConfig = config[status] || config.scheduled;
    
    return (
      <Badge bg={statusConfig.bg} className="d-flex align-items-center gap-1">
        {statusConfig.icon}
        {statusConfig.text}
      </Badge>
    );
  };

  const getFilteredAppointments = (status) => {
    switch (status) {
      case 'scheduled':
        return appointments.filter(apt => ['scheduled', 'confirmed'].includes(apt.status));
      case 'completed':
        return appointments.filter(apt => apt.status === 'completed');
      case 'cancelled':
        return appointments.filter(apt => apt.status === 'cancelled');
      default:
        return appointments;
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmCancelAppointment = () => {
    if (!cancelReason.trim()) {
      toast.warning('Por favor proporciona un motivo para la cancelación');
      return;
    }

    // Simular cancelación
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === selectedAppointment.id 
          ? {
              ...apt,
              status: 'cancelled',
              cancelledAt: new Date().toISOString(),
              cancelReason
            }
          : apt
      )
    );

    toast.success('Cita cancelada exitosamente');
    setShowCancelModal(false);
    setCancelReason('');
    setSelectedAppointment(null);
  };

  const handleConfirmAppointment = (appointmentId) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? {
              ...apt,
              status: 'confirmed',
              confirmedAt: new Date().toISOString()
            }
          : apt
      )
    );
    toast.success('Cita confirmada exitosamente');
  };

  const isUpcoming = (date, time) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    return appointmentDateTime > new Date();
  };

  const getTimeUntilAppointment = (date, time) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffMs = appointmentDateTime - now;
    
    if (diffMs <= 0) return 'Pasada';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) return `En ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    if (diffHours > 0) return `En ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return 'Pronto';
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>
                <FaCalendarAlt className="me-2 text-primary" />
                Mis Citas
              </h2>
              <p className="text-muted">
                Gestiona tus citas de visita a propiedades
              </p>
            </div>
          </div>

          {/* Estadísticas resumidas */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaCalendarAlt size={32} className="text-primary mb-2" />
                  <h5>{appointments.length}</h5>
                  <small className="text-muted">Total de Citas</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaClock size={32} className="text-warning mb-2" />
                  <h5>{getFilteredAppointments('scheduled').length}</h5>
                  <small className="text-muted">Programadas</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaCalendarCheck size={32} className="text-success mb-2" />
                  <h5>{getFilteredAppointments('completed').length}</h5>
                  <small className="text-muted">Completadas</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaCalendarTimes size={32} className="text-danger mb-2" />
                  <h5>{getFilteredAppointments('cancelled').length}</h5>
                  <small className="text-muted">Canceladas</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="mb-4"
          >
            <Tab eventKey="scheduled" title={`Próximas (${getFilteredAppointments('scheduled').length})`}>
              <Card>
                <Card.Body>
                  {getFilteredAppointments('scheduled').length > 0 ? (
                    <Row>
                      {getFilteredAppointments('scheduled').map(appointment => (
                        <Col md={6} lg={4} key={appointment.id} className="mb-4">
                          <Card className="h-100 border-primary">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                {getStatusBadge(appointment.status)}
                                <small className="text-muted">
                                  {getTimeUntilAppointment(appointment.date, appointment.time)}
                                </small>
                              </div>

                              <div className="mb-3">
                                <img
                                  src={appointment.property.image}
                                  alt={appointment.property.title}
                                  className="img-fluid rounded mb-2"
                                  style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                                />
                                <h6 className="mb-1">{appointment.property.title}</h6>
                                <small className="text-muted d-flex align-items-center">
                                  <FaMapMarkerAlt className="me-1" />
                                  {appointment.property.location}
                                </small>
                              </div>

                              <div className="mb-3">
                                <p className="mb-1">
                                  <FaCalendarAlt className="me-2 text-primary" />
                                  <strong>{formatDate(appointment.date)}</strong>
                                </p>
                                <p className="mb-1">
                                  <FaClock className="me-2 text-primary" />
                                  <strong>{appointment.time}</strong>
                                </p>
                                <p className="mb-0">
                                  <FaUser className="me-2 text-primary" />
                                  {appointment.visitor.name}
                                </p>
                              </div>

                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleViewDetails(appointment)}
                                >
                                  <FaEye className="me-1" />
                                  Ver
                                </Button>
                                {appointment.status === 'scheduled' && currentUser?.role !== 'buyer' && (
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => handleConfirmAppointment(appointment.id)}
                                  >
                                    <FaCheckCircle className="me-1" />
                                    Confirmar
                                  </Button>
                                )}
                                {isUpcoming(appointment.date, appointment.time) && (
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleCancelAppointment(appointment)}
                                  >
                                    <FaTimes />
                                  </Button>
                                )}
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <FaCalendarAlt size={48} className="text-muted mb-3" />
                      <h5>No tienes citas programadas</h5>
                      <p className="text-muted">
                        Tus próximas citas aparecerán aquí.
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="completed" title={`Completadas (${getFilteredAppointments('completed').length})`}>
              <Card>
                <Card.Body>
                  {getFilteredAppointments('completed').length > 0 ? (
                    <Row>
                      {getFilteredAppointments('completed').map(appointment => (
                        <Col md={6} lg={4} key={appointment.id} className="mb-4">
                          <Card className="h-100">
                            <Card.Body>
                              <div className="mb-3">
                                {getStatusBadge(appointment.status)}
                              </div>

                              <div className="mb-3">
                                <img
                                  src={appointment.property.image}
                                  alt={appointment.property.title}
                                  className="img-fluid rounded mb-2"
                                  style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                                />
                                <h6 className="mb-1">{appointment.property.title}</h6>
                                <small className="text-muted">{appointment.property.location}</small>
                              </div>

                              <div className="mb-3">
                                <small className="text-muted">
                                  <strong>Fecha:</strong> {formatDate(appointment.date)} - {appointment.time}
                                </small>
                                <br />
                                <small className="text-muted">
                                  <strong>Visitante:</strong> {appointment.visitor.name}
                                </small>
                                {appointment.completedAt && (
                                  <>
                                    <br />
                                    <small className="text-success">
                                      <strong>Completada:</strong> {formatDateTime(appointment.completedAt)}
                                    </small>
                                  </>
                                )}
                              </div>

                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleViewDetails(appointment)}
                              >
                                <FaEye className="me-1" />
                                Ver Detalles
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <FaCalendarCheck size={48} className="text-muted mb-3" />
                      <h5>No tienes citas completadas</h5>
                      <p className="text-muted">
                        Tus citas completadas aparecerán aquí.
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="cancelled" title={`Canceladas (${getFilteredAppointments('cancelled').length})`}>
              <Card>
                <Card.Body>
                  {getFilteredAppointments('cancelled').length > 0 ? (
                    <Row>
                      {getFilteredAppointments('cancelled').map(appointment => (
                        <Col md={6} lg={4} key={appointment.id} className="mb-4">
                          <Card className="h-100 border-danger">
                            <Card.Body>
                              <div className="mb-3">
                                {getStatusBadge(appointment.status)}
                              </div>

                              <div className="mb-3">
                                <h6 className="mb-1">{appointment.property.title}</h6>
                                <small className="text-muted">{appointment.property.location}</small>
                              </div>

                              <div className="mb-3">
                                <small className="text-muted">
                                  <strong>Fecha original:</strong> {formatDate(appointment.date)} - {appointment.time}
                                </small>
                                <br />
                                <small className="text-muted">
                                  <strong>Cancelada:</strong> {appointment.cancelledAt && formatDateTime(appointment.cancelledAt)}
                                </small>
                                {appointment.cancelReason && (
                                  <>
                                    <br />
                                    <small className="text-danger">
                                      <strong>Motivo:</strong> {appointment.cancelReason}
                                    </small>
                                  </>
                                )}
                              </div>

                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleViewDetails(appointment)}
                              >
                                <FaEye className="me-1" />
                                Ver Detalles
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <FaCalendarTimes size={48} className="text-muted mb-3" />
                      <h5>No tienes citas canceladas</h5>
                      <p className="text-muted">
                        Las citas canceladas aparecerán aquí.
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Modal de detalles */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <Row className="mb-4">
                <Col md={8}>
                  <h5>{selectedAppointment.property.title}</h5>
                  <p className="text-muted">{selectedAppointment.property.location}</p>
                  <h6 className="text-success">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0
                    }).format(selectedAppointment.property.price)}
                  </h6>
                </Col>
                <Col md={4}>
                  <img
                    src={selectedAppointment.property.image}
                    alt={selectedAppointment.property.title}
                    className="img-fluid rounded"
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <h6>Información de la Cita</h6>
                  <p>
                    <strong>Estado:</strong> {getStatusBadge(selectedAppointment.status)}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {formatDate(selectedAppointment.date)}
                  </p>
                  <p>
                    <strong>Hora:</strong> {selectedAppointment.time}
                  </p>
                  <p>
                    <strong>Código:</strong> {selectedAppointment.confirmationCode}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Información del Visitante</h6>
                  <p>
                    <strong>Nombre:</strong> {selectedAppointment.visitor.name}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {selectedAppointment.visitor.phone}
                  </p>
                  {selectedAppointment.visitor.email && (
                    <p>
                      <strong>Email:</strong> {selectedAppointment.visitor.email}
                    </p>
                  )}
                </Col>
              </Row>

              {selectedAppointment.visitor.notes && (
                <div className="mb-3">
                  <h6>Notas del Visitante</h6>
                  <p className="bg-light p-3 rounded">{selectedAppointment.visitor.notes}</p>
                </div>
              )}

              {selectedAppointment.cancelReason && (
                <Alert variant="danger">
                  <strong>Motivo de cancelación:</strong> {selectedAppointment.cancelReason}
                </Alert>
              )}

              <h6>Timeline</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <small className="text-muted">
                    <strong>Programada:</strong> {formatDateTime(selectedAppointment.scheduledAt)}
                  </small>
                </li>
                {selectedAppointment.confirmedAt && (
                  <li className="mb-2">
                    <small className="text-success">
                      <strong>Confirmada:</strong> {formatDateTime(selectedAppointment.confirmedAt)}
                    </small>
                  </li>
                )}
                {selectedAppointment.completedAt && (
                  <li className="mb-2">
                    <small className="text-info">
                      <strong>Completada:</strong> {formatDateTime(selectedAppointment.completedAt)}
                    </small>
                  </li>
                )}
                {selectedAppointment.cancelledAt && (
                  <li className="mb-2">
                    <small className="text-danger">
                      <strong>Cancelada:</strong> {formatDateTime(selectedAppointment.cancelledAt)}
                    </small>
                  </li>
                )}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de cancelación */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <Alert variant="warning">
                <strong>¿Estás seguro de que quieres cancelar esta cita?</strong>
                <br />
                {selectedAppointment.property.title} - {formatDate(selectedAppointment.date)} a las {selectedAppointment.time}
              </Alert>
              
              <Form.Group>
                <Form.Label>Motivo de la cancelación *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Por favor explica el motivo de la cancelación..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No, mantener cita
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmCancelAppointment}
            disabled={!cancelReason.trim()}
          >
            Sí, cancelar cita
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentsPage;