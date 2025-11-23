import apiClient from './apiClient';

const chatService = {
  // Obtener conversaciones del usuario
  getConversations: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await apiClient.get(`/conversations?${queryParams}`);
  },

  // Obtener una conversación específica
  getConversation: async (conversationId) => {
    return await apiClient.get(`/conversations/${conversationId}`);
  },

  // Crear nueva conversación
  createConversation: async (conversationData) => {
    return await apiClient.post('/conversations', conversationData);
  },

  // Obtener mensajes de una conversación
  getMessages: async (conversationId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await apiClient.get(`/conversations/${conversationId}/messages?${queryParams}`);
  },

  // Enviar mensaje de texto
  sendMessage: async (conversationId, messageData) => {
    return await apiClient.post(`/conversations/${conversationId}/messages`, messageData);
  },

  // Enviar archivo
  sendFile: async (conversationId, file, caption = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) {
      formData.append('caption', caption);
    }

    return await apiClient.post(`/conversations/${conversationId}/messages/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Marcar mensajes como leídos
  markMessagesAsRead: async (conversationId, messageIds) => {
    return await apiClient.put(`/conversations/${conversationId}/messages/read`, {
      messageIds,
    });
  },

  // Agregar participante a conversación
  addParticipant: async (conversationId, userId) => {
    return await apiClient.post(`/conversations/${conversationId}/participants`, {
      userId,
    });
  },

  // Obtener ofertas de una conversación
  getOffers: async (conversationId) => {
    return await apiClient.get(`/conversations/${conversationId}/offers`);
  },

  // Crear nueva oferta
  createOffer: async (conversationId, offerData) => {
    return await apiClient.post(`/conversations/${conversationId}/offers`, offerData);
  },

  // Responder a una oferta
  respondToOffer: async (offerId, responseData) => {
    return await apiClient.put(`/offers/${offerId}/respond`, responseData);
  },

  // Programar cita
  scheduleAppointment: async (conversationId, appointmentData) => {
    return await apiClient.post(`/conversations/${conversationId}/appointments`, appointmentData);
  },

  // Actualizar cita
  updateAppointment: async (appointmentId, appointmentData) => {
    return await apiClient.put(`/appointments/${appointmentId}`, appointmentData);
  },

  // Obtener citas de una conversación
  getAppointments: async (conversationId) => {
    return await apiClient.get(`/conversations/${conversationId}/appointments`);
  },

  // Archivar conversación
  archiveConversation: async (conversationId) => {
    return await apiClient.put(`/conversations/${conversationId}`, {
      status: 'archived',
    });
  },

  // Buscar en conversaciones
  searchConversations: async (query) => {
    return await apiClient.get(`/conversations/search?q=${encodeURIComponent(query)}`);
  },

  // Buscar en mensajes
  searchMessages: async (conversationId, query) => {
    return await apiClient.get(
      `/conversations/${conversationId}/messages/search?q=${encodeURIComponent(query)}`
    );
  },
};

export default chatService;