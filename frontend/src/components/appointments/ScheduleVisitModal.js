import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { scheduleAppointment, getAvailableSlots, selectAppointmentsLoading, selectAvailableSlots } from '@store/slices/appointmentsSlice';
import { selectCurrentUser } from '@store/slices/authSlice';
import { toast } from 'react-toastify';

const ScheduleVisitModal = ({ show, onHide, property, onVisitScheduled }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectAppointmentsLoading);
  const slotsData = useSelector(selectAvailableSlots);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [contactInfo, setContactInfo] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    notes: ''
  });

  // Horarios disponibles por defecto
  const defaultTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  useEffect(() => {
    if (selectedDate && property) {
      dispatch(getAvailableSlots({ date: selectedDate, propertyId: property.id }));
    }
  }, [selectedDate, property, dispatch]);

  useEffect(() => {
    // Actualizar información de contacto cuando el usuario cambie
    if (currentUser) {
      setContactInfo(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        phone: currentUser.phone || prev.phone,
        email: currentUser.email || prev.email
      }));
    }
  }, [currentUser]);

  const getAvailableSlotsForDate = () => {
    if (!property || !selectedDate) return defaultTimeSlots;
    const key = `${property.id}-${selectedDate}`;
    return slotsData[key] || defaultTimeSlots;
  };

  const handleScheduleVisit = async () => {
    // Validaciones
    if (!selectedDate) {
      toast.warning('Por favor selecciona una fecha');
      return;
    }
    
    if (!selectedTime) {
      toast.warning('Por favor selecciona un horario');
      return;
    }
    
    if (!contactInfo.name.trim()) {
      toast.warning('Por favor ingresa tu nombre');
      return;
    }
    
    if (!contactInfo.phone.trim()) {
      toast.warning('Por favor ingresa tu teléfono');
      return;
    }

    try {
      const appointmentData = {
        property: {
          id: property.id,
          title: property.title,
          location: property.location,
          price: property.price,
          image: property.images?.[0] || property.image,
          seller: property.seller || { name: 'Vendedor', phone: '+57 300 000 0000' }
        },
        date: selectedDate,
        time: selectedTime,
        visitor: contactInfo
      };

      const result = await dispatch(scheduleAppointment(appointmentData)).unwrap();
      
      toast.success('¡Cita agendada exitosamente! Te enviaremos una confirmación.');
      onVisitScheduled?.(result);
      handleReset();
      onHide();
    } catch (error) {
      toast.error('Error al agendar la cita. Intenta nuevamente.');
    }
  };

  const handleReset = () => {
    setSelectedDate('');
    setSelectedTime('');
    setContactInfo({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      notes: ''
    });
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 días en el futuro
    return maxDate.toISOString().split('T')[0];
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  if (!property) return null;

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCalendarAlt className="me-2" />
          Agendar Visita
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Información de la propiedad */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <img
                  src={property.images?.[0] || property.image || 'https://via.placeholder.com/300x200'}
                  alt={property.title}
                  className="img-fluid rounded"
                  style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                />
              </Col>
              <Col md={8}>
                <h5 className="mb-1">{property.title}</h5>
                <p className="text-muted mb-2">
                  <FaMapMarkerAlt className="me-1" />
                  {property.location}
                </p>
                <h6 className="text-success mb-0">
                  {property.price && new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0
                  }).format(property.price)}
                </h6>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Selección de fecha y hora */}
        <Row className="mb-4">
          {/* Selección de fecha */}
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                <FaCalendarAlt className="me-2" />
                Selecciona la Fecha
              </Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="mb-2"
              />
              {selectedDate && (
                <Form.Text className="text-success">
                  <FaCheckCircle className="me-1" />
                  {formatDateDisplay(selectedDate)}
                </Form.Text>
              )}
            </Form.Group>
          </Col>

          {/* Selección de horario */}
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                <FaClock className="me-2" />
                Selecciona el Horario
              </Form.Label>
              
              {!selectedDate ? (
                <Alert variant="light" className="text-center py-3">
                  Primero selecciona una fecha
                </Alert>
              ) : loading.slots ? (
                <Alert variant="light" className="text-center py-3">
                  <div className="spinner-border spinner-border-sm me-2" />
                  Cargando horarios disponibles...
                </Alert>
              ) : (
                <div className="d-grid gap-2">
                  {getAvailableSlotsForDate().length > 0 ? (
                    <Row className="g-2">
                      {getAvailableSlotsForDate().map(slot => (
                        <Col xs={6} key={slot}>
                          <Button
                            variant={selectedTime === slot ? 'primary' : 'outline-primary'}
                            size="sm"
                            className="w-100"
                            onClick={() => setSelectedTime(slot)}
                          >
                            {slot}
                          </Button>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Alert variant="warning">
                      No hay horarios disponibles para esta fecha.
                      Por favor selecciona otra fecha.
                    </Alert>
                  )}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* Información de contacto */}
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">
              <FaUser className="me-2" />
              Información de Contacto
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo *</Form.Label>
                  <Form.Control
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ingresa tu nombre completo"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono *</Form.Label>
                  <Form.Control
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+57 300 123 4567"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email (opcional)</Form.Label>
              <Form.Control
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="tu@email.com"
              />
            </Form.Group>
            
            <Form.Group className="mb-0">
              <Form.Label>Notas adicionales (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={contactInfo.notes}
                onChange={(e) => setContactInfo(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Información adicional sobre tu visita, preguntas específicas, etc."
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Resumen de la cita */}
        {selectedDate && selectedTime && (
          <Alert variant="success">
            <h6 className="mb-2">
              <FaCheckCircle className="me-2" />
              Resumen de tu Cita
            </h6>
            <p className="mb-1">
              <strong>Fecha:</strong> {formatDateDisplay(selectedDate)}
            </p>
            <p className="mb-1">
              <strong>Hora:</strong> {selectedTime}
            </p>
            <p className="mb-0">
              <strong>Contacto:</strong> {contactInfo.name} - {contactInfo.phone}
            </p>
          </Alert>
        )}

        {/* Información importante */}
        <Alert variant="light">
          <h6 className="mb-2">Información Importante:</h6>
          <ul className="mb-0 small">
            <li>La cita será confirmada por el vendedor/agente</li>
            <li>Recibirás una confirmación por WhatsApp o llamada</li>
            <li>Por favor llega 5 minutos antes de la hora acordada</li>
            <li>Puedes cancelar o reprogramar hasta 2 horas antes</li>
          </ul>
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading.schedule}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleScheduleVisit}
          disabled={!selectedDate || !selectedTime || !contactInfo.name || !contactInfo.phone || loading.schedule}
        >
          {loading.schedule ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" />
              Agendando Cita...
            </>
          ) : (
            <>
              <FaCalendarAlt className="me-1" />
              Agendar Visita
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScheduleVisitModal;