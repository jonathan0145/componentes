import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import { 
  fetchAgentRequests, 
  fetchAvailableAgents,
  selectUserRequests, 
  selectAvailableAgents, 
  selectAgentsLoading,
  selectAgentStats
} from '@store/slices/agentsSlice';
import { FaUserTie, FaStar, FaMapMarkerAlt, FaBuilding, FaClock, FaCheck, FaTimes, FaEye, FaPhone, FaEnvelope, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AgentsPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const userRequests = useSelector(selectUserRequests);
  const availableAgents = useSelector(selectAvailableAgents);
  const loading = useSelector(selectAgentsLoading);
  const agentStats = useSelector(selectAgentStats);
  
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAgentProfile, setShowAgentProfile] = useState(false);

  useEffect(() => {
    dispatch(fetchAgentRequests());
    dispatch(fetchAvailableAgents({ location: '', propertyType: '' }));
  }, [dispatch]);

  const formatDate = (dateString) => {
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
      pending: { bg: 'warning', text: 'Pendiente', icon: <FaClock /> },
      accepted: { bg: 'success', text: 'Aceptada', icon: <FaCheck /> },
      rejected: { bg: 'danger', text: 'Rechazada', icon: <FaTimes /> },
      completed: { bg: 'info', text: 'Completada', icon: <FaCheck /> }
    };
    
    const statusConfig = config[status] || config.pending;
    
    return (
      <Badge bg={statusConfig.bg} className="d-flex align-items-center gap-1">
        {statusConfig.icon}
        {statusConfig.text}
      </Badge>
    );
  };

  const getStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning" />);
    }
    
    if (rating % 1 !== 0) {
      stars.push(<FaStar key="half" className="text-warning" style={{ opacity: 0.5 }} />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-muted" />);
    }
    
    return stars;
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const handleViewAgentProfile = (agent) => {
    setSelectedAgent(agent);
    setShowAgentProfile(true);
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>
                <FaUserTie className="me-2 text-primary" />
                Gestión de Agentes
              </h2>
              <p className="text-muted">
                Administra tus solicitudes de agentes y explora profesionales disponibles
              </p>
            </div>
          </div>

          {/* Estadísticas resumidas */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaChartLine size={32} className="text-primary mb-2" />
                  <h5>{agentStats.totalRequests}</h5>
                  <small className="text-muted">Solicitudes Totales</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaClock size={32} className="text-warning mb-2" />
                  <h5>{agentStats.pendingRequests}</h5>
                  <small className="text-muted">Pendientes</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaCheck size={32} className="text-success mb-2" />
                  <h5>{agentStats.acceptedRequests}</h5>
                  <small className="text-muted">Aceptadas</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaUserTie size={32} className="text-info mb-2" />
                  <h5>{agentStats.totalAgents}</h5>
                  <small className="text-muted">Agentes Disponibles</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="mb-4"
          >
            <Tab eventKey="requests" title={`Mis Solicitudes (${userRequests.length})`}>
              <Card>
                <Card.Body>
                  {loading.fetchingRequests ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" className="mb-3" />
                      <p>Cargando solicitudes...</p>
                    </div>
                  ) : userRequests.length > 0 ? (
                    <Row>
                      {userRequests.map(request => (
                        <Col md={6} lg={4} key={request.id} className="mb-4">
                          <Card className="h-100">
                            <Card.Body>
                              <div className="d-flex align-items-start mb-3">
                                <img
                                  src={request.agent.photo}
                                  alt={request.agent.name}
                                  className="rounded-circle me-3"
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                                <div className="flex-grow-1">
                                  <h6 className="mb-1">{request.agent.name}</h6>
                                  <small className="text-muted">{request.agent.company}</small>
                                  <div className="mt-1">
                                    {getStatusBadge(request.status)}
                                  </div>
                                </div>
                              </div>

                              <h6 className="mb-2">Propiedad de Interés</h6>
                              <p className="small mb-2">
                                <strong>{request.property.title}</strong>
                                <br />
                                <small className="text-muted">{request.property.location}</small>
                              </p>

                              <div className="mb-3">
                                <small className="text-muted">
                                  <strong>Solicitado:</strong> {formatDate(request.createdAt)}
                                </small>
                                {request.respondedAt && (
                                  <div>
                                    <small className="text-muted">
                                      <strong>Respondido:</strong> {formatDate(request.respondedAt)}
                                    </small>
                                  </div>
                                )}
                              </div>

                              {request.agentResponse && (
                                <Alert variant="success" className="small mb-3">
                                  <strong>Respuesta del agente:</strong>
                                  <br />
                                  {request.agentResponse}
                                </Alert>
                              )}

                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleViewRequest(request)}
                                >
                                  <FaEye className="me-1" />
                                  Ver
                                </Button>
                                {request.status === 'accepted' && (
                                  <>
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      onClick={() => window.open(`tel:${request.agent.phone || '+57 300 123 4567'}`)}
                                    >
                                      <FaPhone />
                                    </Button>
                                    <Button
                                      variant="outline-info"
                                      size="sm"
                                      onClick={() => window.open(`mailto:${request.agent.email || 'agente@email.com'}`)}
                                    >
                                      <FaEnvelope />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <FaUserTie size={48} className="text-muted mb-3" />
                      <h5>No has solicitado agentes</h5>
                      <p className="text-muted">
                        Cuando solicites la asesoría de agentes inmobiliarios, aparecerán aquí.
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="available" title={`Agentes Disponibles (${availableAgents.length})`}>
              <Card>
                <Card.Body>
                  {loading.fetchingAgents ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" className="mb-3" />
                      <p>Cargando agentes disponibles...</p>
                    </div>
                  ) : availableAgents.length > 0 ? (
                    <Row>
                      {availableAgents.map(agent => (
                        <Col md={6} lg={4} key={agent.id} className="mb-4">
                          <Card className="h-100">
                            <Card.Body>
                              <div className="d-flex align-items-start mb-3">
                                <img
                                  src={agent.photo}
                                  alt={agent.name}
                                  className="rounded-circle me-3"
                                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                />
                                <div className="flex-grow-1">
                                  <h6 className="mb-1">{agent.name}</h6>
                                  <small className="text-muted d-flex align-items-center gap-1">
                                    <FaBuilding size={12} />
                                    {agent.company}
                                  </small>
                                  <div className="d-flex align-items-center gap-2 mt-1">
                                    <div className="d-flex">
                                      {getStarRating(agent.rating)}
                                    </div>
                                    <span className="small fw-bold">{agent.rating}</span>
                                    <small className="text-muted">({agent.reviews})</small>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-2">
                                <small className="text-muted d-flex align-items-center gap-1">
                                  <FaMapMarkerAlt size={12} />
                                  {agent.location}
                                </small>
                                <small className="text-muted">
                                  <strong>Experiencia:</strong> {agent.experience}
                                </small>
                              </div>

                              <div className="mb-3">
                                <small className="text-muted d-block mb-1">Especialidades:</small>
                                <div className="d-flex flex-wrap gap-1">
                                  {agent.specialties.slice(0, 2).map((specialty, index) => (
                                    <Badge key={index} bg="light" text="dark" className="small">
                                      {specialty}
                                    </Badge>
                                  ))}
                                  {agent.specialties.length > 2 && (
                                    <Badge bg="light" text="dark" className="small">
                                      +{agent.specialties.length - 2} más
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleViewAgentProfile(agent)}
                                >
                                  <FaEye className="me-1" />
                                  Ver Perfil
                                </Button>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => window.open(`tel:${agent.phone}`)}
                                >
                                  <FaPhone />
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <FaUserTie size={48} className="text-muted mb-3" />
                      <h5>No hay agentes disponibles</h5>
                      <p className="text-muted">
                        Actualmente no hay agentes disponibles en tu zona.
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Modal de detalles de solicitud */}
      <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <>
              <Row>
                <Col md={6}>
                  <h6>Información del Agente</h6>
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={selectedRequest.agent.photo}
                      alt={selectedRequest.agent.name}
                      className="rounded-circle me-3"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-1">{selectedRequest.agent.name}</h6>
                      <small className="text-muted">{selectedRequest.agent.company}</small>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <h6>Estado de la Solicitud</h6>
                  <div className="mb-3">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </Col>
              </Row>

              <h6>Propiedad de Interés</h6>
              <p>
                <strong>{selectedRequest.property.title}</strong>
                <br />
                <small className="text-muted">{selectedRequest.property.location}</small>
              </p>

              <h6>Mensaje Enviado</h6>
              <p className="bg-light p-3 rounded">{selectedRequest.message}</p>

              {selectedRequest.agentResponse && (
                <>
                  <h6>Respuesta del Agente</h6>
                  <Alert variant="success">
                    {selectedRequest.agentResponse}
                  </Alert>
                </>
              )}

              <h6>Fechas</h6>
              <p>
                <strong>Solicitado:</strong> {formatDate(selectedRequest.createdAt)}
                <br />
                {selectedRequest.respondedAt && (
                  <>
                    <strong>Respondido:</strong> {formatDate(selectedRequest.respondedAt)}
                  </>
                )}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de perfil de agente */}
      <Modal show={showAgentProfile} onHide={() => setShowAgentProfile(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Perfil del Agente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAgent && (
            <>
              <div className="text-center mb-4">
                <img
                  src={selectedAgent.photo}
                  alt={selectedAgent.name}
                  className="rounded-circle mb-3"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <h4>{selectedAgent.name}</h4>
                <p className="text-muted">{selectedAgent.company}</p>
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <div className="d-flex">
                    {getStarRating(selectedAgent.rating)}
                  </div>
                  <span className="fw-bold">{selectedAgent.rating}</span>
                  <span className="text-muted">({selectedAgent.reviews} reseñas)</span>
                </div>
              </div>

              <Row>
                <Col md={6}>
                  <h6>Información Profesional</h6>
                  <p>
                    <strong>Licencia:</strong> {selectedAgent.license}<br />
                    <strong>Experiencia:</strong> {selectedAgent.experience}<br />
                    <strong>Ubicación:</strong> {selectedAgent.location}<br />
                    <strong>Comisión:</strong> {selectedAgent.fee}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Métricas</h6>
                  <p>
                    <strong>Tiempo de respuesta:</strong> {selectedAgent.responseTime}<br />
                    <strong>Tasa de éxito:</strong> {selectedAgent.successRate}%<br />
                    <strong>Idiomas:</strong> {selectedAgent.languages.join(', ')}
                  </p>
                </Col>
              </Row>

              <h6>Descripción</h6>
              <p>{selectedAgent.description}</p>

              <h6>Especialidades</h6>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {selectedAgent.specialties.map((specialty, index) => (
                  <Badge key={index} bg="primary" className="p-2">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <h6>Contacto</h6>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => window.open(`tel:${selectedAgent.phone}`)}
                >
                  <FaPhone className="me-2" />
                  {selectedAgent.phone}
                </Button>
                <Button
                  variant="outline-info"
                  onClick={() => window.open(`mailto:${selectedAgent.email}`)}
                >
                  <FaEnvelope className="me-2" />
                  Email
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAgentProfile(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AgentsPage;