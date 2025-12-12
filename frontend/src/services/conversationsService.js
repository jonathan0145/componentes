import apiClient from './apiClient';

const conversationsService = {
  // Obtener todas las conversaciones del usuario autenticado
  getConversations: async () => {
    return await apiClient.get('/conversations');
  },
  // Obtener detalles de una conversación
  getConversationById: async (id) => {
    return await apiClient.get(`/conversations/${id}`);
  },
  // Crear una nueva conversación (si aplica)
  createConversation: async (data) => {
    return await apiClient.post('/conversations', data);
  },
};

export default conversationsService;