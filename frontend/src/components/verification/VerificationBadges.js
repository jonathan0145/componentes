import React from 'react';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaCheckCircle, FaEnvelope, FaPhone, FaIdCard, FaUserTie, FaShieldAlt } from 'react-icons/fa';

const VerificationBadges = ({ verifications, size = 'sm', showAll = false, maxBadges = 3 }) => {
  const badgeConfig = {
    email: {
      icon: <FaEnvelope />,
      color: 'primary',
      title: 'Email Verificado',
      description: 'Dirección de correo electrónico confirmada'
    },
    phone: {
      icon: <FaPhone />,
      color: 'success', 
      title: 'Teléfono Verificado',
      description: 'Número de teléfono confirmado'
    },
    identity: {
      icon: <FaIdCard />,
      color: 'info',
      title: 'Identidad Verificada',
      description: 'Documentos de identidad validados'
    },
    professional: {
      icon: <FaUserTie />,
      color: 'warning',
      title: 'Agente Certificado',
      description: 'Credenciales profesionales verificadas'
    }
  };

  if (!verifications) return null;

  const verifiedTypes = Object.entries(verifications)
    .filter(([type, verification]) => verification.status === 'verified')
    .map(([type]) => type);

  const badgesToShow = showAll ? verifiedTypes : verifiedTypes.slice(0, maxBadges);
  const remainingCount = verifiedTypes.length - badgesToShow.length;

  if (verifiedTypes.length === 0) return null;

  return (
    <div className="d-flex align-items-center gap-1 flex-wrap">
      {badgesToShow.map(type => {
        const config = badgeConfig[type];
        if (!config) return null;

        return (
          <OverlayTrigger
            key={type}
            placement="top"
            overlay={
              <Tooltip>
                <strong>{config.title}</strong>
                <br />
                {config.description}
              </Tooltip>
            }
          >
            <Badge 
              bg={config.color} 
              className={`d-flex align-items-center gap-1 ${size === 'lg' ? 'p-2' : 'p-1'}`}
              style={{ cursor: 'help' }}
            >
              {config.icon}
              {size === 'lg' && (
                <span className="ms-1">{config.title}</span>
              )}
            </Badge>
          </OverlayTrigger>
        );
      })}

      {remainingCount > 0 && (
        <Badge bg="secondary" className="p-1">
          +{remainingCount}
        </Badge>
      )}

      {verifiedTypes.length >= 3 && (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              <strong>Usuario Verificado</strong>
              <br />
              Ha completado múltiples verificaciones
            </Tooltip>
          }
        >
          <Badge 
            bg="success" 
            className="d-flex align-items-center gap-1 p-1"
            style={{ cursor: 'help' }}
          >
            <FaShieldAlt />
            {size === 'lg' && <span className="ms-1">Verificado</span>}
          </Badge>
        </OverlayTrigger>
      )}
    </div>
  );
};

export default VerificationBadges;