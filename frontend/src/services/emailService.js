import apiClient from './apiClient';

// Servicio para email
export const sendEmail = (data) => apiClient.post('/email/send', data);
export const getEmailStatus = (id) => apiClient.get(`/email/status/${id}`);
