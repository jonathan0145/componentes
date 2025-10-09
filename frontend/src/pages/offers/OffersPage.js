import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Modal, Alert, Form, Tabs, Tab } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import { FaEye, FaCheck, FaTimes, FaFileContract, FaClock, FaHandshake } from 'react-icons/fa';
import { toast } from 'react-toastify';

const OffersPage = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState('sent');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseType, setResponseType] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [counterOfferAmount, setCounterOfferAmount] = useState('');

  // Datos de ejemplo de ofertas enviadas (para compradores)
  const [sentOffers, setSentOffers] = useState([
    {
      id: 1,
      property: {
        id: 1,
        title: 'Apartamento Moderno Zona Norte',
        location: 'Bogotá, Zona Norte',
        price: 350000000,
        image: 'https://via.placeholder.com/100x80?text=Apt1'
      },
      amount: 320000000,
      status: 'pending',
      submittedAt: new Date(Date.now() - 86400000), // Ayer
      validUntil: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // En 6 días
      paymentTerms: 'financing',
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      seller: { name: 'María González', phone: '+57 300 123 4567' }
    },
    {
      id: 2,
      property: {
        id: 2,
        title: 'Casa Familiar con Jardín',
        location: 'Medellín, El Poblado',
        price: 580000000,
        image: 'https://via.placeholder.com/100x80?text=Casa1'
      },
      amount: 550000000,
      status: 'accepted',
      submittedAt: new Date(Date.now() - 172800000), // Hace 2 días
      validUntil: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      paymentTerms: 'cash',
      closingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      seller: { name: 'Carlos Rodríguez', phone: '+57 301 987 6543' },
      acceptedAt: new Date(Date.now() - 86400000)
    },
    {
      id: 3,
      property: {
        id: 3,
        title: 'Oficina Ejecutiva Centro',
        location: 'Bogotá, Centro',
        price: 420000000,
        image: 'https://via.placeholder.com/100x80?text=Ofi1'
      },
      amount: 380000000,
      status: 'rejected',
      submittedAt: new Date(Date.now() - 259200000), // Hace 3 días
      validUntil: new Date(Date.now() - 86400000), // Ayer (expirada)
      paymentTerms: 'mixed',
      closingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      seller: { name: 'Ana Martínez', phone: '+57 302 555 7890' },
      rejectedAt: new Date(Date.now() - 172800000),
      rejectionReason: 'Oferta muy baja, esperamos al menos el 95% del precio de lista'
    }
  ]);

  // Datos de ejemplo de ofertas recibidas (para vendedores)
  const [receivedOffers, setReceivedOffers] = useState([
    {
      id: 4,
      property: {
        id: 4,
        title: 'Mi Apartamento en Chapinero',
        location: 'Bogotá, Chapinero',
        price: 450000000,
        image: 'https://via.placeholder.com/100x80?text=MyApt'
      },
      amount: 430000000,
      status: 'pending',
      submittedAt: new Date(Date.now() - 43200000), // Hace 12 horas
      validUntil: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      paymentTerms: 'financing',
      closingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      buyer: { name: 'Roberto Silva', email: 'roberto@email.com', phone: '+57 315 444 2233' },
      conditions: 'Sujeto a inspección técnica y revisión de documentos legales'
    },
    {
      id: 5,
      property: {
        id: 5,
        title: 'Casa en La Calera',
        location: 'Cundinamarca, La Calera',
        price: 680000000,
        image: 'https://via.placeholder.com/100x80?text=Casa2'
      },
      amount: 650000000,
      status: 'pending',
      submittedAt: new Date(Date.now() - 86400000),
      validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      paymentTerms: 'cash',
      closingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      buyer: { name: 'Carmen Pérez', email: 'carmen@email.com', phone: '+57 320 111 2222' },
      conditions: 'Pago de contado, firma inmediata'
    }
  ]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'warning', text: 'Pendiente', icon: <FaClock /> },
      accepted: { bg: 'success', text: 'Aceptada', icon: <FaCheck /> },
      rejected: { bg: 'danger', text: 'Rechazada', icon: <FaTimes /> },
      countered: { bg: 'info', text: 'Contraoferta', icon: <FaHandshake /> }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge bg={config.bg} className="d-flex align-items-center gap-1">
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  const getOfferPercentage = (offerAmount, listPrice) => {
    return ((offerAmount / listPrice) * 100).toFixed(1);
  };

  const handleViewOffer = (offer) => {
    setSelectedOffer(offer);
    setShowOfferModal(true);
  };

  const handleRespondToOffer = (offer, type) => {
    setSelectedOffer(offer);
    setResponseType(type);
    setResponseMessage('');
    setCounterOfferAmount(type === 'counter' ? offer.amount.toString() : '');
    setShowResponseModal(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedOffer) return;

    try {
      // Aquí iría la llamada a la API
      // await dispatch(respondToOffer({
      //   offerId: selectedOffer.id,
      //   response: responseType,
      //   message: responseMessage,
      //   counterAmount: responseType === 'counter' ? parseFloat(counterOfferAmount) : null
      // })).unwrap();

      // Simular respuesta
      const updatedOffer = {
        ...selectedOffer,
        status: responseType === 'accept' ? 'accepted' : responseType === 'reject' ? 'rejected' : 'countered',
        respondedAt: new Date(),
        response: responseMessage,
        counterAmount: responseType === 'counter' ? parseFloat(counterOfferAmount) : null
      };

      setReceivedOffers(prev => 
        prev.map(offer => 
          offer.id === selectedOffer.id ? updatedOffer : offer
        )
      );

      toast.success(`Oferta ${responseType === 'accept' ? 'aceptada' : responseType === 'reject' ? 'rechazada' : 'respondida con contraoferta'} exitosamente`);
      setShowResponseModal(false);
    } catch (error) {
      toast.error('Error al responder la oferta');
    }
  };

  const isOfferExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  const getTimeRemaining = (validUntil) => {
    const now = new Date();
    const expiry = new Date(validUntil);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expirada';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} día${days > 1 ? 's' : ''}`;
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>
                <FaFileContract className="me-2 text-primary" />
                Gestión de Ofertas
              </h2>
              <p className="text-muted">
                Administra las ofertas {currentUser?.role === 'buyer' ? 'enviadas' : 'recibidas'}
              </p>
            </div>
          </div>

          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="mb-4"
          >
            {currentUser?.role === 'buyer' && (
              <Tab eventKey="sent" title={`Ofertas Enviadas (${sentOffers.length})`}>
                <Card>
                  <Card.Body>
                    {sentOffers.length > 0 ? (
                      <div className="table-responsive">
                        <Table hover>
                          <thead>
                            <tr>
                              <th>Propiedad</th>
                              <th>Oferta</th>
                              <th>Estado</th>
                              <th>Válida hasta</th>
                              <th>Enviada</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sentOffers.map(offer => (
                              <tr key={offer.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={offer.property.image}
                                      alt={offer.property.title}
                                      className="rounded me-3"
                                      style={{ width: '60px', height: '45px', objectFit: 'cover' }}
                                    />
                                    <div>
                                      <div className="fw-bold">{offer.property.title}</div>
                                      <small className="text-muted">{offer.property.location}</small>
                                      <br />
                                      <small className="text-success">
                                        Lista: {formatPrice(offer.property.price)}
                                      </small>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="fw-bold text-primary">
                                    {formatPrice(offer.amount)}
                                  </div>
                                  <small className="text-muted">
                                    {getOfferPercentage(offer.amount, offer.property.price)}% del precio lista
                                  </small>
                                </td>
                                <td>{getStatusBadge(offer.status)}</td>
                                <td>
                                  <div className={isOfferExpired(offer.validUntil) ? 'text-danger' : 'text-muted'}>
                                    {formatDate(offer.validUntil)}
                                  </div>
                                  <small className={isOfferExpired(offer.validUntil) ? 'text-danger' : 'text-info'}>
                                    {getTimeRemaining(offer.validUntil)}
                                  </small>
                                </td>
                                <td>
                                  <small className="text-muted">
                                    {formatDate(offer.submittedAt)}
                                  </small>
                                </td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleViewOffer(offer)}
                                  >
                                    <FaEye className="me-1" />
                                    Ver
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <FaFileContract size={48} className="text-muted mb-3" />
                        <h5>No has enviado ofertas</h5>
                        <p className="text-muted">
                          Cuando envíes ofertas en propiedades, aparecerán aquí.
                        </p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>
            )}

            {(currentUser?.role === 'seller' || currentUser?.role === 'agent') && (
              <Tab eventKey="received" title={`Ofertas Recibidas (${receivedOffers.length})`}>
                <Card>
                  <Card.Body>
                    {receivedOffers.length > 0 ? (
                      <div className="table-responsive">
                        <Table hover>
                          <thead>
                            <tr>
                              <th>Propiedad</th>
                              <th>Comprador</th>
                              <th>Oferta</th>
                              <th>Estado</th>
                              <th>Válida hasta</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {receivedOffers.map(offer => (
                              <tr key={offer.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={offer.property.image}
                                      alt={offer.property.title}
                                      className="rounded me-3"
                                      style={{ width: '60px', height: '45px', objectFit: 'cover' }}
                                    />
                                    <div>
                                      <div className="fw-bold">{offer.property.title}</div>
                                      <small className="text-muted">{offer.property.location}</small>
                                      <br />
                                      <small className="text-success">
                                        Lista: {formatPrice(offer.property.price)}
                                      </small>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="fw-bold">{offer.buyer.name}</div>
                                  <small className="text-muted">{offer.buyer.email}</small>
                                </td>
                                <td>
                                  <div className="fw-bold text-primary">
                                    {formatPrice(offer.amount)}
                                  </div>
                                  <small className="text-muted">
                                    {getOfferPercentage(offer.amount, offer.property.price)}% del precio lista
                                  </small>
                                </td>
                                <td>{getStatusBadge(offer.status)}</td>
                                <td>
                                  <div className={isOfferExpired(offer.validUntil) ? 'text-danger' : 'text-muted'}>
                                    {formatDate(offer.validUntil)}
                                  </div>
                                  <small className={isOfferExpired(offer.validUntil) ? 'text-danger' : 'text-info'}>
                                    {getTimeRemaining(offer.validUntil)}
                                  </small>
                                </td>
                                <td>
                                  <div className="d-flex gap-1">
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => handleViewOffer(offer)}
                                    >
                                      <FaEye />
                                    </Button>
                                    {offer.status === 'pending' && !isOfferExpired(offer.validUntil) && (
                                      <>
                                        <Button
                                          variant="outline-success"
                                          size="sm"
                                          onClick={() => handleRespondToOffer(offer, 'accept')}
                                        >
                                          <FaCheck />
                                        </Button>
                                        <Button
                                          variant="outline-warning"
                                          size="sm"
                                          onClick={() => handleRespondToOffer(offer, 'counter')}
                                        >
                                          <FaHandshake />
                                        </Button>
                                        <Button
                                          variant="outline-danger"
                                          size="sm"
                                          onClick={() => handleRespondToOffer(offer, 'reject')}
                                        >
                                          <FaTimes />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <FaFileContract size={48} className="text-muted mb-3" />
                        <h5>No has recibido ofertas</h5>
                        <p className="text-muted">
                          Cuando recibas ofertas en tus propiedades, aparecerán aquí.
                        </p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>
            )}
          </Tabs>
        </Col>
      </Row>

      {/* Modal de detalles de oferta */}
      <Modal show={showOfferModal} onHide={() => setShowOfferModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Oferta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOffer && (
            <>
              {/* Información de la propiedad */}
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    <Col md={3}>
                      <img
                        src={selectedOffer.property.image}
                        alt={selectedOffer.property.title}
                        className="img-fluid rounded"
                      />
                    </Col>
                    <Col md={9}>
                      <h5>{selectedOffer.property.title}</h5>
                      <p className="text-muted">{selectedOffer.property.location}</p>
                      <h6 className="text-success">
                        Precio de lista: {formatPrice(selectedOffer.property.price)}
                      </h6>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Detalles de la oferta */}
              <Row>
                <Col md={6}>
                  <h6>Información de la Oferta</h6>
                  <p><strong>Monto:</strong> {formatPrice(selectedOffer.amount)}</p>
                  <p><strong>Porcentaje del precio lista:</strong> {getOfferPercentage(selectedOffer.amount, selectedOffer.property.price)}%</p>
                  <p><strong>Términos de pago:</strong> {selectedOffer.paymentTerms}</p>
                  <p><strong>Fecha de cierre:</strong> {formatDate(selectedOffer.closingDate)}</p>
                  <p><strong>Estado:</strong> {getStatusBadge(selectedOffer.status)}</p>
                </Col>
                <Col md={6}>
                  <h6>Fechas Importantes</h6>
                  <p><strong>Enviada:</strong> {formatDate(selectedOffer.submittedAt)}</p>
                  <p><strong>Válida hasta:</strong> {formatDate(selectedOffer.validUntil)}</p>
                  {selectedOffer.acceptedAt && (
                    <p><strong>Aceptada:</strong> {formatDate(selectedOffer.acceptedAt)}</p>
                  )}
                  {selectedOffer.rejectedAt && (
                    <p><strong>Rechazada:</strong> {formatDate(selectedOffer.rejectedAt)}</p>
                  )}
                </Col>
              </Row>

              {selectedOffer.conditions && (
                <div className="mt-3">
                  <h6>Condiciones</h6>
                  <p>{selectedOffer.conditions}</p>
                </div>
              )}

              {selectedOffer.rejectionReason && (
                <Alert variant="danger">
                  <strong>Motivo del rechazo:</strong> {selectedOffer.rejectionReason}
                </Alert>
              )}

              {/* Información del comprador (para vendedores) */}
              {selectedOffer.buyer && (
                <div className="mt-3">
                  <h6>Información del Comprador</h6>
                  <p><strong>Nombre:</strong> {selectedOffer.buyer.name}</p>
                  <p><strong>Email:</strong> {selectedOffer.buyer.email}</p>
                  <p><strong>Teléfono:</strong> {selectedOffer.buyer.phone}</p>
                </div>
              )}

              {/* Información del vendedor (para compradores) */}
              {selectedOffer.seller && (
                <div className="mt-3">
                  <h6>Información del Vendedor</h6>
                  <p><strong>Nombre:</strong> {selectedOffer.seller.name}</p>
                  <p><strong>Teléfono:</strong> {selectedOffer.seller.phone}</p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOfferModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de respuesta a oferta */}
      <Modal show={showResponseModal} onHide={() => setShowResponseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {responseType === 'accept' && 'Aceptar Oferta'}
            {responseType === 'reject' && 'Rechazar Oferta'}
            {responseType === 'counter' && 'Contraoferta'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOffer && (
            <>
              <p><strong>Propiedad:</strong> {selectedOffer.property.title}</p>
              <p><strong>Oferta original:</strong> {formatPrice(selectedOffer.amount)}</p>
              
              {responseType === 'counter' && (
                <Form.Group className="mb-3">
                  <Form.Label>Nueva Oferta</Form.Label>
                  <Form.Control
                    type="number"
                    value={counterOfferAmount}
                    onChange={(e) => setCounterOfferAmount(e.target.value)}
                    placeholder="Ingresa tu contraoferta"
                  />
                </Form.Group>
              )}

              <Form.Group>
                <Form.Label>Mensaje {responseType === 'accept' ? '(opcional)' : ''}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder={
                    responseType === 'accept' 
                      ? 'Mensaje para el comprador...' 
                      : responseType === 'reject'
                      ? 'Explica el motivo del rechazo...'
                      : 'Explica tu contraoferta...'
                  }
                  required={responseType !== 'accept'}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResponseModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant={responseType === 'accept' ? 'success' : responseType === 'reject' ? 'danger' : 'warning'}
            onClick={handleSubmitResponse}
            disabled={responseType !== 'accept' && !responseMessage.trim()}
          >
            {responseType === 'accept' && 'Aceptar Oferta'}
            {responseType === 'reject' && 'Rechazar Oferta'}
            {responseType === 'counter' && 'Enviar Contraoferta'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OffersPage;