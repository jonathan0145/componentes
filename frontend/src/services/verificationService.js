import apiClient from './apiClient';

// Servicio para verificaciones

// ENDPOINTS REALES
export const sendEmailVerification = (email) => apiClient.post('/verifications/email/send', { email });
export const confirmEmailVerification = (email, code) => apiClient.post('/verifications/email/confirm', { email, code });
