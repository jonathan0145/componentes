import apiClient from './apiClient';

// Servicio para almacenamiento
export const getStorageItems = () => apiClient.get('/storage');
export const createStorageItem = (data) => apiClient.post('/storage', data);
export const updateStorageItem = (id, data) => apiClient.put(`/storage/${id}`, data);
export const deleteStorageItem = (id) => apiClient.delete(`/storage/${id}`);
