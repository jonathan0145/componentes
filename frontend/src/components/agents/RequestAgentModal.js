import React, { useState, useEffect } from 'react';
import { Modal, Card, Button, Form, Badge, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaUserTie, FaStar, FaMapMarkerAlt, FaBuilding, FaCertificate, FaPhone, FaEnvelope, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const RequestAgentModal = ({ show, onHide, property, onAgentRequested }) => {
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [loadingAgents, setLoadingAgents] = useState(true);

  // Cargar agentes disponibles cuando se abre el modal
  useEffect(() => {
    if (show) {
      loadAvailableAgents();
      setRequestMessage(
        `Hola, me interesa la propiedad "${property?.title}" y me gustaría contar con sus servicios profesionales para esta transacción.`
      );
    }
  }, [show, property]);

  const loadAvailableAgents = async () => {
    setLoadingAgents(true);
    try {
      // Aquí iría la llamada a la API para obtener agentes disponibles en la zona
      // await agentsAPI.getAvailableAgents(property.location)
      
      // Datos simulados de agentes
      const mockAgents = [
        {
          id: 1,
          name: 'María González Rodríguez',
          company: 'Inmobiliaria Premium',
          license: 'LIC-2023-001',
          rating: 4.8,
          reviews: 127,
          specialties: ['Apartamentos', 'Casas Familiares'],
          location: 'Bogotá, Zona Norte',
          experience: '8 años',
          phone: '+57 300 123 4567',
          email: 'maria.gonzalez@premium.com',
          photo: 'https://via.placeholder.com/80x80?text=MG',
          verified: true,
          description: 'Especialista en propiedades residenciales de alta gama. Amplia experiencia en negociación y cierre de ventas.',
          languages: ['Español', 'Inglés'],
          fee: '3%',
          responseTime: '< 2 horas',
          successRate: 95
        },
        {
          id: 2,
          name: 'Carlos Mendoza Silva',
          company: 'Realty Expert',
          license: 'LIC-2022-045',
          rating: 4.6,
          reviews: 89,
          specialties: ['Oficinas', 'Locales Comerciales'],
          location: 'Bogotá, Centro',
          experience: '12 años',
          phone: '+57 301 987 6543',
          email: 'carlos.mendoza@realtyexpert.com',
          photo: 'https://via.placeholder.com/80x80?text=CM',
          verified: true,
          description: 'Experto en propiedades comerciales e inversión inmobiliaria. Asesoría integral en transacciones complejas.',
          languages: ['Español'],
          fee: '2.5%',
          responseTime: '< 4 horas',
          successRate: 92
        },
        {
          id: 3,
          name: 'Ana Patricia Ruiz',
          company: 'Century 21 Colombia',
          license: 'LIC-2021-123',
          rating: 4.9,
          reviews: 203,
          specialties: ['Casas', 'Terrenos', 'Proyectos'],
          location: 'Medellín, El Poblado',
          experience: '15 años',
          phone: '+57 315 555 7890',
          email: 'ana.ruiz@century21.com',
          photo: 'https://via.placeholder.com/80x80?text=AR',
          verified: true,
          description: 'Líder en ventas con reconocimiento nacional. Especializada en propiedades familiares y desarrollo de proyectos.',
          languages: ['Español', 'Inglés', 'Portugués'],
          fee: '3.5%',
          responseTime: '< 1 hora',
          successRate: 98
        },
        {
          id: 4,
          name: 'Roberto Jiménez Torres',
          company: 'MaxiCasa Realty',
          license: 'LIC-2023-067',
          rating: 4.4,
          reviews: 56,
          specialties: ['Apartamentos', 'Inversión'],
          location: 'Bogotá, Chapinero',
          experience: '5 años',
          phone: '+57 320 111 2222',
          email: 'roberto.jimenez@maxicasa.com',
          photo: 'https://via.placeholder.com/80x80?text=RJ',
          verified: false,
          description: 'Agente joven y dinámico, especializado en propiedades para jóvenes profesionales e inversión rentable.',
          languages: ['Español'],
          fee: '2%',
          responseTime: '< 6 horas',
          successRate: 87
        }
      ];

      // Filtrar agentes por ubicación similar o especialidad
      const filteredAgents = mockAgents.filter(agent => 
        agent.location.includes(property?.location?.split(',')[0] || '') ||
        agent.specialties.some(specialty => 
          property?.type?.toLowerCase().includes(specialty.toLowerCase())
        )
      );

      setAgents(filteredAgents.length > 0 ? filteredAgents : mockAgents);
    } catch (error) {
      toast.error('Error al cargar agentes disponibles');
      setAgents([]);
    } finally {
      setLoadingAgents(false);
    }
  };

  const handleRequestAgent = async () => {
    if (!selectedAgent) {
      toast.warning('Por favor selecciona un agente');
      return;
    }

    if (!requestMessage.trim()) {
      toast.warning('Por favor escribe un mensaje para el agente');
      return;
    }

    setLoading(true);
    try {
      // Aquí iría la llamada a la API para enviar la solicitud
      // await agentsAPI.requestAgent({
      //   agentId: selectedAgent.id,
      //   propertyId: property.id,
      //   message: requestMessage
      // });

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`Solicitud enviada a ${selectedAgent.name}. Te contactará pronto.`);
      onAgentRequested?.(selectedAgent);
      onHide();
      
      // Reset estado
      setSelectedAgent(null);
      setRequestMessage('');
    } catch (error) {
      toast.error('Error al enviar la solicitud al agente');
    } finally {
      setLoading(false);
    }
  };

  const handleAgentSelect = (agent) => {
    setSelectedAgent(selectedAgent?.id === agent.id ? null : agent);
  };

  const getStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-warning" style={{ opacity: 0.5 }} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-muted" />);
    }

    return stars;
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaUserTie className="me-2 text-primary" />
          Solicitar Agente Inmobiliario
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {property && (
          <Alert variant="info" className="mb-4">
            <h6 className="mb-2">Propiedad de Interés</h6>
            <strong>{property.title}</strong> - {property.location}
            <br />
            <small>Un agente profesional te ayudará con esta transacción inmobiliaria</small>
          </Alert>
        )}

        {loadingAgents ? (
          <div className="text-center py-5">
            <Spinner animation="border" className="mb-3" />
            <p>Buscando agentes disponibles en tu zona...</p>
          </div>
        ) : agents.length === 0 ? (
          <Alert variant="warning">
            No se encontraron agentes disponibles en este momento. 
            Por favor intenta más tarde o contacta directamente al vendedor.
          </Alert>
        ) : (
          <>
            <h6 className="mb-3">Agentes Disponibles ({agents.length})</h6>
            <Row>
              {agents.map(agent => (
                <Col md={6} key={agent.id} className="mb-4">
                  <Card 
                    className={`h-100 ${selectedAgent?.id === agent.id ? 'border-primary shadow-sm' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleAgentSelect(agent)}
                  >
                    <Card.Body>
                      <div className="d-flex align-items-start mb-3">
                        <img
                          src={agent.photo}
                          alt={agent.name}
                          className="rounded-circle me-3"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <h6 className="mb-0">{agent.name}</h6>
                            {agent.verified && (
                              <Badge bg="success" className="d-flex align-items-center gap-1">
                                <FaCheck size={10} />
                                Verificado
                              </Badge>
                            )}
                          </div>
                          <small className="text-muted d-flex align-items-center gap-1">
                            <FaBuilding size={12} />
                            {agent.company}
                          </small>
                          <small className="text-muted d-flex align-items-center gap-1">
                            <FaCertificate size={12} />
                            Lic. {agent.license}
                          </small>
                        </div>
                        {selectedAgent?.id === agent.id && (
                          <FaCheck className="text-primary" size={20} />
                        )}
                      </div>

                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="d-flex">
                          {getStarRating(agent.rating)}
                        </div>
                        <span className="fw-bold">{agent.rating}</span>
                        <small className="text-muted">({agent.reviews} reseñas)</small>
                      </div>

                      <p className="small text-muted mb-2">{agent.description}</p>

                      <div className="mb-2">
                        <small className="text-muted d-block">Especialidades:</small>
                        <div className="d-flex flex-wrap gap-1">
                          {agent.specialties.map((specialty, index) => (
                            <Badge key={index} bg="light" text="dark" className="small">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Row className="g-2 small">
                        <Col sm={6}>
                          <FaMapMarkerAlt className="text-muted me-1" />
                          {agent.location}
                        </Col>
                        <Col sm={6}>
                          <strong>Experiencia:</strong> {agent.experience}
                        </Col>
                        <Col sm={6}>
                          <strong>Comisión:</strong> {agent.fee}
                        </Col>
                        <Col sm={6}>
                          <strong>Respuesta:</strong> {agent.responseTime}
                        </Col>
                        <Col sm={6}>
                          <strong>Éxito:</strong> {agent.successRate}%
                        </Col>
                        <Col sm={6}>
                          <strong>Idiomas:</strong> {agent.languages.join(', ')}
                        </Col>
                      </Row>

                      {selectedAgent?.id === agent.id && (
                        <div className="mt-3 pt-3 border-top">
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${agent.phone}`);
                              }}
                            >
                              <FaPhone className="me-1" />
                              Llamar
                            </Button>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`mailto:${agent.email}`);
                              }}
                            >
                              <FaEnvelope className="me-1" />
                              Email
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {selectedAgent && (
              <div className="mt-4 p-3 bg-light rounded">
                <h6>Mensaje para {selectedAgent.name}</h6>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Escribe un mensaje personalizado para el agente..."
                  />
                  <Form.Text className="text-muted">
                    Describe tu situación, presupuesto y cualquier información relevante que ayude al agente.
                  </Form.Text>
                </Form.Group>
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        {selectedAgent && (
          <Button 
            variant="primary" 
            onClick={handleRequestAgent}
            disabled={loading || !requestMessage.trim()}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Enviando Solicitud...
              </>
            ) : (
              <>
                <FaUserTie className="me-1" />
                Solicitar Agente
              </>
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default RequestAgentModal;