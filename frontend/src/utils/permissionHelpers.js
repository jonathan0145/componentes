import { 
  USER_ROLES, 
  ACCESS_LEVELS, 
  PERMISSIONS, 
  ROLE_PERMISSIONS, 
  ROLE_LIMITS,
  DEFAULT_PRIVACY_SETTINGS,
  VERIFICATION_TYPES
} from './permissions';

/**
 * Determina el nivel de acceso de un usuario basado en sus verificaciones
 * @param {Object} user - Objeto usuario con verificaciones
 * @returns {string} Nivel de acceso (basic, verified, professional)
 */
export const getUserAccessLevel = (user) => {
  if (!user) return ACCESS_LEVELS.BASIC;
  
  const verifications = user.verifications || {};
  
  // Para agentes: verificar si tienen nivel profesional
  if (user.role === USER_ROLES.AGENT) {
    if (verifications[VERIFICATION_TYPES.PROFESSIONAL] && 
        verifications[VERIFICATION_TYPES.IDENTITY] &&
        verifications[VERIFICATION_TYPES.EMAIL] &&
        verifications[VERIFICATION_TYPES.PHONE]) {
      return ACCESS_LEVELS.PROFESSIONAL;
    }
  }
  
  // Verificación completa (verificado)
  if (verifications[VERIFICATION_TYPES.EMAIL] && 
      verifications[VERIFICATION_TYPES.PHONE] && 
      verifications[VERIFICATION_TYPES.IDENTITY]) {
    return ACCESS_LEVELS.VERIFIED;
  }
  
  // Solo email verificado (básico)
  return ACCESS_LEVELS.BASIC;
};

/**
 * Obtiene todos los permisos de un usuario
 * @param {Object} user - Objeto usuario
 * @returns {Array} Array de permisos
 */
export const getUserPermissions = (user) => {
  if (!user || !user.role) return [];
  
  const accessLevel = getUserAccessLevel(user);
  const rolePermissions = ROLE_PERMISSIONS[user.role];
  
  if (!rolePermissions) return [];
  
  return rolePermissions[accessLevel] || [];
};

/**
 * Verifica si un usuario tiene un permiso específico
 * @param {Object} user - Objeto usuario
 * @param {string} permission - Permiso a verificar
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user || !permission) return false;
  
  const userPermissions = getUserPermissions(user);
  return userPermissions.includes(permission);
};

/**
 * Verifica si un usuario tiene alguno de los permisos especificados
 * @param {Object} user - Objeto usuario
 * @param {Array} permissions - Array de permisos
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions) => {
  if (!user || !permissions || !Array.isArray(permissions)) return false;
  
  const userPermissions = getUserPermissions(user);
  return permissions.some(permission => userPermissions.includes(permission));
};

/**
 * Verifica si un usuario tiene todos los permisos especificados
 * @param {Object} user - Objeto usuario
 * @param {Array} permissions - Array de permisos
 * @returns {boolean}
 */
export const hasAllPermissions = (user, permissions) => {
  if (!user || !permissions || !Array.isArray(permissions)) return false;
  
  const userPermissions = getUserPermissions(user);
  return permissions.every(permission => userPermissions.includes(permission));
};

/**
 * Obtiene los límites aplicables a un usuario
 * @param {Object} user - Objeto usuario
 * @returns {Object} Objeto con límites
 */
export const getUserLimits = (user) => {
  if (!user || !user.role) return {};
  
  const accessLevel = getUserAccessLevel(user);
  const roleLimits = ROLE_LIMITS[user.role];
  
  if (!roleLimits) return {};
  
  return roleLimits[accessLevel] || {};
};

/**
 * Verifica si un usuario puede realizar una acción basada en límites
 * @param {Object} user - Objeto usuario
 * @param {string} limitType - Tipo de límite a verificar
 * @param {number} currentValue - Valor actual
 * @returns {boolean}
 */
export const isWithinLimit = (user, limitType, currentValue) => {
  const limits = getUserLimits(user);
  const limit = limits[limitType];
  
  if (typeof limit === 'undefined') return true; // Sin límite definido
  if (typeof limit === 'boolean') return limit;
  if (typeof limit === 'number') return currentValue < limit;
  
  return true;
};

/**
 * Obtiene la configuración de privacidad por defecto para un usuario
 * @param {Object} user - Objeto usuario
 * @returns {Object} Configuración de privacidad
 */
export const getDefaultPrivacySettings = (user) => {
  if (!user || !user.role) return {};
  
  return DEFAULT_PRIVACY_SETTINGS[user.role] || {};
};

/**
 * Verifica si un usuario puede acceder a información de contacto de otro usuario
 * @param {Object} viewer - Usuario que quiere ver la información
 * @param {Object} target - Usuario cuya información se quiere ver
 * @returns {boolean}
 */
export const canViewContactInfo = (viewer, target) => {
  if (!viewer || !target) return false;
  
  // Si es el mismo usuario
  if (viewer.id === target.id) return true;
  
  // Si el viewer es agente profesional, puede ver todo
  if (viewer.role === USER_ROLES.AGENT && getUserAccessLevel(viewer) === ACCESS_LEVELS.PROFESSIONAL) {
    return true;
  }
  
  // Verificar configuración de privacidad del target
  const targetPrivacy = target.privacySettings || getDefaultPrivacySettings(target);
  const contactInfoVisibility = targetPrivacy.contactInfoVisibility;
  
  switch (contactInfoVisibility) {
    case 'hidden':
      return false;
    case 'verified':
      return getUserAccessLevel(viewer) >= ACCESS_LEVELS.VERIFIED;
    case 'all':
      return true;
    default:
      return false;
  }
};

/**
 * Verifica si un usuario puede ver el perfil de otro usuario
 * @param {Object} viewer - Usuario que quiere ver el perfil
 * @param {Object} target - Usuario cuyo perfil se quiere ver
 * @returns {boolean}
 */
export const canViewProfile = (viewer, target) => {
  if (!viewer || !target) return false;
  
  // Si es el mismo usuario
  if (viewer.id === target.id) return true;
  
  // Verificar configuración de privacidad del target
  const targetPrivacy = target.privacySettings || getDefaultPrivacySettings(target);
  const profileVisibility = targetPrivacy.profileVisibility;
  
  switch (profileVisibility) {
    case 'public':
      return true;
    case 'contacts':
      // Verificar si son contactos (han tenido conversaciones)
      return viewer.contacts && viewer.contacts.includes(target.id);
    case 'private':
      return false;
    default:
      return true;
  }
};

/**
 * Obtiene el label de un rol en español
 * @param {string} role - Rol del usuario
 * @returns {string} Label en español
 */
export const getRoleLabel = (role) => {
  const labels = {
    [USER_ROLES.BUYER]: 'Comprador',
    [USER_ROLES.SELLER]: 'Vendedor',
    [USER_ROLES.AGENT]: 'Intermediario',
    [USER_ROLES.ADMIN]: 'Administrador'
  };
  
  return labels[role] || role;
};

/**
 * Obtiene el label de un nivel de acceso en español
 * @param {string} level - Nivel de acceso
 * @returns {string} Label en español
 */
export const getAccessLevelLabel = (level) => {
  const labels = {
    [ACCESS_LEVELS.BASIC]: 'Básico',
    [ACCESS_LEVELS.VERIFIED]: 'Verificado',
    [ACCESS_LEVELS.PROFESSIONAL]: 'Profesional'
  };
  
  return labels[level] || level;
};

/**
 * Obtiene el color para un rol
 * @param {string} role - Rol del usuario
 * @returns {string} Color Bootstrap
 */
export const getRoleColor = (role) => {
  const colors = {
    [USER_ROLES.BUYER]: 'primary',
    [USER_ROLES.SELLER]: 'success',
    [USER_ROLES.AGENT]: 'warning',
    [USER_ROLES.ADMIN]: 'danger',
    system: 'secondary'
  };
  
  return colors[role] || 'secondary';
};

/**
 * Obtiene el color para un nivel de acceso
 * @param {string} level - Nivel de acceso
 * @returns {string} Color Bootstrap
 */
export const getAccessLevelColor = (level) => {
  const colors = {
    [ACCESS_LEVELS.BASIC]: 'secondary',
    [ACCESS_LEVELS.VERIFIED]: 'success',
    [ACCESS_LEVELS.PROFESSIONAL]: 'warning'
  };
  
  return colors[level] || 'secondary';
};

/**
 * Verifica si un usuario necesita verificaciones adicionales para una acción
 * @param {Object} user - Objeto usuario
 * @param {string} permission - Permiso requerido
 * @returns {Object} { canPerform: boolean, missingVerifications: Array }
 */
export const checkPermissionRequirements = (user, permission) => {
  const canPerform = hasPermission(user, permission);
  
  if (canPerform) {
    return { canPerform: true, missingVerifications: [] };
  }
  
  // Determinar qué verificaciones faltan
  const missingVerifications = [];
  const verifications = user?.verifications || {};
  
  // Para ofertas formales, necesita ser verificado
  if (permission === PERMISSIONS.MESSAGE_SEND_FORMAL_OFFERS || 
      permission === PERMISSIONS.PROPERTY_MAKE_OFFERS) {
    if (!verifications[VERIFICATION_TYPES.EMAIL]) {
      missingVerifications.push(VERIFICATION_TYPES.EMAIL);
    }
    if (!verifications[VERIFICATION_TYPES.PHONE]) {
      missingVerifications.push(VERIFICATION_TYPES.PHONE);
    }
    if (!verifications[VERIFICATION_TYPES.IDENTITY]) {
      missingVerifications.push(VERIFICATION_TYPES.IDENTITY);
    }
  }
  
  // Para funciones profesionales de agente
  if (permission === PERMISSIONS.ADMIN_CONFIGURE_AUTOMATION ||
      permission === PERMISSIONS.CONVERSATION_DELETE) {
    if (user?.role === USER_ROLES.AGENT) {
      if (!verifications[VERIFICATION_TYPES.PROFESSIONAL]) {
        missingVerifications.push(VERIFICATION_TYPES.PROFESSIONAL);
      }
    }
  }
  
  return { canPerform: false, missingVerifications };
};

export default {
  getUserAccessLevel,
  getUserPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getUserLimits,
  isWithinLimit,
  getDefaultPrivacySettings,
  canViewContactInfo,
  canViewProfile,
  getRoleLabel,
  getAccessLevelLabel,
  getRoleColor,
  getAccessLevelColor,
  checkPermissionRequirements
};