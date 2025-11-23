import authService from '@services/authService';
import { FaPhone, FaMapMarkerAlt, FaEdit, FaHeart, FaBriefcase } from 'react-icons/fa';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Modal, Alert, Tab, Tabs } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import { updateProfile } from '@store/slices/authSlice';
import { selectVerifications, selectVerificationLoading, sendEmailVerification, verifyCode, syncEmailVerificationStatus } from '@store/slices/verificationSlice';
import AgentAnalyticsDashboard from '@components/agents/AgentAnalyticsDashboard';
import { toast } from 'react-toastify';
import VerificationBadges from '@components/verification/VerificationBadges';
import ChangePasswordModal from '@components/user/ChangePasswordModal';

import { fetchPrivacy, savePrivacy, selectPrivacy, selectPrivacyLoading } from '@store/slices/privacySlice';

const ProfilePage = () => {
  const currentUser = useSelector(selectCurrentUser);
  console.log('ProfilePage montado. currentUser:', currentUser);
  const dispatch = useDispatch();

  // --- PRIVACIDAD ---
  const privacy = useSelector(selectPrivacy);
  const privacyLoading = useSelector(selectPrivacyLoading);
  const [privacyState, setPrivacyState] = useState({
    showContactInfo: true,
    receiveEmailNotifications: true
  });

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchPrivacy(currentUser.id));
    }
  }, [currentUser?.id, dispatch]);

  useEffect(() => {
    if (privacy) {
      setPrivacyState({
        showContactInfo: !!privacy.showContactInfo,
        receiveEmailNotifications: !!privacy.receiveEmailNotifications
      });
    }
  }, [privacy]);

  const handlePrivacyChange = (e) => {
    const { id, checked } = e.target;
    let key = id === 'showContact' ? 'showContactInfo' : 'receiveEmailNotifications';
    const newState = { ...privacyState, [key]: checked };
    setPrivacyState(newState);
    dispatch(savePrivacy(newState))
      .unwrap()
      .then(() => toast.success('Privacidad actualizada'))
      .catch(() => toast.error('Error al guardar privacidad'));
  };
    // Estado y lógica para cambio de contraseña
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const handleChangePassword = async ({ currentPassword, newPassword }) => {
      setPasswordLoading(true);
      try {
        await authService.changePassword(currentPassword, newPassword);
        toast.success('Contraseña actualizada correctamente');
        setShowPasswordModal(false);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Error al cambiar la contraseña');
      }
      setPasswordLoading(false);
    };

  // Estado para previsualizar el avatar seleccionado
  const [avatarPreview, setAvatarPreview] = useState('/default-avatar.png');

  useEffect(() => {
    if (currentUser) {
      setAvatarPreview(currentUser.avatarUrl || currentUser.avatar || '/default-avatar.png');
    }
  }, [currentUser]);

  // Handler para subir avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      try {
        const response = await authService.uploadAvatar(file);
        if (response.data?.data?.avatarUrl) {
          setFormData((prev) => ({ ...prev, avatar: response.data.data.avatarUrl }));
          toast.success('Avatar actualizado');
        }
      } catch (err) {
        toast.error('Error al subir avatar');
      }
    }
  };
  const verifications = useSelector(selectVerifications);
  const verificationLoading = useSelector(selectVerificationLoading);

  // Estado para modal de verificación de email
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCode, setEmailCode] = useState('');


  // Estados antes del useEffect
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

  // Sincronizar formData cuando currentUser cambie (tras editar perfil)
  useEffect(() => {
    setFormData({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      avatar: currentUser?.avatar || '',
      preferences: {
        location: currentUser?.preferences?.location || '',
        priceRange: {
          min: currentUser?.preferences?.priceRange?.min || '',
          max: currentUser?.preferences?.priceRange?.max || ''
        },
        propertyType: currentUser?.preferences?.propertyType || '',
        bedrooms: currentUser?.preferences?.bedrooms || '',
        bathrooms: currentUser?.preferences?.bathrooms || ''
      },
      professional: currentUser?.professional || {
        licenseNumber: '',
        agency: '',
        experience: '',
        specialization: '',
        coverageArea: ''
      }
    });
    // Sincronizar badge de verificación de email tras login
    if (currentUser && typeof currentUser.emailVerified !== 'undefined') {
      // Convertir a booleano para soportar 1/0 o true/false
      const isVerified = currentUser.emailVerified === true || currentUser.emailVerified === 1;
      console.log('Valor de currentUser.emailVerified:', currentUser.emailVerified, 'Interpretado como:', isVerified);
      dispatch(syncEmailVerificationStatus(isVerified));
      setTimeout(() => {
        // Mostrar el estado actualizado del store de verificación
        const state = window.store ? window.store.getState() : null;
        if (state) {
          console.log('Estado de verifications en Redux:', state.verification.verifications.email);
        }
      }, 500);
    }
  }, [currentUser, dispatch]);

  // Proteger el renderizado si currentUser no está listo
  if (!currentUser) {
    return <div style={{textAlign: 'center', marginTop: '2rem'}}>Cargando perfil...</div>;
  }

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
          ...(prev.preferences?.priceRange || { min: '', max: '' }),
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
    if (price === undefined || price === null || price === '') return '';
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
                    src={currentUser.avatarUrl ? (currentUser.avatarUrl.startsWith('http') ? currentUser.avatarUrl : `http://192.168.20.82:3000${currentUser.avatarUrl}`) : '/default-avatar.png'} 
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

              {/* Sección de Tabs de perfil */}
              <Tabs
                  activeKey={activeTab}
                  onSelect={(tab) => setActiveTab(tab)}
                  className="mb-4"
                >
                  <Tab eventKey="personal" title="Información Personal">
                    <Card>
                      <Card.Header>
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
                                <p><strong>Ubicación preferida:</strong> {currentUser.preferences?.location || 'No especificada'}</p>
                                <p><strong>Tipo de propiedad:</strong> {currentUser.preferences?.propertyType || 'Cualquiera'}</p>
                              </Col>
                              <Col md={6}>
                                <p><strong>Habitaciones:</strong> {currentUser.preferences?.bedrooms || 'Cualquiera'}</p>
                                <p><strong>Baños:</strong> {currentUser.preferences?.bathrooms || 'Cualquiera'}</p>
                              </Col>
                              {currentUser.preferences?.priceRange && (
                                <Col md={12}>
                                  <p><strong>Rango de precio:</strong> 
                                    {currentUser.preferences?.priceRange?.min ? formatPrice(currentUser.preferences?.priceRange?.min) : ''}
                                    {currentUser.preferences?.priceRange?.min && currentUser.preferences?.priceRange?.max ? ' - ' : ''}
                                    {currentUser.preferences?.priceRange?.max ? formatPrice(currentUser.preferences?.priceRange?.max) : ''}
                                    {!currentUser.preferences?.priceRange?.min && !currentUser.preferences?.priceRange?.max && 'No especificado'}
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
                </Tabs>

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
                          <p><strong>Ubicación preferida:</strong> {currentUser.preferences?.location || 'No especificada'}</p>
                          <p><strong>Tipo de propiedad:</strong> {currentUser.preferences?.propertyType || 'Cualquiera'}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Habitaciones:</strong> {currentUser.preferences?.bedrooms || 'Cualquiera'}</p>
                          <p><strong>Baños:</strong> {currentUser.preferences?.bathrooms || 'Cualquiera'}</p>
                        </Col>
                        {currentUser.preferences?.priceRange && (
                          <Col md={12}>
                            <p><strong>Rango de precio:</strong> 
                              {currentUser.preferences?.priceRange?.min ? formatPrice(currentUser.preferences?.priceRange?.min) : ''}
                              {currentUser.preferences?.priceRange?.min && currentUser.preferences?.priceRange?.max ? ' - ' : ''}
                              {currentUser.preferences?.priceRange?.max ? formatPrice(currentUser.preferences?.priceRange?.max) : ''}
                              {!currentUser.preferences?.priceRange?.min && !currentUser.preferences?.priceRange?.max && 'No especificado'}
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
                    <Button variant="outline-primary" size="sm" onClick={() => setShowPasswordModal(true)}>
                      Actualizar Contraseña
                    </Button>
                    <ChangePasswordModal
                      show={showPasswordModal}
                      onClose={() => setShowPasswordModal(false)}
                      onSubmit={handleChangePassword}
                      loading={passwordLoading}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <h6>Verificación de Email</h6>
                    <div className="d-flex align-items-center">
                      <Badge bg={verifications.email?.status === 'verified' ? 'success' : 'warning'} className="me-2">
                        {verifications.email?.status === 'verified' ? 'Verificado' : 'Pendiente'}
                      </Badge>
                      {verifications.email?.status !== 'verified' && (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => {
                            dispatch(sendEmailVerification(currentUser.email))
                              .unwrap()
                              .then((res) => {
                                toast.success(res?.message || 'Código enviado exitosamente');
                                setShowEmailModal(true);
                              })
                              .catch((err) => {
                                toast.error(err || 'No se pudo enviar el código');
                              });
                          }}
                          disabled={verificationLoading.emailVerification}
                        >
                          {verificationLoading.emailVerification ? 'Enviando...' : 'Enviar Verificación'}
                        </Button>
                      )}
                          {/* Modal de verificación de email */}
                          <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)} centered>
                            <Modal.Header closeButton>
                              <Modal.Title>Verificar Email</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <p>Hemos enviado un código de 6 dígitos a {currentUser.email}</p>
                              <Form.Group>
                                <Form.Label>Código de Verificación</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="123456"
                                  maxLength="6"
                                  value={emailCode}
                                  onChange={e => setEmailCode(e.target.value.replace(/\D/g, ''))}
                                />
                              </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
                                Cancelar
                              </Button>
                              <Button 
                                variant="primary" 
                                onClick={() => {
                                  if (emailCode.length !== 6) {
                                    toast.error('El código debe tener 6 dígitos');
                                    return;
                                  }
                                  dispatch(verifyCode({ email: currentUser.email, code: emailCode }))
                                    .unwrap()
                                    .then(() => {
                                      toast.success('Email verificado exitosamente');
                                      setShowEmailModal(false);
                                      setEmailCode('');
                                    })
                                    .catch((err) => {
                                      toast.error(err || 'Código incorrecto');
                                    });
                                }}
                                disabled={verificationLoading.codeVerification}
                              >
                                {verificationLoading.codeVerification ? 'Verificando...' : 'Verificar Código'}
                              </Button>
                            </Modal.Footer>
                          </Modal>
                    </div>
                  </div>

                  <div>
                    <h6>Configuración de Privacidad</h6>
                    <Form.Check
                      type="checkbox"
                      id="showContact"
                      label="Permitir que otros usuarios vean mi información de contacto"
                      checked={privacyState.showContactInfo}
                      onChange={handlePrivacyChange}
                      className="mb-2"
                    />
                    <Form.Check
                      type="checkbox"
                      id="notifications"
                      label="Recibir notificaciones por email"
                      checked={privacyState.receiveEmailNotifications}
                      onChange={handlePrivacyChange}
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
                    {/* Estado para token FCM */}
                    {(() => {
                      const [fcmToken, setFcmToken] = React.useState(null);
                      React.useEffect(() => {
                        let mounted = true;
                        import('../../utils/pushNotifications').then(({ getFcmToken }) => {
                          getFcmToken().then(token => {
                            if (mounted) setFcmToken(token);
                          });
                        });
                        return () => { mounted = false; };
                      }, []);
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <Button
                            variant="outline-primary"
                            onClick={async () => {
                              setPushLoading(true);
                              setPushError(null);
                              setPushSuccess(null);
                              try {
                                const { requestNotificationPermission, registerServiceWorker, getFcmToken } = await import('../../utils/pushNotifications');
                                const permission = await requestNotificationPermission();
                                if (permission === 'granted') {
                                  const reg = await registerServiceWorker();
                                  if (reg) {
                                    const token = await getFcmToken();
                                    if (token) {
                                      await import('../../services/pushService').then(({ sendPush }) =>
                                        sendPush({
                                          token,
                                          title: '¡Push activado!',
                                          body: 'Has activado las notificaciones push correctamente.'
                                        })
                                      );
                                      setPushSuccess('¡Notificaciones push activadas correctamente!');
                                      toast.success('¡Notificaciones push activadas correctamente!');
                                      setFcmToken(token);
                                    } else {
                                      setPushError('No se pudo obtener el token FCM.');
                                      toast.error('No se pudo obtener el token FCM.');
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
                            disabled={pushLoading || !!fcmToken}
                          >
                            {pushLoading ? 'Activando...' : 'Activar Notificaciones Push'}
                          </Button>
                          {!!fcmToken && <span className="text-success">Ya está activada</span>}
                        </div>
                      );
                    })()}
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
                        const asunto = 'Notificación desde la plataforma';
                        const mensaje = form.elements[1].value;
                        try {
                          // Usar el servicio correcto y el body esperado por el backend, incluyendo remitente visible
                          await import('../../services/emailService').then(({ sendEmail }) =>
                            sendEmail({
                              to: destinatario,
                              subject: asunto,
                              text: mensaje,
                              senderName: currentUser.firstName + ' ' + currentUser.lastName,
                              senderEmail: currentUser.email
                            })
                          );
                          setEmailSuccess('¡Email enviado correctamente!');
                          toast.success('¡Email enviado correctamente!');
                          form.reset();
                        } catch (err) {
                          setEmailError('Error al enviar el email.');
                          toast.error('Error al enviar el email.');
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
  <Form noValidate validated={validated} onSubmit={handleSubmit} encType="multipart/form-data">
          <Modal.Body>
            <Tabs defaultActiveKey="basic" className="mb-3">
              <Tab eventKey="basic" title="Información Básica">
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Avatar</Form.Label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="rounded-circle"
                          width="64"
                          height="64"
                          style={{ objectFit: 'cover', border: '1px solid #ccc' }}
                        />
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
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
                          value={formData.preferences?.location || ''}
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
                          value={formData.preferences?.propertyType || ''}
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
                          value={formData.preferences?.priceRange?.min || ''}
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
                          value={formData.preferences?.priceRange?.max || ''}
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
                          value={formData.preferences?.bedrooms || ''}
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
                          value={formData.preferences?.bathrooms || ''}
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