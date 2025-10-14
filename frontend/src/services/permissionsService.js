import apiClient from './apiClient';

// Servicio para permisos
export const getPermissions = () => apiClient.get('/permissions');
export const createPermission = (data) => apiClient.post('/permissions', data);
export const updatePermission = (id, data) => apiClient.put(`/permissions/${id}`, data);
export const deletePermission = (id) => apiClient.delete(`/permissions/${id}`);
