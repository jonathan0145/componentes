import apiClient from './apiClient';

// Servicio para historial de precios
export const getPriceHistory = () => apiClient.get('/price-history');
export const createPriceHistory = (data) => apiClient.post('/price-history', data);
export const updatePriceHistory = (id, data) => apiClient.put(`/price-history/${id}`, data);
export const deletePriceHistory = (id) => apiClient.delete(`/price-history/${id}`);
