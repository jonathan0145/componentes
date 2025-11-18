import apiClient from './apiClient';

// Servicio para citas/agendamientos
export const getAppointments = () => apiClient.get('/appointments');
export const createAppointment = (data) => apiClient.post('/appointments', data);
export const updateAppointment = (id, data) => apiClient.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => apiClient.delete(`/appointments/${id}`);
