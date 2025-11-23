import React from 'react';
import { useSelector } from 'react-redux';
import { Alert, Container, Button, Row, Col, Card } from 'react-bootstrap';
import { FaLock, FaShieldAlt, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';
import { hasPermission, checkPermissionRequirements, getUserAccessLevel, getAccessLevelLabel } from '@utils/permissionHelpers';
import { VERIFICATION_TYPES } from '@utils/permissions';
import { selectCurrentUser, selectIsAuthenticated } from '@store/slices/authSlice';

/**
 * HOC que envuelve componentes y verifica permisos
 * @param {React.Component} WrappedComponent - Componente a envolver
 * @param {Object} options - Opciones de configuración
 * @param {string|Array} options.permissions - Permiso(s) requerido(s)
 * @param {string} options.fallbackType - Tipo de fallback ('alert', 'redirect', 'hide')
 * @param {string} options.fallbackMessage - Mensaje personalizado
 * @param {boolean} options.requireAuth - Si requiere autenticación
 * @param {string} options.requireAny - Si requiere alguno de los permisos (por defecto requiere todos)
 */
export const withPermissions = (WrappedComponent, options = {}) => {
  return function PermissionWrappedComponent(props) {
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    
    const {
      permissions = [],
      fallbackType = 'alert',
      fallbackMessage,
      requireAuth = true,
      requireAny = false
    } = options;
    
    // Verificar autenticación si es requerida
    if (requireAuth && !isAuthenticated) {
      if (fallbackType === 'hide') return null;
      
      return (
        <Container className="mt-5">
          <Alert variant="warning">
            <FaLock className="me-2" />
            Debes iniciar sesión para acceder a esta funcionalidad.
          </Alert>
        </Container>
      );
    }
    
    // Si no hay permisos especificados, renderizar componente
    if (!permissions || permissions.length === 0) {
      return <WrappedComponent {...props} />;
    }
    
    // Convertir a array si es string
    const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
    
    // Verificar permisos
    let hasRequiredPermissions = false;
    if (requireAny) {
      hasRequiredPermissions = permissionsArray.some(permission => 
        hasPermission(user, permission)
      );
    } else {
      hasRequiredPermissions = permissionsArray.every(permission => 
        hasPermission(user, permission)
      );
    }
    
    if (hasRequiredPermissions) {
      return <WrappedComponent {...props} />;
    }
    
    // Verificar qué verificaciones faltan para el primer permiso
    const permissionCheck = checkPermissionRequirements(user, permissionsArray[0]);
    
    if (fallbackType === 'hide') return null;
    
    if (fallbackType === 'verification' && permissionCheck.missingVerifications.length > 0) {
      return <VerificationRequired missingVerifications={permissionCheck.missingVerifications} />;
    }
    
    // Fallback por defecto: mostrar alerta
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <FaShieldAlt className="me-2" />
          {fallbackMessage || `No tienes permisos para acceder a esta funcionalidad. Nivel de acceso actual: ${getAccessLevelLabel(getUserAccessLevel(user))}`}
        </Alert>
      </Container>
    );
  };
};

/**
 * Componente que muestra qué verificaciones faltan
 */
const VerificationRequired = ({ missingVerifications }) => {
  const getVerificationInfo = (verificationType) => {
    const info = {
      [VERIFICATION_TYPES.EMAIL]: {
        icon: <FaEnvelope />,
        title: 'Verificación de Email',
        description: 'Verifica tu dirección de correo electrónico',
        action: 'Verificar Email'
      },
      [VERIFICATION_TYPES.PHONE]: {
        icon: <FaPhone />,
        title: 'Verificación de Teléfono',
        description: 'Verifica tu número de teléfono',
        action: 'Verificar Teléfono'
      },
      [VERIFICATION_TYPES.IDENTITY]: {
        icon: <FaIdCard />,
        title: 'Verificación de Identidad',
        description: 'Verifica tu identidad con documento oficial',
        action: 'Verificar Identidad'
      },
      [VERIFICATION_TYPES.PROFESSIONAL]: {
        icon: <FaShieldAlt />,
        title: 'Verificación Profesional',
        description: 'Verifica tu licencia profesional inmobiliaria',
        action: 'Verificar Licencia'
      }
    };
    
    return info[verificationType] || {
      icon: <FaLock />,
      title: 'Verificación Requerida',
      description: 'Se requiere verificación adicional',
      action: 'Verificar'
    };
  };
  
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5><FaShieldAlt className="me-2" />Verificación Requerida</h5>
            </Card.Header>
            <Card.Body>
              <p>Para acceder a esta funcionalidad, necesitas completar las siguientes verificaciones:</p>
              
              {missingVerifications.map((verificationType, index) => {
                const verificationInfo = getVerificationInfo(verificationType);
                
                return (
                  <Card key={index} className="mb-3">
                    <Card.Body className="d-flex align-items-center">
                      <div className="me-3" style={{ fontSize: '1.5rem' }}>
                        {verificationInfo.icon}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{verificationInfo.title}</h6>
                        <p className="mb-0 text-muted">{verificationInfo.description}</p>
                      </div>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => {
                          // Aquí iría la lógica para iniciar el proceso de verificación
                          console.log(`Iniciar verificación: ${verificationType}`);
                        }}
                      >
                        {verificationInfo.action}
                      </Button>
                    </Card.Body>
                  </Card>
                );
              })}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

/**
 * Componente que renderiza contenido basado en permisos
 * @param {Object} props
 * @param {string|Array} props.permissions - Permiso(s) requerido(s)
 * @param {React.Node} props.children - Contenido a mostrar si tiene permisos
 * @param {React.Node} props.fallback - Contenido a mostrar si no tiene permisos
 * @param {boolean} props.requireAny - Si requiere alguno de los permisos
 * @param {boolean} props.requireAuth - Si requiere autenticación
 */
export const PermissionGate = ({ 
  permissions, 
  children, 
  fallback = null, 
  requireAny = false, 
  requireAuth = true 
}) => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Verificar autenticación si es requerida
  if (requireAuth && !isAuthenticated) {
    return fallback;
  }
  
  // Si no hay permisos especificados, mostrar contenido
  if (!permissions || permissions.length === 0) {
    return children;
  }
  
  // Convertir a array si es string
  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
  
  // Verificar permisos
  let hasRequiredPermissions = false;
  if (requireAny) {
    hasRequiredPermissions = permissionsArray.some(permission => 
      hasPermission(user, permission)
    );
  } else {
    hasRequiredPermissions = permissionsArray.every(permission => 
      hasPermission(user, permission)
    );
  }
  
  return hasRequiredPermissions ? children : fallback;
};

/**
 * Hook personalizado para verificar permisos
 * @param {string|Array} permissions - Permiso(s) a verificar
 * @param {boolean} requireAny - Si requiere alguno de los permisos
 * @returns {Object} { hasPermission: boolean, user: Object, missingVerifications: Array }
 */
export const usePermissions = (permissions, requireAny = false) => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (!isAuthenticated || !permissions) {
    return { 
      hasPermission: false, 
      user, 
      isAuthenticated,
      missingVerifications: [] 
    };
  }
  
  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
  
  let hasRequiredPermissions = false;
  if (requireAny) {
    hasRequiredPermissions = permissionsArray.some(permission => 
      hasPermission(user, permission)
    );
  } else {
    hasRequiredPermissions = permissionsArray.every(permission => 
      hasPermission(user, permission)
    );
  }
  
  // Obtener verificaciones faltantes para el primer permiso
  const permissionCheck = checkPermissionRequirements(user, permissionsArray[0]);
  
  return {
    hasPermission: hasRequiredPermissions,
    user,
    isAuthenticated,
    missingVerifications: permissionCheck.missingVerifications
  };
};

export default {
  withPermissions,
  PermissionGate,
  usePermissions,
  VerificationRequired
};