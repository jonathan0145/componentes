import apiClient from './apiClient';

const authService = {
  // Iniciar sesión
  login: async (email, password) => {
    return await apiClient.post('/auth/login', {
      email,
      password,
    });
  },

  // Registrarse
  register: async (userData) => {
    return await apiClient.post('/auth/register', userData);
  },

  // Renovar token
  refreshToken: async (refreshToken) => {
    return await apiClient.post('/auth/refresh', {
      refreshToken,
    });
  },

  // Cerrar sesión
  logout: async () => {
    return await apiClient.post('/auth/logout');
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    return await apiClient.get('/users/profile');
  },

  // Actualizar perfil
  updateProfile: async (profileData) => {
    return await apiClient.put('/users/profile', profileData);
  },

  // Subir avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return await apiClient.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Verificar email
  verifyEmail: async (token) => {
    return await apiClient.post('/auth/verify-email', {
      token,
    });
  },

  // Solicitar recuperación de contraseña
  requestPasswordReset: async (email) => {
    return await apiClient.post('/auth/request-password-reset', {
      email,
    });
  },

  // Restablecer contraseña
  resetPassword: async (token, newPassword) => {
    return await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  // Cambiar contraseña
  changePassword: async (currentPassword, newPassword) => {
    return await apiClient.put('/users/change-password', {
      currentPassword,
      newPassword,
    });
  },
};

export default authService;