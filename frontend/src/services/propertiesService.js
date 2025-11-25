import apiClient from './apiClient';

const propertiesService = {
  // Obtener lista de propiedades
  getProperties: async (params = {}) => {
    // Mapeo de nombres de filtros frontend -> backend
    const map = {
      priceMin: 'minPrice',
      priceMax: 'maxPrice',
      propertyType: 'propertyType',
      location: 'city',
      bedrooms: 'bedrooms',
      bathrooms: 'bathrooms',
      search: 'search',
      status: 'status'
    };
    const backendParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        backendParams[map[key] || key] = value;
      }
    });
    const queryParams = new URLSearchParams(backendParams).toString();
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