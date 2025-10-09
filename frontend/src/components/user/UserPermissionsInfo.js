import React from 'react';
import { Card, Badge, Row, Col, Alert, ProgressBar } from 'react-bootstrap';
import { 
  FaShieldAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaInfoCircle
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import { 
  getUserAccessLevel, 
  getAccessLevelLabel, 
  getAccessLevelColor,
  getUserPermissions,
  getUserLimits
} from '@utils/permissionHelpers';
import { VERIFICATION_TYPES, PERMISSIONS } from '@utils/permissions';

/**
 * Componente que muestra información detallada sobre permisos y verificaciones del usuario
 */
const UserPermissionsInfo = ({ showDetails = false }) => {
  const currentUser = useSelector(selectCurrentUser);
  
  if (!currentUser) return null;
  
  const accessLevel = getUserAccessLevel(currentUser);
  const accessLevelLabel = getAccessLevelLabel(accessLevel);
  const accessLevelColor = getAccessLevelColor(accessLevel);
  const userPermissions = getUserPermissions(currentUser);
  const userLimits = getUserLimits(currentUser);
  
  // Calcular progreso de verificación
  const getVerificationProgress = () => {
    const verifications = currentUser.verifications || {};
    const requiredVerifications = [
      VERIFICATION_TYPES.EMAIL,
      VERIFICATION_TYPES.PHONE,
      VERIFICATION_TYPES.IDENTITY
    ];
    
    if (currentUser.role === 'agent') {
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
  
  // Obtener permisos categorizados
  const categorizedPermissions = {
    conversation: userPermissions.filter(p => p.startsWith('conversation:')),
    message: userPermissions.filter(p => p.startsWith('message:')),
    info: userPermissions.filter(p => p.startsWith('info:')),
    admin: userPermissions.filter(p => p.startsWith('admin:')),
    property: userPermissions.filter(p => p.startsWith('property:')),
    offer: userPermissions.filter(p => p.startsWith('offer:')),
    privacy: userPermissions.filter(p => p.startsWith('privacy:'))
  };
  
  const permissionLabels = {
    'conversation:create': 'Crear conversaciones',
    'conversation:join_any': 'Unirse a cualquier conversación',
    'conversation:archive': 'Archivar conversaciones',
    'conversation:delete': 'Eliminar conversaciones',
    'message:send_text': 'Enviar mensajes de texto',
    'message:send_files': 'Enviar archivos',
    'message:send_legal_docs': 'Enviar documentos legales',
    'message:send_formal_offers': 'Enviar ofertas formales',
    'property:create': 'Crear propiedades',
    'property:make_offers': 'Hacer ofertas',
    'offer:create': 'Crear ofertas',
    'admin:moderate_conversations': 'Moderar conversaciones',
    'admin:view_analytics_advanced': 'Ver analytics avanzados'
  };
  
  if (!showDetails) {
    // Versión compacta
    return (
      <Card className="mb-3">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center">
                <FaShieldAlt className="me-2 text-primary" />
                <div>
                  <strong>Nivel de Acceso: </strong>
                  <Badge bg={accessLevelColor}>{accessLevelLabel}</Badge>
                  <div className="small text-muted">
                    Verificación {verificationProgress.percentage.toFixed(0)}% completa
                  </div>
                </div>
              </div>
            </Col>
            <Col xs="auto">
              <ProgressBar 
                now={verificationProgress.percentage} 
                variant={accessLevelColor}
                style={{ width: '100px', height: '6px' }}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
  
  // Versión detallada
  return (
    <div>
      {/* Resumen de Nivel de Acceso */}
      <Card className="mb-4">
        <Card.Header>
          <h5>
            <FaShieldAlt className="me-2" />
            Nivel de Acceso
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <div className="d-flex align-items-center mb-3">
                <Badge bg={accessLevelColor} className="me-2" style={{ fontSize: '1.1rem' }}>
                  {accessLevelLabel}
                </Badge>
                <span>({verificationProgress.completed}/{verificationProgress.total} verificaciones)</span>
              </div>
              <ProgressBar 
                now={verificationProgress.percentage} 
                variant={accessLevelColor}
                className="mb-2"
                style={{ height: '10px' }}
              />
              <small className="text-muted">
                Verificación {verificationProgress.percentage.toFixed(0)}% completa
              </small>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="h4 mb-0">{userPermissions.length}</div>
                <small className="text-muted">Permisos activos</small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Estado de Verificaciones */}
      <Card className="mb-4">
        <Card.Header>
          <h6>Estado de Verificaciones</h6>
        </Card.Header>
        <Card.Body>
          <Row>
            {Object.values(VERIFICATION_TYPES).map(verificationType => {
              // Solo mostrar verificación profesional para agentes
              if (verificationType === VERIFICATION_TYPES.PROFESSIONAL && 
                  currentUser.role !== 'agent') {
                return null;
              }
              
              const isVerified = currentUser.verifications?.[verificationType] || false;
              
              const verificationNames = {
                [VERIFICATION_TYPES.EMAIL]: 'Email',
                [VERIFICATION_TYPES.PHONE]: 'Teléfono',
                [VERIFICATION_TYPES.IDENTITY]: 'Identidad',
                [VERIFICATION_TYPES.PROFESSIONAL]: 'Licencia Pro'
              };
              
              return (
                <Col xs={6} md={3} key={verificationType} className="mb-2">
                  <div className="d-flex align-items-center">
                    {isVerified ? (
                      <FaCheckCircle className="text-success me-2" />
                    ) : (
                      <FaTimesCircle className="text-danger me-2" />
                    )}
                    <small>{verificationNames[verificationType]}</small>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
      </Card>
      
      {/* Límites de Usuario */}
      {Object.keys(userLimits).length > 0 && (
        <Card className="mb-4">
          <Card.Header>
            <h6>Límites de Cuenta</h6>
          </Card.Header>
          <Card.Body>
            <Row>
              {userLimits.maxActiveConversations && (
                <Col md={6} className="mb-2">
                  <small className="text-muted">Conversaciones activas máx:</small>
                  <div><strong>{userLimits.maxActiveConversations}</strong></div>
                </Col>
              )}
              {userLimits.maxDailyMessages && (
                <Col md={6} className="mb-2">
                  <small className="text-muted">Mensajes diarios máx:</small>
                  <div><strong>{userLimits.maxDailyMessages}</strong></div>
                </Col>
              )}
              {userLimits.maxFileUploadSize && (
                <Col md={6} className="mb-2">
                  <small className="text-muted">Tamaño archivo máx:</small>
                  <div><strong>{(userLimits.maxFileUploadSize / 1024 / 1024).toFixed(0)}MB</strong></div>
                </Col>
              )}
              {userLimits.maxPropertiesListed && (
                <Col md={6} className="mb-2">
                  <small className="text-muted">Propiedades máx:</small>
                  <div><strong>{userLimits.maxPropertiesListed}</strong></div>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      )}
      
      {/* Permisos por Categoría */}
      <Card>
        <Card.Header>
          <h6>Permisos Detallados</h6>
        </Card.Header>
        <Card.Body>
          {Object.entries(categorizedPermissions).map(([category, permissions]) => {
            if (permissions.length === 0) return null;
            
            const categoryNames = {
              conversation: 'Conversaciones',
              message: 'Mensajes',
              info: 'Información',
              admin: 'Administración',
              property: 'Propiedades',
              offer: 'Ofertas',
              privacy: 'Privacidad'
            };
            
            return (
              <div key={category} className="mb-3">
                <h6 className="text-primary">{categoryNames[category]}</h6>
                <Row>
                  {permissions.map(permission => (
                    <Col xs={12} md={6} key={permission} className="mb-1">
                      <small className="d-flex align-items-center">
                        <FaCheckCircle className="text-success me-2" size="0.8em" />
                        {permissionLabels[permission] || permission.replace(/^[^:]+:/, '').replace(/_/g, ' ')}
                      </small>
                    </Col>
                  ))}
                </Row>
              </div>
            );
          })}
        </Card.Body>
      </Card>
      
      {/* Información adicional para mejorar nivel */}
      {verificationProgress.percentage < 100 && (
        <Alert variant="info" className="mt-4">
          <FaInfoCircle className="me-2" />
          <strong>¿Quieres desbloquear más funcionalidades?</strong><br />
          Completa tu verificación para acceder a todas las funciones de la plataforma.
          {currentUser.role === 'agent' && verificationProgress.percentage < 100 && (
            <span> Como agente, la verificación profesional te dará acceso a herramientas avanzadas.</span>
          )}
        </Alert>
      )}
    </div>
  );
};

export default UserPermissionsInfo;