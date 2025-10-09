import apiClient from './apiClient';

const propertiesService = {
  // Obtener lista de propiedades
  getProperties: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await apiClient.get(`/properties?${queryParams}`);
  },

  // Obtener una propiedad específica
  getProperty: async (propertyId) => {
    return await apiClient.get(`/properties/${propertyId}`);
  },
};

export default propertiesService;