import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card, ListGroup, Badge, Button, Dropdown } from 'react-bootstrap';
import { FaBell, FaEnvelope, FaCheckCircle, FaTimesCircle, FaTrashAlt } from 'react-icons/fa';

// Simulación de notificaciones (en producción vendrían de la API/socket)
const mockNotifications = [
  {
    id: 1,
    type: 'chat',
    title: 'Nuevo mensaje en Chat',
    description: 'Tienes un nuevo mensaje de Juan Pérez',
    timestamp: '2025-10-09 10:15',
    read: false
  },
  {
    id: 2,
    type: 'offer',
    title: 'Nueva oferta recibida',
    description: 'Has recibido una oferta formal en la propiedad #123',
    timestamp: '2025-10-09 09:50',
    read: false
  },
  {
    id: 3,
    type: 'system',
    title: 'Verificación completada',
    description: 'Tu cuenta ha sido verificada exitosamente',
    timestamp: '2025-10-08 18:30',
    read: true
  }
];

const NotificationCenter = () => {
  // En producción, usaría Redux y socket para notificaciones
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simular carga inicial
    setNotifications(mockNotifications);
  }, []);

  // Contador de no leídos
  const unreadCount = notifications.filter(n => !n.read).length;

  // Marcar como leído
  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Eliminar notificación
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Filtrar notificaciones
  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>
            <FaBell className="me-2" /> Centro de Notificaciones
            {unreadCount > 0 && (
              <Badge bg="danger" className="ms-2">{unreadCount} sin leer</Badge>
            )}
          </h2>
          <p className="text-muted">Todas tus notificaciones recientes y su historial.</p>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Dropdown onSelect={setFilter}>
            <Dropdown.Toggle variant="outline-primary" id="dropdown-filter">
              Filtrar: {filter === 'all' ? 'Todas' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="all">Todas</Dropdown.Item>
              <Dropdown.Item eventKey="chat">Chat</Dropdown.Item>
              <Dropdown.Item eventKey="offer">Ofertas</Dropdown.Item>
              <Dropdown.Item eventKey="system">Sistema</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <strong>Notificaciones</strong>
            </Card.Header>
            <ListGroup variant="flush">
              {filteredNotifications.length === 0 && (
                <ListGroup.Item className="text-center text-muted">
                  No hay notificaciones.
                </ListGroup.Item>
              )}
              {filteredNotifications.map(n => (
                <ListGroup.Item key={n.id} className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="mb-1">
                      {n.type === 'chat' && <FaBell className="me-1 text-primary" />}
                      {n.type === 'offer' && <FaEnvelope className="me-1 text-success" />}
                      {n.type === 'system' && <FaCheckCircle className="me-1 text-info" />}
                      {n.title}
                      {!n.read && <Badge bg="warning" className="ms-2">Nuevo</Badge>}
                    </h6>
                    <small className="text-muted">{n.description}</small>
                  </div>
                  <div className="d-flex align-items-center">
                    {!n.read && (
                      <Button size="sm" variant="outline-success" className="me-2" onClick={() => markAsRead(n.id)}>
                        Marcar como leído
                      </Button>
                    )}
                    <Button size="sm" variant="outline-danger" onClick={() => deleteNotification(n.id)}>
                      <FaTrashAlt />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotificationCenter;
