import apiClient from './apiClient';

// Servicio para notificaciones push
export const sendPush = (data) => apiClient.post('/push/send', data);
export const getPushStatus = (id) => apiClient.get(`/push/status/${id}`);
