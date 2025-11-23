import apiClient from './apiClient';

// Servicio para ofertas
export const getOffers = () => apiClient.get('/offers');
export const createOffer = (data) => apiClient.post('/offers', data);
export const updateOffer = (id, data) => apiClient.put(`/offers/${id}`, data);
export const deleteOffer = (id) => apiClient.delete(`/offers/${id}`);
