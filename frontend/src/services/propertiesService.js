import apiClient from './apiClient';

const propertiesService = {
  // Obtener lista de propiedades
  getProperties: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await apiClient.get(`/properties${queryParams ? `?${queryParams}` : ''}`);
  },

  // Crear una nueva propiedad
  createProperty: async (data) => {
    return await apiClient.post('/properties', data);
  },

  // Obtener una propiedad específica
  getPropertyById: async (id) => {
    return await apiClient.get(`/properties/${id}`);
  },

  // Actualizar una propiedad existente
  updateProperty: async (id, data) => {
    return await apiClient.put(`/properties/${id}`, data);
  },

  // Eliminar una propiedad
  deleteProperty: async (id) => {
    return await apiClient.delete(`/properties/${id}`);
  },
};

export default propertiesService;