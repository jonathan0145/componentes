import apiClient from './apiClient';

// Servicio para verificaciones
export const getVerifications = () => apiClient.get('/verifications');
export const createVerification = (data) => apiClient.post('/verifications', data);
export const updateVerification = (id, data) => apiClient.put(`/verifications/${id}`, data);
export const deleteVerification = (id) => apiClient.delete(`/verifications/${id}`);
