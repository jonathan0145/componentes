import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, Modal, Alert, Form, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import {
  fetchAppointments,
  cancelAppointment,
  confirmAppointment,
  selectAppointments,
  selectAppointmentsLoading,
  selectAppointmentsError
} from '@store/slices/appointmentsSlice';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaPhone, FaCheckCircle, FaTimes, FaEdit, FaEye, FaCalendarCheck, FaCalendarTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AppointmentsPage = () => {
    // (Eliminado: no usar appointments antes de declararla)
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const appointments = useSelector(selectAppointments);
  // Mostrar en consola el array de citas para depuración (después de la declaración)
  if (appointments && appointments.length > 0) {
    // eslint-disable-next-line no-console
    console.log('Citas recibidas:', appointments);
    console.log('Rol actual:', currentUser?.role);
    appointments.forEach((apt, idx) => {
      console.log(`Cita #${idx + 1}: estado=${apt.status}, propiedad=${apt.property?.title}`);
    });
    // Log extra para ver el usuario y perfil de la primera cita
    if (appointments[0]?.user) {
      console.log('Usuario de la primera cita:', appointments[0].user);
      if (appointments[0].user.profile) {
        console.log('Perfil del usuario:', appointments[0].user.profile);
      } else {
        console.log('No hay perfil en appointments[0].user');
      }
    } else {
      console.log('No hay user en appointments[0]');
    }
  }
  const loading = useSelector(selectAppointmentsLoading);
  const error = useSelector(selectAppointmentsError);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
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
        return appointments.filter(apt => [
          'scheduled', 'confirmed', 'pending', 'pendiente'
        ].includes((apt.status || '').toLowerCase()));
      case 'completed':
        return appointments.filter(apt => (apt.status || '').toLowerCase() === 'completed' || (apt.status || '').toLowerCase() === 'completada');
      case 'cancelled':
        return appointments.filter(apt => (apt.status || '').toLowerCase() === 'cancelled' || (apt.status || '').toLowerCase() === 'cancelada');
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

    dispatch(cancelAppointment({ appointmentId: selectedAppointment.id, reason: cancelReason }))
      .unwrap()
      .then(() => {
        toast.success('Cita cancelada exitosamente');
        setShowCancelModal(false);
        setCancelReason('');
        setSelectedAppointment(null);
      })
      .catch((err) => {
        toast.error('Error al cancelar la cita: ' + err);
      });
  };

  const handleConfirmAppointment = (appointmentId) => {
    dispatch(confirmAppointment(appointmentId))
      .unwrap()
      .then(() => {
        toast.success('Cita confirmada exitosamente');
      })
      .catch((err) => {
        toast.error('Error al confirmar la cita: ' + err);
      });
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
      {loading.fetch && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <div>Cargando citas...</div>
        </div>
      )}
      {error && (
        <Alert variant="danger" className="my-3">
          Error: {error}
        </Alert>
      )}
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
                                {(() => {
                                  // Lógica robusta para obtener imagen
                                  let img = '';
                                  const fallback = 'https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FzYXxlbnwwfHwwfHx8MA%3D%3D';
                                  let imagesArr = appointment.property?.images;
                                  if (typeof imagesArr === 'string') {
                                    try {
                                      imagesArr = JSON.parse(imagesArr);
                                    } catch (e) {
                                      imagesArr = [];
                                    }
                                  }
                                  if (Array.isArray(imagesArr) && imagesArr.length > 0) {
                                    const firstImg = imagesArr[0];
                                    if (typeof firstImg === 'string' && firstImg.trim() !== '' && firstImg.trim().startsWith('http')) {
                                      img = firstImg.trim();
                                    } else if (firstImg && typeof firstImg === 'object' && typeof firstImg.url === 'string' && firstImg.url.trim().startsWith('http')) {
                                      img = firstImg.url.trim();
                                    } else {
                                      img = fallback;
                                    }
                                  } else if (appointment.property?.image && appointment.property.image.trim().startsWith('http')) {
                                    img = appointment.property.image.trim();
                                  } else {
                                    img = fallback;
                                  }
                                  return (
                                    <img
                                      src={img}
                                      alt={appointment.property && appointment.property.title ? appointment.property.title : 'Sin título'}
                                      className="img-fluid rounded mb-2"
                                      style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                                    />
                                  );
                                })()}
                                <h6 className="mb-1">{appointment.property && appointment.property.title ? appointment.property.title : 'Sin título'}</h6>
                                <small className="text-muted d-flex align-items-center">
                                  <FaMapMarkerAlt className="me-1" />
                                  {appointment.property && appointment.property.location ? appointment.property.location : 'Sin ubicación'}
                                </small>
                              </div>

                              <div className="mb-3">
                                <p className="mb-1">
                                  <FaCalendarAlt className="me-2 text-primary" />
                                  <strong>{formatDate(appointment.date)}</strong>
                                </p>
                                <p className="mb-1">
                                  <FaClock className="me-2 text-primary" />
                                  <strong>{appointment.time ? appointment.time : 'Sin hora'}</strong>
                                </p>
                                <p className="mb-0">
                                  <FaUser className="me-2 text-primary" />
                                  {appointment.user && appointment.user.profile
                                    ? `${appointment.user.profile.firstName || ''} ${appointment.user.profile.lastName || ''}`.trim() || appointment.user.name
                                    : appointment.user?.name || 'Sin nombre'}
                                </p>
                                <p className="mb-0">
                                  <FaUser className="me-2 text-warning" />
                                  <strong>Vendedor:</strong> {
                                    appointment.property && appointment.property.seller && appointment.property.seller.name
                                      ? appointment.property.seller.name
                                      : 'Sin vendedor'
                                  }
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
                                  <strong>Visitante:</strong> {appointment.user && appointment.user.profile
                                    ? `${appointment.user.profile.firstName || ''} ${appointment.user.profile.lastName || ''}`.trim() || appointment.user.name
                                    : appointment.user?.name || 'Sin nombre'}
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
                  {(() => {
                    let img = '';
                    const fallback = 'https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FzYXxlbnwwfHwwfHx8MA%3D%3D';
                    let imagesArr = selectedAppointment.property?.images;
                    if (typeof imagesArr === 'string') {
                      try {
                        imagesArr = JSON.parse(imagesArr);
                      } catch (e) {
                        imagesArr = [];
                      }
                    }
                    if (Array.isArray(imagesArr) && imagesArr.length > 0) {
                      const firstImg = imagesArr[0];
                      if (typeof firstImg === 'string' && firstImg.trim() !== '' && firstImg.trim().startsWith('http')) {
                        img = firstImg.trim();
                      } else if (firstImg && typeof firstImg === 'object' && typeof firstImg.url === 'string' && firstImg.url.trim().startsWith('http')) {
                        img = firstImg.url.trim();
                      } else {
                        img = fallback;
                      }
                    } else if (selectedAppointment.property?.image && selectedAppointment.property.image.trim().startsWith('http')) {
                      img = selectedAppointment.property.image.trim();
                    } else {
                      img = fallback;
                    }
                    return (
                      <img
                        src={img}
                        alt={selectedAppointment.property && selectedAppointment.property.title ? selectedAppointment.property.title : 'Sin título'}
                        className="img-fluid rounded"
                      />
                    );
                  })()}
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
                    <strong>Nombre:</strong> {
                      selectedAppointment.user && selectedAppointment.user.profile && (selectedAppointment.user.profile.firstName || selectedAppointment.user.profile.lastName)
                        ? `${selectedAppointment.user.profile.firstName || ''} ${selectedAppointment.user.profile.lastName || ''}`.trim()
                        : selectedAppointment.user?.name || 'Sin nombre'
                    }
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {
                      selectedAppointment.user && selectedAppointment.user.profile && selectedAppointment.user.profile.phone
                        ? selectedAppointment.user.profile.phone
                        : selectedAppointment.user?.phone || 'Sin teléfono'
                    }
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedAppointment.user?.email || 'Sin email'}
                  </p>
                </Col>
              </Row>

              {selectedAppointment.visitor && selectedAppointment.visitor.notes && (
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