import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Form, Badge } from 'react-bootstrap';
import { FaChartBar, FaClipboardList, FaRobot, FaTools } from 'react-icons/fa';

// Datos simulados para el dashboard
const stats = {
  totalConversations: 42,
  avgResponseTime: '2m 15s',
  messagesSent: 312,
  activeClients: 18,
  propertiesManaged: 12,
  automatedReplies: 5
};

const activityReports = [
  { date: '2025-10-01', conversations: 8, messages: 54, newClients: 2 },
  { date: '2025-10-02', conversations: 6, messages: 41, newClients: 1 },
  { date: '2025-10-03', conversations: 10, messages: 67, newClients: 3 },
  { date: '2025-10-04', conversations: 7, messages: 48, newClients: 2 },
];

const quickReplies = [
  '¡Hola! ¿En qué puedo ayudarte?',
  'Te envío la información solicitada.',
  '¿Quieres agendar una visita?',
  'La propiedad sigue disponible.',
  '¿Prefieres que te contacte por teléfono?'
];

const AgentAnalyticsDashboard = () => {
  const [replies, setReplies] = useState(quickReplies);
  const [newReply, setNewReply] = useState('');

  const handleAddReply = e => {
    e.preventDefault();
    if (newReply.trim()) {
      setReplies([...replies, newReply.trim()]);
      setNewReply('');
    }
  };

  const handleDeleteReply = idx => {
    setReplies(replies.filter((_, i) => i !== idx));
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <FaChartBar className="me-2" />
        <strong>Dashboard Profesional de Agente</strong>
      </Card.Header>
      <Card.Body>
        {/* Herramientas profesionales */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaTools size={32} className="mb-2 text-primary" />
                <h6>Gestión de Propiedades</h6>
                <Button variant="outline-primary" size="sm">Ver propiedades</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaClipboardList size={32} className="mb-2 text-success" />
                <h6>Gestión de Clientes</h6>
                <Button variant="outline-success" size="sm">Ver clientes</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaCalendarAlt size={32} className="mb-2 text-warning" />
                <h6>Gestión de Citas</h6>
                <Button variant="outline-warning" size="sm">Ver citas</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaRobot size={32} className="mb-2 text-info" />
                <h6>Automatización</h6>
                <Button variant="outline-info" size="sm">Configurar respuestas</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Estadísticas avanzadas */}
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Header>Estadísticas de Conversaciones</Card.Header>
              <Card.Body>
                <ul className="list-unstyled mb-0">
                  <li><strong>Total de conversaciones:</strong> {stats.totalConversations}</li>
                  <li><strong>Mensajes enviados:</strong> {stats.messagesSent}</li>
                  <li><strong>Clientes activos:</strong> {stats.activeClients}</li>
                  <li><strong>Propiedades gestionadas:</strong> {stats.propertiesManaged}</li>
                  <li><strong>Respuestas automatizadas:</strong> {stats.automatedReplies}</li>
                  <li><strong>Tiempo medio de respuesta:</strong> {stats.avgResponseTime}</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>Gráfica de Actividad (Simulada)</Card.Header>
              <Card.Body>
                <div style={{ height: 180, background: '#f8f9fa', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                  [Gráfica de actividad aquí]
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Reportes de actividad */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header>Reportes de Actividad</Card.Header>
              <Card.Body>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Conversaciones</th>
                      <th>Mensajes</th>
                      <th>Nuevos clientes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityReports.map(r => (
                      <tr key={r.date}>
                        <td>{r.date}</td>
                        <td>{r.conversations}</td>
                        <td>{r.messages}</td>
                        <td>{r.newClients}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button variant="outline-secondary" size="sm">Exportar reporte</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Automatización de respuestas */}
        <Row>
          <Col md={6}>
            <Card>
              <Card.Header>Respuestas Rápidas</Card.Header>
              <Card.Body>
                <Form onSubmit={handleAddReply} className="mb-3 d-flex gap-2">
                  <Form.Control
                    type="text"
                    value={newReply}
                    onChange={e => setNewReply(e.target.value)}
                    placeholder="Nueva respuesta rápida..."
                  />
                  <Button type="submit" variant="primary">Agregar</Button>
                </Form>
                <ul className="list-group">
                  {replies.map((r, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      {r}
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteReply(idx)}>Eliminar</Button>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AgentAnalyticsDashboard;
