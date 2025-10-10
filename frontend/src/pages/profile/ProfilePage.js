import { FaPhone, FaMapMarkerAlt, FaEdit, FaHeart, FaBriefcase } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Modal, Alert, Tab, Tabs } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import { updateProfile } from '@store/slices/authSlice';
import { selectVerifications } from '@store/slices/verificationSlice';
import AgentAnalyticsDashboard from '@components/agents/AgentAnalyticsDashboard';
import { toast } from 'react-toastify';
import VerificationBadges from '@components/verification/VerificationBadges';

const ProfilePage = () => {
  // Sincronización y actualización de indicadores/notificaciones
  useEffect(() => {
    // 1. Sincronizar datos del usuario (simulación: recargar datos si cambia el id)
    // Aquí podrías hacer un dispatch para refrescar datos desde el backend si lo necesitas
    // dispatch(fetchCurrentUser(currentUser.id));

    // 2. Actualizar indicadores visuales (ejemplo: badge de verificación)
    // Si el usuario se verifica, mostrar toast
    if (currentUser.isVerified) {
      toast.info('¡Tu cuenta está verificada!');
    }

    // 3. Notificaciones automáticas (simulación)
    // Si hay nuevas notificaciones, mostrar toast
    // if (currentUser.notifications && currentUser.notifications.length > 0) {
    //   toast.info(`Tienes ${currentUser.notifications.length} nuevas notificaciones.`);
    // }

    // 4. Validaciones y controles (ejemplo: límite de propiedades guardadas)
    if (savedProperties.length > 100) {
      toast.warn('Has alcanzado el límite de propiedades guardadas.');
    }
    // 5. Auditoría (simulación: log de acceso)
    // console.log('Acceso a perfil de usuario:', currentUser.id);
  }, [currentUser, savedProperties]);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const verifications = useSelector(selectVerifications);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [validated, setValidated] = useState(false);
  const [savedProperties] = useState(JSON.parse(localStorage.getItem(`savedProperties_${currentUser?.id}`) || '[]'));
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    avatar: currentUser?.avatar || '',
    preferences: currentUser?.preferences || {
      location: '',
      priceRange: { min: '', max: '' },
      propertyType: '',
      bedrooms: '',
      bathrooms: ''
    },
    professional: currentUser?.professional || {
      licenseNumber: '',
      agency: '',
      experience: '',
      specialization: '',
      coverageArea: ''
    }
  });

  // Estados para feedback de notificaciones push/email
  const [pushLoading, setPushLoading] = useState(false);
  const [pushError, setPushError] = useState(null);
  const [pushSuccess, setPushSuccess] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState(null);

  // Handler para guardar perfil con feedback toast
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setLoading(true);
    try {
      await dispatch(updateProfile(formData));
      toast.success('¡Perfil actualizado correctamente!');
      setShowEditModal(false);
    } catch (err) {
      toast.error('Error al actualizar el perfil.');
    }
    setLoading(false);
  };

  // Handler para cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('preferences.')) {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name.split('.')[1]]: value
        }
      }));
    } else if (name.startsWith('professional.')) {
      setFormData((prev) => ({
        ...prev,
        professional: {
          ...prev.professional,
          [name.split('.')[1]]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handler para rango de precios
  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        priceRange: {
          ...prev.preferences.priceRange,
          [name]: value
        }
      }
    }));
  };

  // Utilidad para mostrar rol
  const getRoleLabel = (role) => {
    switch (role) {
      case 'buyer': return 'Comprador';
      case 'seller': return 'Vendedor';
      case 'agent': return 'Agente';
      default: return 'Usuario';
    }
  };

  // Utilidad para formatear precio
  const formatPrice = (price) => {
    return `$${Number(price).toLocaleString('es-CO')}`;
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col lg={4}>
          {/* Información del perfil */}
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <img 
                    src={currentUser.avatar || '/default-avatar.png'} 
                    alt="Avatar" 
                    className="rounded-circle" 
                    width="100" 
                    height="100"
                  />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5 className="mb-0">{currentUser.firstName} {currentUser.lastName}</h5>
                  <VerificationBadges verifications={verifications} />
                  <p className="text-muted">{currentUser.email}</p>
                  <div className="d-flex align-items-center">
                    <FaPhone className="text-muted me-2" />
                    <span className="text-muted">{currentUser.phone || 'No especificado'}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="text-muted me-2" />
                    <span className="text-muted">Ubicación no especificada</span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(tab) => setActiveTab(tab)}
                  className="mb-4"
                >
                  <>
                    <Tab eventKey="personal" title="Información Personal">
                      <Card>
                        <Card.Header>
                          <h6 className="mb-0">Datos Personales</h6>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md={6}>
                              <p><strong>Nombre:</strong> {currentUser.firstName}</p>
                              <p><strong>Apellido:</strong> {currentUser.lastName}</p>
                              <p><strong>Email:</strong> {currentUser.email}</p>
                            </Col>
                            <Col md={6}>
                              <p><strong>Teléfono:</strong> {currentUser.phone || 'No especificado'}</p>
                              <p><strong>Rol:</strong> {getRoleLabel(currentUser.role)}</p>
                              <p><strong>Estado:</strong> 
                                <Badge bg="success" className="ms-2">Activo</Badge>
                              </p>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Tab>

                    {currentUser.role === 'buyer' && (
                      <Tab eventKey="preferences" title="Preferencias de Búsqueda">
                        <Card>
                          <Card.Header>
                            <h6 className="mb-0">
                              <FaHeart className="me-2" />
                              Mis Preferencias
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            {currentUser.preferences ? (
                              <Row>
                                <Col md={6}>
                                  <p><strong>Ubicación preferida:</strong> {currentUser.preferences.location || 'No especificada'}</p>
                                  <p><strong>Tipo de propiedad:</strong> {currentUser.preferences.propertyType || 'Cualquiera'}</p>
                                </Col>
                                <Col md={6}>
                                  <p><strong>Habitaciones:</strong> {currentUser.preferences.bedrooms || 'Cualquiera'}</p>
                                  <p><strong>Baños:</strong> {currentUser.preferences.bathrooms || 'Cualquiera'}</p>
                                </Col>
                                {currentUser.preferences.priceRange && (
                                  <Col md={12}>
                                    <p><strong>Rango de precio:</strong> 
                                      {currentUser.preferences.priceRange.min && formatPrice(currentUser.preferences.priceRange.min)} 
                                      {currentUser.preferences.priceRange.min && currentUser.preferences.priceRange.max && ' - '}
                                      {currentUser.preferences.priceRange.max && formatPrice(currentUser.preferences.priceRange.max)}
                                      {!currentUser.preferences.priceRange.min && !currentUser.preferences.priceRange.max && 'No especificado'}
                                    </p>
                                  </Col>
                                )}
                              </Row>
                            ) : (
                              <p className="text-muted">No has configurado tus preferencias de búsqueda.</p>
                            )}
                          </Card.Body>
                        </Card>
                      </Tab>
                    )}

                    {currentUser.role === 'agent' && (
                      <Tab eventKey="analytics" title="Analytics Profesional">
                        <AgentAnalyticsDashboard />
                      </Tab>
                    )}

                    <Tab eventKey="advanced" title="Configuración Avanzada">
                      <Card>
                        <Card.Header>
                          <h6 className="mb-0">Configuración Avanzada</h6>
                        </Card.Header>
                        <Card.Body>
                          <Form>
                            {/* Privacidad */}
                            <h6 className="mt-2">Privacidad</h6>
                            <Form.Check
                              type="switch"
                              id="privacy-profile"
                              label="Permitir que otros usuarios vean mi perfil"
                              defaultChecked={true}
                              className="mb-2"
                            />
                            <Form.Check
                              type="switch"
                              id="privacy-contact"
                              label="Mostrar mi información de contacto"
                              defaultChecked={true}
                              className="mb-2"
                            />
                            <Form.Check
                              type="switch"
                              id="privacy-activity"
                              label="Mostrar mi actividad reciente"
                              defaultChecked={false}
                              className="mb-2"
                            />

                            {/* Notificaciones granulares */}
                            <h6 className="mt-4">Preferencias de Notificación</h6>
                            <Form.Check
                              type="switch"
                              id="notif-push"
                              label="Notificaciones Push"
                              defaultChecked={true}
                              className="mb-2"
                            />
                            <Form.Check
                              type="switch"
                              id="notif-email"
                              label="Notificaciones por Email"
                              defaultChecked={true}
                              className="mb-2"
                            />
                            <Form.Check
                              type="switch"
                              id="notif-chat"
                              label="Notificaciones de Chat"
                              defaultChecked={true}
                              className="mb-2"
                            />
                            <Form.Check
                              type="switch"
                              id="notif-offers"
                              label="Notificaciones de Ofertas"
                              defaultChecked={true}
                              className="mb-2"
                            />

                            {/* Visibilidad del perfil */}
                            <h6 className="mt-4">Visibilidad del Perfil</h6>
                            <Form.Group className="mb-3">
                              <Form.Label>¿Quién puede ver tu perfil?</Form.Label>
                              <Form.Select defaultValue="publico">
                                <option value="publico">Público</option>
                                <option value="agentes">Solo agentes</option>
                                <option value="compradores">Solo compradores</option>
                                <option value="oculto">Oculto</option>
                              </Form.Select>
                            </Form.Group>

                            {/* Información de contacto */}
                            <h6 className="mt-4">Información de Contacto</h6>
                            <Form.Group className="mb-2">
                              <Form.Label>Email</Form.Label>
                              <Form.Control type="email" defaultValue={currentUser.email} />
                            </Form.Group>
                            <Form.Group className="mb-2">
                              <Form.Label>Teléfono</Form.Label>
                              <Form.Control type="text" defaultValue={currentUser.phone} />
                            </Form.Group>
                            <Form.Group className="mb-2">
                              <Form.Label>Redes sociales</Form.Label>
                              <Form.Control type="text" placeholder="Ej: @usuarioInstagram" />
                            </Form.Group>

                            <Button variant="primary" className="mt-3">Guardar Cambios</Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Tab>
                  </>
                </Tabs>
              </div>

              <Button
                variant="primary"
                className="w-100 mt-3"
                onClick={() => setShowEditModal(true)}
              >
                <FaEdit className="me-2" />
                Editar Perfil
              </Button>
            </Card.Body>
          </Card>

          {/* Estadísticas rápidas */}
          <Card>
            <Card.Header>
              <h6 className="mb-0">Actividad</h6>
            </Card.Header>
            <Card.Body>
              {currentUser.role === 'buyer' && (
                <>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Propiedades guardadas:</span>
                    <Badge bg="success">{savedProperties.length}</Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Conversaciones activas:</span>
                    <Badge bg="primary">3</Badge>
                  </div>
                </>
              )}
              
              {currentUser.role === 'seller' && (
                <>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Propiedades publicadas:</span>
                    <Badge bg="primary">5</Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Consultas recibidas:</span>
                    <Badge bg="warning">12</Badge>
                  </div>
                </>
              )}

              {currentUser.role === 'agent' && (
                <>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Clientes activos:</span>
                    <Badge bg="primary">15</Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Propiedades gestionadas:</span>
                    <Badge bg="success">8</Badge>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {/* Tabs de información */}
          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="mb-4"
          >
            <Tab eventKey="personal" title="Información Personal">
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Datos Personales</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Nombre:</strong> {currentUser.firstName}</p>
                      <p><strong>Apellido:</strong> {currentUser.lastName}</p>
                      <p><strong>Email:</strong> {currentUser.email}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Teléfono:</strong> {currentUser.phone || 'No especificado'}</p>
                      <p><strong>Rol:</strong> {getRoleLabel(currentUser.role)}</p>
                      <p><strong>Estado:</strong> 
                        <Badge bg="success" className="ms-2">Activo</Badge>
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>

            {currentUser.role === 'agent' && (
              <>
            <Tab eventKey="advanced" title="Configuración Avanzada">
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Configuración Avanzada</h6>
                </Card.Header>
                <Card.Body>
                  <Form>
                    {/* Privacidad */}
                    <h6 className="mt-2">Privacidad</h6>
                    <Form.Check
                      type="switch"
                      id="privacy-profile"
                      label="Permitir que otros usuarios vean mi perfil"
                      defaultChecked={true}
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="privacy-contact"
                      label="Mostrar mi información de contacto"
                      defaultChecked={true}
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="privacy-activity"
                      label="Mostrar mi actividad reciente"
                      defaultChecked={false}
                      className="mb-2"
                    />

                    {/* Notificaciones granulares */}
                    <h6 className="mt-4">Preferencias de Notificación</h6>
                    <Form.Check
                      type="switch"
                      id="notif-push"
                      label="Notificaciones Push"
                      defaultChecked={true}
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="notif-email"
                      label="Notificaciones por Email"
                      defaultChecked={true}
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="notif-chat"
                      label="Notificaciones de Chat"
                      defaultChecked={true}
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="notif-offers"
                      label="Notificaciones de Ofertas"
                      defaultChecked={true}
                      className="mb-2"
                    />

                    {/* Visibilidad del perfil */}
                    <h6 className="mt-4">Visibilidad del Perfil</h6>
                    <Form.Group className="mb-3">
                      <Form.Label>¿Quién puede ver tu perfil?</Form.Label>
                      <Form.Select defaultValue="publico">
                        <option value="publico">Público</option>
                        <option value="agentes">Solo agentes</option>
                        <option value="compradores">Solo compradores</option>
                        <option value="oculto">Oculto</option>
                      </Form.Select>
                    </Form.Group>

                    {/* Información de contacto */}
                    <h6 className="mt-4">Información de Contacto</h6>
                    <Form.Group className="mb-2">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" defaultValue={currentUser.email} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control type="text" defaultValue={currentUser.phone} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Redes sociales</Form.Label>
                      <Form.Control type="text" placeholder="Ej: @usuarioInstagram" />
                    </Form.Group>

                    <Button variant="primary" className="mt-3">Guardar Cambios</Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>
            
              <Tab eventKey="analytics" title="Analytics Profesional">
                <AgentAnalyticsDashboard />
              </Tab>
            </>
            )}

            {currentUser.role === 'buyer' && (
              <Tab eventKey="preferences" title="Preferencias de Búsqueda">
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaHeart className="me-2" />
                      Mis Preferencias
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {currentUser.preferences ? (
                      <Row>
                        <Col md={6}>
                          <p><strong>Ubicación preferida:</strong> {currentUser.preferences.location || 'No especificada'}</p>
                          <p><strong>Tipo de propiedad:</strong> {currentUser.preferences.propertyType || 'Cualquiera'}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Habitaciones:</strong> {currentUser.preferences.bedrooms || 'Cualquiera'}</p>
                          <p><strong>Baños:</strong> {currentUser.preferences.bathrooms || 'Cualquiera'}</p>
                        </Col>
                        {currentUser.preferences.priceRange && (
                          <Col md={12}>
                            <p><strong>Rango de precio:</strong> 
                              {currentUser.preferences.priceRange.min && formatPrice(currentUser.preferences.priceRange.min)} 
                              {currentUser.preferences.priceRange.min && currentUser.preferences.priceRange.max && ' - '}
                              {currentUser.preferences.priceRange.max && formatPrice(currentUser.preferences.priceRange.max)}
                              {!currentUser.preferences.priceRange.min && !currentUser.preferences.priceRange.max && 'No especificado'}
                            </p>
                          </Col>
                        )}
                      </Row>
                    ) : (
                      <p className="text-muted">No has configurado tus preferencias de búsqueda.</p>
                    )}
                  </Card.Body>
                </Card>
              </Tab>
            )}

            {currentUser.role === 'agent' && (
              <Tab eventKey="professional" title="Información Profesional">
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaBriefcase className="me-2" />
                      Datos Profesionales
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {currentUser.professional ? (
                      <Row>
                        <Col md={6}>
                          <p><strong>Número de licencia:</strong> {currentUser.professional.licenseNumber || 'No especificado'}</p>
                          <p><strong>Agencia:</strong> {currentUser.professional.agency || 'Independiente'}</p>
                          <p><strong>Experiencia:</strong> {currentUser.professional.experience || 'No especificada'}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Especialización:</strong> {currentUser.professional.specialization || 'General'}</p>
                          <p><strong>Área de cobertura:</strong> {currentUser.professional.coverageArea || 'No especificada'}</p>
                        </Col>
                      </Row>
                    ) : (
                      <p className="text-muted">No has completado tu información profesional.</p>
                    )}
                  </Card.Body>
                </Card>
              </Tab>
            )}

            <Tab eventKey="security" title="Seguridad">
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Configuración de Seguridad</h6>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <h6>Cambiar Contraseña</h6>
                    <Button variant="outline-primary" size="sm">
                      Actualizar Contraseña
                    </Button>
                  </div>
                  
                  <div className="mb-3">
                    <h6>Verificación de Email</h6>
                    <div className="d-flex align-items-center">
                      <Badge bg={currentUser.isVerified ? 'success' : 'warning'} className="me-2">
                        {currentUser.isVerified ? 'Verificado' : 'Pendiente'}
                      </Badge>
                      {!currentUser.isVerified && (
                        <Button variant="outline-primary" size="sm">
                          Enviar Verificación
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h6>Configuración de Privacidad</h6>
                    <Form.Check
                      type="checkbox"
                      id="showContact"
                      label="Permitir que otros usuarios vean mi información de contacto"
                      defaultChecked={true}
                      className="mb-2"
                    />
                    <Form.Check
                      type="checkbox"
                      id="notifications"
                      label="Recibir notificaciones por email"
                      defaultChecked={true}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="notifications" title="Notificaciones">
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Configuración de Notificaciones</h6>
                </Card.Header>
                <Card.Body>
                  {/* Push Notifications */}
                  <div className="mb-4">
                    <h6>Notificaciones Push</h6>
                      <Button
                        variant="outline-primary"
                        onClick={async () => {
                          setPushLoading(true);
                          setPushError(null);
                          setPushSuccess(null);
                          try {
                            const { requestNotificationPermission, registerServiceWorker, subscribeUserToPush } = await import('../../utils/pushNotifications');
                            const permission = await requestNotificationPermission();
                            if (permission === 'granted') {
                              const reg = await registerServiceWorker();
                              if (reg) {
                                const vapidRes = await fetch('/api/push/public-key');
                                const { publicKey } = await vapidRes.json();
                                const subscription = await subscribeUserToPush(reg, publicKey);
                                if (subscription) {
                                  const res = await fetch('/api/push/subscribe', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ subscription, userId: currentUser.id })
                                  });
                                  if (res.ok) {
                                    setPushSuccess('¡Notificaciones push activadas correctamente!');
                                    toast.success('¡Notificaciones push activadas correctamente!');
                                  } else {
                                    setPushError('Error al registrar la suscripción en el servidor.');
                                    toast.error('Error al registrar la suscripción en el servidor.');
                                  }
                                } else {
                                  setPushError('No se pudo crear la suscripción push.');
                                  toast.error('No se pudo crear la suscripción push.');
                                }
                              } else {
                                setPushError('No se pudo registrar el Service Worker.');
                                toast.error('No se pudo registrar el Service Worker.');
                              }
                            } else {
                              setPushError('Permiso denegado o no soportado.');
                              toast.error('Permiso denegado o no soportado.');
                            }
                          } catch (err) {
                            setPushError('Error inesperado: ' + err.message);
                            toast.error('Error inesperado: ' + err.message);
                          }
                          setPushLoading(false);
                        }}
                        disabled={pushLoading}
                      >
                        {pushLoading ? 'Activando...' : 'Activar Notificaciones Push'}
                      </Button>
                      {pushError && <Alert variant="danger" className="mt-2">{pushError}</Alert>}
                      {pushSuccess && <Alert variant="success" className="mt-2">{pushSuccess}</Alert>}
                  </div>
                  {/* Email Notifications */}
                    <div>
                      <h6>Notificaciones por Email</h6>
                      <Form onSubmit={async e => {
                        e.preventDefault();
                        setEmailLoading(true);
                        setEmailError(null);
                        setEmailSuccess(null);
                        const form = e.target;
                        const destinatario = form.elements[0].value;
                        const mensaje = form.elements[1].value;
                        try {
                          const res = await fetch('/api/email/send-notification', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ to: destinatario, message: mensaje, userId: currentUser.id })
                          });
                          if (res.ok) {
                            setEmailSuccess('¡Email enviado correctamente!');
                            toast.success('¡Email enviado correctamente!');
                            form.reset();
                          } else {
                            setEmailError('Error al enviar el email.');
                            toast.error('Error al enviar el email.');
                          }
                        } catch (err) {
                          setEmailError('Error inesperado: ' + err.message);
                          toast.error('Error inesperado: ' + err.message);
                        }
                        setEmailLoading(false);
                      }}>
                        <Form.Group className="mb-2">
                          <Form.Label>Destinatario</Form.Label>
                          <Form.Control type="email" placeholder="usuario@email.com" required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Mensaje</Form.Label>
                          <Form.Control as="textarea" rows={2} placeholder="Escribe tu mensaje..." required />
                        </Form.Group>
                        <Button type="submit" variant="primary" disabled={emailLoading}>
                          {emailLoading ? 'Enviando...' : 'Enviar Email'}
                        </Button>
                        {emailError && <Alert variant="danger" className="mt-2">{emailError}</Alert>}
                        {emailSuccess && <Alert variant="success" className="mt-2">{emailSuccess}</Alert>}
                      </Form>
                    </div>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Modal de edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Perfil</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Tabs defaultActiveKey="basic" className="mb-3">
              <Tab eventKey="basic" title="Información Básica">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre *</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido *</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+57 300 123 4567"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>

              {currentUser.role === 'buyer' && (
                <Tab eventKey="preferences" title="Preferencias">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ubicación Preferida</Form.Label>
                        <Form.Control
                          type="text"
                          name="preferences.location"
                          value={formData.preferences.location}
                          onChange={handleChange}
                          placeholder="Ej: Bogotá, Zona Norte"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tipo de Propiedad</Form.Label>
                        <Form.Select
                          name="preferences.propertyType"
                          value={formData.preferences.propertyType}
                          onChange={handleChange}
                        >
                          <option value="">Cualquiera</option>
                          <option value="apartment">Apartamento</option>
                          <option value="house">Casa</option>
                          <option value="condo">Condominio</option>
                          <option value="office">Oficina</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Precio Mínimo</Form.Label>
                        <Form.Control
                          type="number"
                          name="min"
                          value={formData.preferences.priceRange.min}
                          onChange={handlePriceRangeChange}
                          placeholder="Ej: 200000000"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Precio Máximo</Form.Label>
                        <Form.Control
                          type="number"
                          name="max"
                          value={formData.preferences.priceRange.max}
                          onChange={handlePriceRangeChange}
                          placeholder="Ej: 500000000"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Habitaciones</Form.Label>
                        <Form.Select
                          name="preferences.bedrooms"
                          value={formData.preferences.bedrooms}
                          onChange={handleChange}
                        >
                          <option value="">Cualquiera</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                          <option value="4">4+</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Baños</Form.Label>
                        <Form.Select
                          name="preferences.bathrooms"
                          value={formData.preferences.bathrooms}
                          onChange={handleChange}
                        >
                          <option value="">Cualquiera</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>
              )}

              {currentUser.role === 'agent' && (
                <Tab eventKey="professional" title="Información Profesional">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Número de Licencia</Form.Label>
                        <Form.Control
                          type="text"
                          name="professional.licenseNumber"
                          value={formData.professional.licenseNumber}
                          onChange={handleChange}
                          placeholder="Ej: LIC123456"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Agencia</Form.Label>
                        <Form.Control
                          type="text"
                          name="professional.agency"
                          value={formData.professional.agency}
                          onChange={handleChange}
                          placeholder="Ej: Inmobiliaria ABC"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Años de Experiencia</Form.Label>
                        <Form.Control
                          type="text"
                          name="professional.experience"
                          value={formData.professional.experience}
                          onChange={handleChange}
                          placeholder="Ej: 5 años"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Especialización</Form.Label>
                        <Form.Control
                          type="text"
                          name="professional.specialization"
                          value={formData.professional.specialization}
                          onChange={handleChange}
                          placeholder="Ej: Propiedades residenciales"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Área de Cobertura</Form.Label>
                    <Form.Control
                      type="text"
                      name="professional.coverageArea"
                      value={formData.professional.coverageArea}
                      onChange={handleChange}
                      placeholder="Ej: Bogotá y alrededores"
                    />
                  </Form.Group>
                </Tab>
              )}
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ProfilePage;