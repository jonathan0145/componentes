import apiClient from './apiClient';

// Servicio para roles
export const getRoles = () => apiClient.get('/roles');
export const createRole = (data) => apiClient.post('/roles', data);
export const updateRole = (id, data) => apiClient.put(`/roles/${id}`, data);
export const deleteRole = (id) => apiClient.delete(`/roles/${id}`);
