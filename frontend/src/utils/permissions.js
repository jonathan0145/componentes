// Sistema completo de permisos y roles
// Basado en la documentación 03-roles-y-permisos.md

// Definición de roles principales
export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  AGENT: 'agent',
  ADMIN: 'admin'
};

// Niveles de acceso/verificación
export const ACCESS_LEVELS = {
  BASIC: 'basic',           // Solo email verificado
  VERIFIED: 'verified',     // Email + teléfono + documento
  PROFESSIONAL: 'professional' // Solo para agentes: licencia + colegio profesional
};

// Tipos de verificación
export const VERIFICATION_TYPES = {
  EMAIL: 'email',
  PHONE: 'phone',
  IDENTITY: 'identity',     // Documento oficial
  PROFESSIONAL: 'professional', // Licencia profesional
  FINANCIAL: 'financial'    // Estado de cuenta (opcional)
};

// Acciones/permisos del sistema
export const PERMISSIONS = {
  // Gestión de conversaciones
  CONVERSATION_CREATE: 'conversation:create',
  CONVERSATION_JOIN_ANY: 'conversation:join_any',
  CONVERSATION_VIEW_HISTORY: 'conversation:view_history',
  CONVERSATION_ARCHIVE: 'conversation:archive',
  CONVERSATION_DELETE: 'conversation:delete',
  CONVERSATION_INVITE_THIRD_PARTY: 'conversation:invite_third_party',
  
  // Envío de mensajes
  MESSAGE_SEND_TEXT: 'message:send_text',
  MESSAGE_SEND_FILES: 'message:send_files',
  MESSAGE_SEND_LEGAL_DOCS: 'message:send_legal_docs',
  MESSAGE_SEND_FORMAL_OFFERS: 'message:send_formal_offers',
  MESSAGE_SEND_SYSTEM: 'message:send_system',
  MESSAGE_SCHEDULE_APPOINTMENTS: 'message:schedule_appointments',
  
  // Acceso a información
  INFO_VIEW_PERSONAL_BASIC: 'info:view_personal_basic',
  INFO_VIEW_CONTACT_FULL: 'info:view_contact_full',
  INFO_VIEW_CONTACT_LIMITED: 'info:view_contact_limited',
  INFO_VIEW_CONVERSATION_HISTORY: 'info:view_conversation_history',
  INFO_VIEW_ACTIVITY_STATS: 'info:view_activity_stats',
  INFO_VIEW_TRANSACTION_REPORTS: 'info:view_transaction_reports',
  
  // Funciones administrativas
  ADMIN_MODERATE_CONVERSATIONS: 'admin:moderate_conversations',
  ADMIN_REPORT_PROBLEMS: 'admin:report_problems',
  ADMIN_BLOCK_USERS: 'admin:block_users',
  ADMIN_VIEW_ANALYTICS_BASIC: 'admin:view_analytics_basic',
  ADMIN_VIEW_ANALYTICS_ADVANCED: 'admin:view_analytics_advanced',
  ADMIN_CONFIGURE_AUTOMATION: 'admin:configure_automation',
  
  // Gestión de propiedades
  PROPERTY_CREATE: 'property:create',
  PROPERTY_EDIT_OWN: 'property:edit_own',
  PROPERTY_DELETE_OWN: 'property:delete_own',
  PROPERTY_VIEW_DETAILS: 'property:view_details',
  PROPERTY_MAKE_OFFERS: 'property:make_offers',
  
  // Gestión de ofertas
  OFFER_CREATE: 'offer:create',
  OFFER_VIEW_OWN: 'offer:view_own',
  OFFER_RESPOND: 'offer:respond',
  OFFER_COUNTER: 'offer:counter',
  
  // Configuración y privacidad
  PRIVACY_CONFIGURE_VISIBILITY: 'privacy:configure_visibility',
  PRIVACY_CONFIGURE_CONTACT_INFO: 'privacy:configure_contact_info',
  PRIVACY_CONFIGURE_ACTIVITY_HISTORY: 'privacy:configure_activity_history',
  PRIVACY_CONFIGURE_NOTIFICATIONS: 'privacy:configure_notifications'
};

// Matriz de permisos por rol y nivel de acceso

// Definir arrays base para evitar ciclo de referencia
const BUYER_BASIC_PERMISSIONS = [
  PERMISSIONS.CONVERSATION_CREATE,
  PERMISSIONS.CONVERSATION_VIEW_HISTORY,
  PERMISSIONS.CONVERSATION_ARCHIVE,
  PERMISSIONS.MESSAGE_SEND_TEXT,
  PERMISSIONS.MESSAGE_SEND_FILES,
  PERMISSIONS.MESSAGE_SCHEDULE_APPOINTMENTS,
  PERMISSIONS.INFO_VIEW_PERSONAL_BASIC,
  PERMISSIONS.INFO_VIEW_CONTACT_LIMITED,
  PERMISSIONS.INFO_VIEW_CONVERSATION_HISTORY,
  PERMISSIONS.ADMIN_REPORT_PROBLEMS,
  PERMISSIONS.ADMIN_BLOCK_USERS,
  PERMISSIONS.PROPERTY_VIEW_DETAILS,
  PERMISSIONS.PRIVACY_CONFIGURE_VISIBILITY,
  PERMISSIONS.PRIVACY_CONFIGURE_NOTIFICATIONS
];
const BUYER_VERIFIED_PERMISSIONS = [
  ...BUYER_BASIC_PERMISSIONS,
  PERMISSIONS.INFO_VIEW_CONTACT_FULL,
  PERMISSIONS.MESSAGE_SEND_FORMAL_OFFERS,
  PERMISSIONS.PROPERTY_MAKE_OFFERS,
  PERMISSIONS.OFFER_CREATE,
  PERMISSIONS.OFFER_VIEW_OWN,
  PERMISSIONS.OFFER_COUNTER,
  PERMISSIONS.PRIVACY_CONFIGURE_CONTACT_INFO,
  PERMISSIONS.PRIVACY_CONFIGURE_ACTIVITY_HISTORY
];

const SELLER_BASIC_PERMISSIONS = [
  PERMISSIONS.CONVERSATION_CREATE,
  PERMISSIONS.CONVERSATION_VIEW_HISTORY,
  PERMISSIONS.CONVERSATION_ARCHIVE,
  PERMISSIONS.MESSAGE_SEND_TEXT,
  PERMISSIONS.MESSAGE_SEND_FILES,
  PERMISSIONS.MESSAGE_SEND_LEGAL_DOCS,
  PERMISSIONS.MESSAGE_SEND_FORMAL_OFFERS,
  PERMISSIONS.MESSAGE_SCHEDULE_APPOINTMENTS,
  PERMISSIONS.INFO_VIEW_PERSONAL_BASIC,
  PERMISSIONS.INFO_VIEW_CONTACT_LIMITED,
  PERMISSIONS.INFO_VIEW_CONVERSATION_HISTORY,
  PERMISSIONS.INFO_VIEW_ACTIVITY_STATS,
  PERMISSIONS.ADMIN_REPORT_PROBLEMS,
  PERMISSIONS.ADMIN_BLOCK_USERS,
  PERMISSIONS.ADMIN_VIEW_ANALYTICS_BASIC,
  PERMISSIONS.PROPERTY_CREATE,
  PERMISSIONS.PROPERTY_EDIT_OWN,
  PERMISSIONS.PROPERTY_DELETE_OWN,
  PERMISSIONS.PROPERTY_VIEW_DETAILS,
  PERMISSIONS.OFFER_VIEW_OWN,
  PERMISSIONS.OFFER_RESPOND,
  PERMISSIONS.OFFER_COUNTER,
  PERMISSIONS.PRIVACY_CONFIGURE_VISIBILITY,
  PERMISSIONS.PRIVACY_CONFIGURE_NOTIFICATIONS
];
const SELLER_VERIFIED_PERMISSIONS = [
  ...SELLER_BASIC_PERMISSIONS,
  PERMISSIONS.INFO_VIEW_CONTACT_FULL,
  PERMISSIONS.INFO_VIEW_TRANSACTION_REPORTS,
  PERMISSIONS.PRIVACY_CONFIGURE_CONTACT_INFO,
  PERMISSIONS.PRIVACY_CONFIGURE_ACTIVITY_HISTORY
];

const AGENT_BASIC_PERMISSIONS = [
  PERMISSIONS.CONVERSATION_CREATE,
  PERMISSIONS.CONVERSATION_JOIN_ANY,
  PERMISSIONS.CONVERSATION_VIEW_HISTORY,
  PERMISSIONS.CONVERSATION_ARCHIVE,
  PERMISSIONS.CONVERSATION_INVITE_THIRD_PARTY,
  PERMISSIONS.MESSAGE_SEND_TEXT,
  PERMISSIONS.MESSAGE_SEND_FILES,
  PERMISSIONS.MESSAGE_SEND_LEGAL_DOCS,
  PERMISSIONS.MESSAGE_SEND_FORMAL_OFFERS,
  PERMISSIONS.MESSAGE_SEND_SYSTEM,
  PERMISSIONS.MESSAGE_SCHEDULE_APPOINTMENTS,
  PERMISSIONS.INFO_VIEW_PERSONAL_BASIC,
  PERMISSIONS.INFO_VIEW_CONTACT_FULL,
  PERMISSIONS.INFO_VIEW_CONVERSATION_HISTORY,
  PERMISSIONS.INFO_VIEW_ACTIVITY_STATS,
  PERMISSIONS.INFO_VIEW_TRANSACTION_REPORTS,
  PERMISSIONS.ADMIN_MODERATE_CONVERSATIONS,
  PERMISSIONS.ADMIN_REPORT_PROBLEMS,
  PERMISSIONS.ADMIN_BLOCK_USERS,
  PERMISSIONS.ADMIN_VIEW_ANALYTICS_ADVANCED,
  PERMISSIONS.PROPERTY_VIEW_DETAILS,
  PERMISSIONS.OFFER_VIEW_OWN,
  PERMISSIONS.OFFER_RESPOND,
  PERMISSIONS.OFFER_COUNTER,
  PERMISSIONS.PRIVACY_CONFIGURE_VISIBILITY,
  PERMISSIONS.PRIVACY_CONFIGURE_CONTACT_INFO,
  PERMISSIONS.PRIVACY_CONFIGURE_ACTIVITY_HISTORY,
  PERMISSIONS.PRIVACY_CONFIGURE_NOTIFICATIONS
];
const AGENT_VERIFIED_PERMISSIONS = [
  ...AGENT_BASIC_PERMISSIONS
];
const AGENT_PROFESSIONAL_PERMISSIONS = [
  ...AGENT_VERIFIED_PERMISSIONS,
  PERMISSIONS.CONVERSATION_DELETE,
  PERMISSIONS.ADMIN_CONFIGURE_AUTOMATION
];

export const ROLE_PERMISSIONS = {
  [USER_ROLES.BUYER]: {
    [ACCESS_LEVELS.BASIC]: BUYER_BASIC_PERMISSIONS,
    [ACCESS_LEVELS.VERIFIED]: BUYER_VERIFIED_PERMISSIONS
  },
  [USER_ROLES.SELLER]: {
    [ACCESS_LEVELS.BASIC]: SELLER_BASIC_PERMISSIONS,
    [ACCESS_LEVELS.VERIFIED]: SELLER_VERIFIED_PERMISSIONS
  },
  [USER_ROLES.AGENT]: {
    [ACCESS_LEVELS.BASIC]: AGENT_BASIC_PERMISSIONS,
    [ACCESS_LEVELS.VERIFIED]: AGENT_VERIFIED_PERMISSIONS,
    [ACCESS_LEVELS.PROFESSIONAL]: AGENT_PROFESSIONAL_PERMISSIONS
  }
};

// Configuración de privacidad por defecto según rol
export const DEFAULT_PRIVACY_SETTINGS = {
  [USER_ROLES.BUYER]: {
    profileVisibility: 'contacts', // public, contacts, private
    contactInfoVisibility: 'verified', // hidden, verified, all
    activityHistoryVisibility: 'stats', // visible, stats, hidden
    notificationSettings: 'immediate' // immediate, daily, disabled
  },
  [USER_ROLES.SELLER]: {
    profileVisibility: 'public',
    contactInfoVisibility: 'verified',
    activityHistoryVisibility: 'stats',
    notificationSettings: 'immediate'
  },
  [USER_ROLES.AGENT]: {
    profileVisibility: 'public',
    contactInfoVisibility: 'all',
    activityHistoryVisibility: 'visible',
    notificationSettings: 'daily'
  }
};

// Límites por rol y nivel
export const ROLE_LIMITS = {
  [USER_ROLES.BUYER]: {
    [ACCESS_LEVELS.BASIC]: {
      maxActiveConversations: 5,
      maxDailyMessages: 50,
      maxFileUploadSize: 5 * 1024 * 1024, // 5MB
      canMakeFormalOffers: false
    },
    [ACCESS_LEVELS.VERIFIED]: {
      maxActiveConversations: 20,
      maxDailyMessages: 200,
      maxFileUploadSize: 10 * 1024 * 1024, // 10MB
      canMakeFormalOffers: true
    }
  },
  [USER_ROLES.SELLER]: {
    [ACCESS_LEVELS.BASIC]: {
      maxActiveConversations: 10,
      maxDailyMessages: 100,
      maxFileUploadSize: 10 * 1024 * 1024, // 10MB
      maxPropertiesListed: 3
    },
    [ACCESS_LEVELS.VERIFIED]: {
      maxActiveConversations: 50,
      maxDailyMessages: 500,
      maxFileUploadSize: 25 * 1024 * 1024, // 25MB
      maxPropertiesListed: 20
    }
  },
  [USER_ROLES.AGENT]: {
    [ACCESS_LEVELS.BASIC]: {
      maxActiveConversations: 25,
      maxDailyMessages: 200,
      maxFileUploadSize: 15 * 1024 * 1024, // 15MB
      canModerateConversations: false
    },
    [ACCESS_LEVELS.VERIFIED]: {
      maxActiveConversations: 50,
      maxDailyMessages: 500,
      maxFileUploadSize: 25 * 1024 * 1024, // 25MB
      canModerateConversations: true
    },
    [ACCESS_LEVELS.PROFESSIONAL]: {
      maxActiveConversations: 100,
      maxDailyMessages: 1000,
      maxFileUploadSize: 50 * 1024 * 1024, // 50MB
      canModerateConversations: true,
      hasAdvancedAnalytics: true,
      canConfigureAutomation: true
    }
  }
};

export default {
  USER_ROLES,
  ACCESS_LEVELS,
  VERIFICATION_TYPES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  DEFAULT_PRIVACY_SETTINGS,
  ROLE_LIMITS
};