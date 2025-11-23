import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Badge,
  ProgressBar,
  Modal,
  ListGroup
} from 'react-bootstrap';
import { 
  FaShieldAlt, 
  FaEye, 
  FaEyeSlash, 
  FaBell, 
  FaPhone, 
  FaEnvelope, 
  FaIdCard,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUserData } from '@store/slices/authSlice';
import privacyService from '@services/privacyService';
import { 
  getUserAccessLevel, 
  getAccessLevelLabel, 
  getAccessLevelColor,
  getDefaultPrivacySettings,
  checkPermissionRequirements 
} from '@utils/permissionHelpers';
import { VERIFICATION_TYPES, ACCESS_LEVELS, PERMISSIONS } from '@utils/permissions';
import { toast } from 'react-toastify';

const PrivacySettingsPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  
  // Estados para configuración de privacidad
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    contactInfoVisibility: 'verified',
    activityHistoryVisibility: 'stats',
    notificationSettings: 'immediate'
  });
  
  useEffect(() => {
    if (currentUser) {
      // Cargar configuración actual o usar valores por defecto
      const currentSettings = currentUser.privacySettings || getDefaultPrivacySettings(currentUser);
      setPrivacySettings(currentSettings);
    }
  }, [currentUser]);
  
  const accessLevel = getUserAccessLevel(currentUser);
  const accessLevelLabel = getAccessLevelLabel(accessLevel);
  const accessLevelColor = getAccessLevelColor(accessLevel);
  
  // Información de verificaciones
  const verificationInfo = {
    [VERIFICATION_TYPES.EMAIL]: {
      icon: <FaEnvelope />,
      title: 'Email',
      description: 'Verifica tu dirección de correo electrónico',
      color: 'primary'
    },
    [VERIFICATION_TYPES.PHONE]: {
      icon: <FaPhone />,
      title: 'Teléfono',
      description: 'Verifica tu número de teléfono',
      color: 'info'
    },
    [VERIFICATION_TYPES.IDENTITY]: {
      icon: <FaIdCard />,
      title: 'Identidad',
      description: 'Verifica tu identidad con documento oficial',
      color: 'success'
    },
    [VERIFICATION_TYPES.PROFESSIONAL]: {
      icon: <FaGraduationCap />,
      title: 'Licencia Profesional',
      description: 'Verifica tu licencia inmobiliaria',
      color: 'warning'
    }
  };
  
  // Calcular progreso de verificación
  const getVerificationProgress = () => {
    const verifications = currentUser?.verifications || {};
    const requiredVerifications = [
      VERIFICATION_TYPES.EMAIL,
      VERIFICATION_TYPES.PHONE,
      VERIFICATION_TYPES.IDENTITY
    ];
    
    if (currentUser?.role === 'agent') {
      requiredVerifications.push(VERIFICATION_TYPES.PROFESSIONAL);
    }
    
    const completedCount = requiredVerifications.filter(type => 
      verifications[type]
    ).length;
    
    return {
      completed: completedCount,
      total: requiredVerifications.length,
      percentage: (completedCount / requiredVerifications.length) * 100
    };
  };
  
  const verificationProgress = getVerificationProgress();
  
  // Obtener estado de verificación
  const getVerificationStatus = (verificationType) => {
    const verifications = currentUser?.verifications || {};
    return verifications[verificationType] || false;
  };
  
  // Manejar cambios en configuración de privacidad
  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Guardar configuración de privacidad
  const handleSavePrivacySettings = async () => {
    setLoading(true);
    try {
      await privacyService.savePrivacy(privacySettings);
      dispatch(updateUserData({ privacySettings }));
      toast.success('Configuración de privacidad actualizada');
    } catch (error) {
      toast.error('Error al guardar configuración');
    } finally {
      setLoading(false);
    }
  };
  
  // Iniciar proceso de verificación
  const handleStartVerification = (verificationType) => {
    setSelectedVerification(verificationType);
    setShowVerificationModal(true);
  };
  
  // Simular proceso de verificación
  const handleCompleteVerification = async () => {
    setLoading(true);
    try {
      // Simular proceso de verificación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Actualizar estado de verificación
      const newVerifications = {
        ...currentUser.verifications,
        [selectedVerification]: true
      };
      
      dispatch(updateUserData({ verifications: newVerifications }));
      toast.success(`Verificación de ${verificationInfo[selectedVerification].title} completada`);
      setShowVerificationModal(false);
    } catch (error) {
      toast.error('Error en el proceso de verificación');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>
            <FaShieldAlt className="me-2" />
            Configuración de Privacidad y Seguridad
          </h2>
          <p className="text-muted">
            Gestiona tu privacidad, configuración de notificaciones y nivel de verificación
          </p>
        </Col>
      </Row>
      
      {/* Nivel de Acceso Actual */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>Nivel de Acceso Actual</h5>
            </Card.Header>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="d-flex align-items-center mb-2">
                    <Badge bg={accessLevelColor} className="me-2" style={{ fontSize: '1rem' }}>
                      {accessLevelLabel}
                    </Badge>
                    <span>Verificación {verificationProgress.percentage.toFixed(0)}% completa</span>
                  </div>
                  <ProgressBar 
                    now={verificationProgress.percentage} 
                    variant={accessLevelColor}
                    style={{ height: '8px' }}
                  />
                  <small className="text-muted">
                    {verificationProgress.completed} de {verificationProgress.total} verificaciones completadas
                  </small>
                </Col>
                <Col md={4} className="text-end">
                  {accessLevel === ACCESS_LEVELS.PROFESSIONAL ? (
                    <Alert variant="success" className="mb-0 p-2">
                      <FaCheckCircle className="me-1" />
                      Cuenta verificada completamente
                    </Alert>
                  ) : (
                    <Button 
                      variant="outline-primary"
                      onClick={() => setShowVerificationModal(true)}
                    >
                      Completar Verificación
                    </Button>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Estado de Verificaciones */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>Estado de Verificaciones</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {Object.keys(verificationInfo).map(verificationType => {
                  // Solo mostrar verificación profesional para agentes
                  if (verificationType === VERIFICATION_TYPES.PROFESSIONAL && 
                      currentUser?.role !== 'agent') {
                    return null;
                  }
                  
                  const info = verificationInfo[verificationType];
                  const isVerified = getVerificationStatus(verificationType);
                  
                  return (
                    <Col md={6} lg={3} key={verificationType} className="mb-3">
                      <Card className={`h-100 ${isVerified ? 'border-success' : 'border-warning'}`}>
                        <Card.Body className="text-center">
                          <div className={`mb-2 text-${info.color}`} style={{ fontSize: '2rem' }}>
                            {info.icon}
                          </div>
                          <h6>{info.title}</h6>
                          <p className="text-muted small">{info.description}</p>
                          {isVerified ? (
                            <Badge bg="success">
                              <FaCheckCircle className="me-1" />
                              Verificado
                            </Badge>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline-primary"
                              onClick={() => handleStartVerification(verificationType)}
                            >
                              Verificar
                            </Button>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Configuración de Privacidad */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>Configuración de Privacidad</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                {/* Visibilidad del Perfil */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Label>
                      <FaEye className="me-2" />
                      Visibilidad del Perfil
                    </Form.Label>
                    <Form.Text className="d-block text-muted">
                      Quién puede ver tu perfil público
                    </Form.Text>
                  </Col>
                  <Col md={8}>
                    <Form.Select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    >
                      <option value="public">Público - Todos pueden ver</option>
                      <option value="contacts">Solo Contactos - Solo con quien has hablado</option>
                      <option value="private">Privado - Solo tú</option>
                    </Form.Select>
                  </Col>
                </Row>
                
                {/* Información de Contacto */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Label>
                      <FaPhone className="me-2" />
                      Información de Contacto
                    </Form.Label>
                    <Form.Text className="d-block text-muted">
                      Quién puede ver tu teléfono y email
                    </Form.Text>
                  </Col>
                  <Col md={8}>
                    <Form.Select
                      value={privacySettings.contactInfoVisibility}
                      onChange={(e) => handlePrivacyChange('contactInfoVisibility', e.target.value)}
                    >
                      <option value="hidden">Oculto - Nadie puede ver</option>
                      <option value="verified">Solo Verificados - Solo usuarios verificados</option>
                      <option value="all">Todos - Cualquier usuario</option>
                    </Form.Select>
                  </Col>
                </Row>
                
                {/* Historial de Actividad */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Label>
                      <FaEyeSlash className="me-2" />
                      Historial de Actividad
                    </Form.Label>
                    <Form.Text className="d-block text-muted">
                      Qué información de actividad mostrar
                    </Form.Text>
                  </Col>
                  <Col md={8}>
                    <Form.Select
                      value={privacySettings.activityHistoryVisibility}
                      onChange={(e) => handlePrivacyChange('activityHistoryVisibility', e.target.value)}
                    >
                      <option value="visible">Visible - Mostrar actividad completa</option>
                      <option value="stats">Solo Estadísticas - Solo números generales</option>
                      <option value="hidden">Oculto - No mostrar actividad</option>
                    </Form.Select>
                  </Col>
                </Row>
                
                {/* Configuración de Notificaciones */}
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Label>
                      <FaBell className="me-2" />
                      Notificaciones
                    </Form.Label>
                    <Form.Text className="d-block text-muted">
                      Frecuencia de notificaciones
                    </Form.Text>
                  </Col>
                  <Col md={8}>
                    <Form.Select
                      value={privacySettings.notificationSettings}
                      onChange={(e) => handlePrivacyChange('notificationSettings', e.target.value)}
                    >
                      <option value="immediate">Inmediatas - Al momento</option>
                      <option value="daily">Resumen Diario - Una vez al día</option>
                      <option value="disabled">Desactivadas - Sin notificaciones</option>
                    </Form.Select>
                  </Col>
                </Row>
                
                <hr />
                
                <div className="d-flex justify-content-end">
                  <Button 
                    variant="primary"
                    onClick={handleSavePrivacySettings}
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar Configuración'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Modal de Verificación */}
      <Modal show={showVerificationModal} onHide={() => setShowVerificationModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedVerification ? 
              `Verificar ${verificationInfo[selectedVerification]?.title}` : 
              'Proceso de Verificación'
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVerification ? (
            <div>
              <div className="text-center mb-4">
                <div className="text-primary mb-3" style={{ fontSize: '3rem' }}>
                  {verificationInfo[selectedVerification]?.icon}
                </div>
                <h5>{verificationInfo[selectedVerification]?.title}</h5>
                <p className="text-muted">{verificationInfo[selectedVerification]?.description}</p>
              </div>
              
              <Alert variant="info">
                <strong>Proceso de verificación:</strong><br />
                Este es un proceso simulado. En una implementación real, aquí se integrarían 
                servicios de verificación de identidad, SMS, email, etc.
              </Alert>
              
              {loading && (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Verificando...</span>
                  </div>
                  <p className="mt-2">Procesando verificación...</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h6>Verificaciones Pendientes</h6>
              <ListGroup>
                {Object.keys(verificationInfo).map(verificationType => {
                  if (verificationType === VERIFICATION_TYPES.PROFESSIONAL && 
                      currentUser?.role !== 'agent') return null;
                  
                  const isVerified = getVerificationStatus(verificationType);
                  const info = verificationInfo[verificationType];
                  
                  return (
                    <ListGroup.Item 
                      key={verificationType}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        <div className={`me-3 text-${info.color}`}>
                          {info.icon}
                        </div>
                        <div>
                          <h6 className="mb-0">{info.title}</h6>
                          <small className="text-muted">{info.description}</small>
                        </div>
                      </div>
                      {isVerified ? (
                        <Badge bg="success">
                          <FaCheckCircle className="me-1" />
                          Verificado
                        </Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => handleStartVerification(verificationType)}
                        >
                          Verificar
                        </Button>
                      )}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVerificationModal(false)}>
            Cerrar
          </Button>
          {selectedVerification && !loading && (
            <Button variant="primary" onClick={handleCompleteVerification}>
              Completar Verificación
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PrivacySettingsPage;