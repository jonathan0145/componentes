import axios from 'axios';

// Configuración base de Axios
const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.20.82:3000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para establecer el token
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.Authorization;
  }
};

// Interceptor para agregar token de autorización
apiClient.interceptors.request.use(
  (config) => {
    // El token se manejará externamente
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas - SIN importar store
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // En lugar de importar store, emitiremos un evento personalizado
      window.dispatchEvent(new CustomEvent('auth-error', { 
        detail: { error: 'Token expired' } 
      }));
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;