import apiClient from './apiClient';

// Servicio para citas/agendamientos
export const createSimpleAppointment = (data) => apiClient.post('/appointments/simple', data);
export const getAppointments = () => apiClient.get('/appointments');
export const createAppointment = (data) => apiClient.post('/appointments', data);
export const updateAppointment = (id, data) => apiClient.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => apiClient.delete(`/appointments/${id}`);
export const scheduleAppointment = (data) => apiClient.post('/appointments/schedule', data);
export const completeAppointment = (id) => apiClient.post(`/appointments/${id}/complete`);
