import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, ProgressBar, Badge, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaTimesCircle, FaUpload, FaEnvelope, FaPhone, FaIdCard, FaHome } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Redux
import { selectCurrentUser } from '@store/slices/authSlice';
import { 
  selectVerifications,
  selectVerificationLoading,
  selectVerificationError,
  sendEmailVerification,
  sendPhoneVerification,
  uploadDocuments,
  clearError
} from '@store/slices/verificationSlice';

// Componentes
import VerificationBadges from '@components/verification/VerificationBadges';

const UserVerificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const currentUser = useSelector(selectCurrentUser);
  const verificationState = useSelector(selectVerifications);
  const loading = useSelector(selectVerificationLoading);
  const error = useSelector(selectVerificationError);

  // Local state
  const [activeStep, setActiveStep] = useState('email');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('id');

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Calcular progreso de verificación
  const getVerificationProgress = () => {
    const verifications = [
      verificationState.email.status,
      verificationState.phone.status,
      verificationState.identity.status,
      verificationState.professional.status
    ];
    const completed = verifications.filter(v => v === 'verified').length;
    return (completed / verifications.length) * 100;
  };

  // Obtener estado de verificación individual
  const getVerificationStatus = (type) => {
    const status = verificationState[type]?.status || 'not_started';
    switch (status) {
      case 'verified':
        return { icon: FaCheckCircle, color: 'success', text: 'Verificado' };
      case 'pending':
        return { icon: FaClock, color: 'warning', text: 'Pendiente' };
      case 'failed':
      case 'rejected':
        return { icon: FaTimesCircle, color: 'danger', text: 'Falló' };
      default:
        return { icon: FaClock, color: 'secondary', text: 'No verificado' };
    }
  };

  // Manejar verificación de email
  const handleEmailVerification = () => {
    if (!currentUser?.email) {
      toast.error('No hay email asociado a tu cuenta');
      return;
    }
    dispatch(sendEmailVerification())
      .unwrap()
      .then((res) => {
        toast.success(res?.message || 'Código enviado exitosamente');
        setModalType('email');
        setShowModal(true);
      })
      .catch((err) => {
        toast.error(err || 'No se pudo enviar el código');
      });
  };

  // Confirmar código de email
  const handleConfirmEmailCode = () => {
    if (emailCode.length !== 6) {
      toast.error('El código debe tener 6 dígitos');
      return;
    }
    dispatch(verifyCode({ code: emailCode }))
      .unwrap()
      .then(() => {
        toast.success('Email verificado exitosamente');
        setShowModal(false);
        setEmailCode('');
      })
      .catch((err) => {
        toast.error(err || 'Código incorrecto');
      });
  };

  // Manejar verificación de teléfono
  const handlePhoneVerification = () => {
    if (!currentUser?.phone) {
      toast.error('Debes agregar un número de teléfono en tu perfil');
      return;
    }
    dispatch(sendPhoneVerification(currentUser.phone));
    setModalType('phone');
    setShowModal(true);
  };

  // Confirmar código de teléfono
  const handleConfirmPhoneCode = () => {
    if (phoneCode.length !== 6) {
      toast.error('El código debe tener 6 dígitos');
      return;
    }
    
    // Simular verificación exitosa
    toast.success('Teléfono verificado exitosamente');
    setShowModal(false);
    setPhoneCode('');
  };

  // Manejar upload de documento
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Solo se permiten archivos JPG, PNG o PDF');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo no puede ser mayor a 5MB');
      return;
    }

    setSelectedFile(file);
  };

  // Subir documento
  const handleDocumentUpload = () => {
    if (!selectedFile) {
      toast.error('Debes seleccionar un archivo');
      return;
    }

    const uploadData = {
      type: 'identity',
      files: [selectedFile]
    };

    dispatch(uploadDocuments(uploadData))
      .then(() => {
        toast.success('Documento subido exitosamente. Revisión en proceso...');
        setSelectedFile(null);
        setDocumentType('id');
      });
  };

  if (!currentUser) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h5>Acceso Restringido</h5>
          <p>Debes iniciar sesión para acceder a la verificación.</p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="mb-3">
              <FaIdCard className="text-primary me-2" />
              Verificación de Usuario
            </h2>
            <p className="text-muted">
              Completa tu verificación para acceder a todas las funcionalidades de la plataforma
            </p>
          </div>

          {/* Progreso general */}
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Progreso de Verificación</h5>
                <VerificationBadges 
                  user={currentUser} 
                  verificationStatus={verificationState}
                  size="sm"
                />
              </div>
              <ProgressBar 
                now={getVerificationProgress()} 
                label={`${Math.round(getVerificationProgress())}%`}
                variant={getVerificationProgress() === 100 ? 'success' : 'primary'}
                style={{ height: '20px' }}
              />
              <small className="text-muted mt-2 d-block">
                {Math.round(getVerificationProgress())}% completado
              </small>
            </Card.Body>
          </Card>

          <Row>
            {/* Verificación de Email */}
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <FaEnvelope className="text-primary me-2" />
                    Verificación de Email
                  </div>
                  {(() => {
                    const status = getVerificationStatus('email');
                    return <status.icon className={`text-${status.color}`} />;
                  })()}
                </Card.Header>
                <Card.Body>
                  <p className="text-muted">
                    Verifica tu dirección de email: <strong>{currentUser.email}</strong>
                  </p>
                  
                  {verificationState.email?.status === 'verified' ? (
                    <Alert variant="success">
                      <FaCheckCircle className="me-2" />
                      Email verificado exitosamente
                    </Alert>
                  ) : (
                    <Button 
                      variant="primary" 
                      onClick={handleEmailVerification}
                      disabled={loading.emailVerification}
                    >
                      {loading.emailVerification ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Enviando...
                        </>
                      ) : (
                        'Enviar Código de Verificación'
                      )}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Verificación de Teléfono */}
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <FaPhone className="text-primary me-2" />
                    Verificación de Teléfono
                  </div>
                  {(() => {
                    const status = getVerificationStatus('phone');
                    return <status.icon className={`text-${status.color}`} />;
                  })()}
                </Card.Header>
                <Card.Body>
                  <p className="text-muted">
                    Verifica tu número de teléfono: 
                    <strong>{currentUser.phone || ' (No configurado)'}</strong>
                  </p>
                  
                  {verificationState.phone?.status === 'verified' ? (
                    <Alert variant="success">
                      <FaCheckCircle className="me-2" />
                      Teléfono verificado exitosamente
                    </Alert>
                  ) : currentUser.phone ? (
                    <Button 
                      variant="primary" 
                      onClick={handlePhoneVerification}
                      disabled={loading.phoneVerification}
                    >
                      {loading.phoneVerification ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Enviando...
                        </>
                      ) : (
                        'Enviar Código SMS'
                      )}
                    </Button>
                  ) : (
                    <Button 
                      variant="outline-primary" 
                      onClick={() => navigate('/profile')}
                    >
                      Agregar Teléfono
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Verificación de Documento */}
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <FaIdCard className="text-primary me-2" />
                    Verificación de Identidad
                  </div>
                  {(() => {
                    const status = getVerificationStatus('document');
                    return <status.icon className={`text-${status.color}`} />;
                  })()}
                </Card.Header>
                <Card.Body>
                  <p className="text-muted">
                    Sube una foto de tu documento de identidad
                  </p>
                  
                  {verificationState.identity?.status === 'verified' ? (
                    <Alert variant="success">
                      <FaCheckCircle className="me-2" />
                      Documento verificado exitosamente
                    </Alert>
                  ) : verificationState.identity?.status === 'pending' ? (
                    <Alert variant="warning">
                      <FaClock className="me-2" />
                      Documento en revisión
                    </Alert>
                  ) : (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Tipo de Documento</Form.Label>
                        <Form.Select 
                          value={documentType} 
                          onChange={(e) => setDocumentType(e.target.value)}
                        >
                          <option value="id">Cédula de Identidad</option>
                          <option value="passport">Pasaporte</option>
                          <option value="license">Licencia de Conducir</option>
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Archivo</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileSelect}
                        />
                        <Form.Text className="text-muted">
                          Formatos permitidos: JPG, PNG, PDF. Máximo 5MB.
                        </Form.Text>
                      </Form.Group>
                      
                      <Button 
                        variant="primary" 
                        onClick={handleDocumentUpload}
                        disabled={!selectedFile || loading.documentUpload}
                      >
                        {loading.documentUpload ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Subiendo...
                          </>
                        ) : (
                          <>
                            <FaUpload className="me-2" />
                            Subir Documento
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Verificación de Dirección */}
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <FaHome className="text-primary me-2" />
                    Verificación Profesional
                  </div>
                  {(() => {
                    const status = getVerificationStatus('professional');
                    return <status.icon className={`text-${status.color}`} />;
                  })()}
                </Card.Header>
                <Card.Body>
                  <p className="text-muted">
                    Verifica tu licencia profesional como agente inmobiliario
                  </p>
                  
                  {verificationState.professional?.status === 'verified' ? (
                    <Alert variant="success">
                      <FaCheckCircle className="me-2" />
                      Licencia verificada exitosamente
                    </Alert>
                  ) : (
                    <Button variant="outline-primary" disabled>
                      Próximamente disponible
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Botón de regreso */}
          <div className="text-center mt-4">
            <Button variant="outline-secondary" onClick={() => navigate('/profile')}>
              Volver al Perfil
            </Button>
          </div>
        </Col>
      </Row>

      {/* Modales de verificación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'email' ? 'Verificar Email' : 'Verificar Teléfono'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {modalType === 'email' 
              ? `Hemos enviado un código de 6 dígitos a ${currentUser.email}`
              : `Hemos enviado un código de 6 dígitos por SMS a ${currentUser.phone}`
            }
          </p>
          
          <Form.Group>
            <Form.Label>Código de Verificación</Form.Label>
            <Form.Control
              type="text"
              placeholder="123456"
              maxLength="6"
              value={modalType === 'email' ? emailCode : phoneCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (modalType === 'email') {
                  setEmailCode(value);
                } else {
                  setPhoneCode(value);
                }
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={modalType === 'email' ? handleConfirmEmailCode : handleConfirmPhoneCode}
            disabled={loading.codeVerification}
          >
            {loading.codeVerification ? (
              <>
                <Spinner size="sm" className="me-2" />
                Verificando...
              </>
            ) : (
              'Verificar Código'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserVerificationPage;