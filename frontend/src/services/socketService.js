import { io } from 'socket.io-client';
import store from '@store/store';
import notificationService from './notificationService';
import {
  setConnectionStatus,
  addMessage,
  setTypingUser,
  addOnlineUser,
  removeOnlineUser,
} from '@store/slices/chatSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket?.connected) {
      return;
    }

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      store.dispatch(setConnectionStatus(false));
    }
  }

  setupEventListeners() {
    // Eventos de conexión
    this.socket.on('connect', () => {
      console.log('Socket conectado:', this.socket.id);
      this.isConnected = true;
      store.dispatch(setConnectionStatus(true));
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket desconectado:', reason);
      this.isConnected = false;
      store.dispatch(setConnectionStatus(false));
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
      store.dispatch(setConnectionStatus(false));
    });

    // Eventos de autenticación
    this.socket.on('authenticated', (data) => {
      console.log('Usuario autenticado:', data);
    });

    this.socket.on('authentication_error', (error) => {
      console.error('Error de autenticación:', error);
    });

    // Eventos de mensajes
    this.socket.on('new_message', (message) => {
      console.log('Nuevo mensaje recibido:', message);
      store.dispatch(addMessage(message));
      
      // Mostrar notificación si la ventana no está en foco o es de otro usuario
      const currentUser = store.getState().auth.user;
      if (message.sender.id !== currentUser?.id) {
        // Mostrar notificación nativa
        notificationService.showMessageNotification(message, message.conversation);
        
        // Emitir evento para el toast
        window.dispatchEvent(new CustomEvent('new-message-notification', {
          detail: { message, conversation: message.conversation }
        }));
      }
    });

    // Eventos de typing
    this.socket.on('user_typing', (data) => {
      const { userId, conversationId } = data;
      store.dispatch(setTypingUser({ 
        conversationId, 
        userId, 
        isTyping: true 
      }));

      // Auto-limpiar typing después de 3 segundos
      setTimeout(() => {
        store.dispatch(setTypingUser({ 
          conversationId, 
          userId, 
          isTyping: false 
        }));
      }, 3000);
    });

    this.socket.on('user_stop_typing', (data) => {
      const { userId, conversationId } = data;
      store.dispatch(setTypingUser({ 
        conversationId, 
        userId, 
        isTyping: false 
      }));
    });

    // Eventos de presencia
    this.socket.on('user_online', (data) => {
      const { userId } = data;
      store.dispatch(addOnlineUser(userId));
    });

    this.socket.on('user_offline', (data) => {
      const { userId } = data;
      store.dispatch(removeOnlineUser(userId));
    });

    // Eventos de conversaciones
    this.socket.on('conversation_updated', (conversation) => {
      console.log('Conversación actualizada:', conversation);
      // Actualizar conversación en el store si es necesario
    });

    // Eventos de ofertas
    this.socket.on('new_offer', (offer) => {
      console.log('Nueva oferta recibida:', offer);
      
      // Mostrar notificación de oferta
      notificationService.showOfferNotification(offer, offer.property);
      
      // Emitir evento para el toast
      window.dispatchEvent(new CustomEvent('new-offer-notification', {
        detail: { offer, property: offer.property }
      }));
    });

    this.socket.on('offer_response', (response) => {
      console.log('Respuesta a oferta:', response);
      
      // Mostrar notificación de respuesta
      notificationService.showOfferNotification(response, response.property);
      
      // Emitir evento para el toast
      window.dispatchEvent(new CustomEvent('new-offer-notification', {
        detail: { offer: response, property: response.property }
      }));
    });
  }

  // Métodos para emitir eventos
  authenticate(token) {
    if (this.socket) {
      this.socket.emit('authenticate', { token });
    }
  }

  joinConversation(conversationId) {
    if (this.socket) {
      this.socket.emit('join_conversation', { conversationId });
    }
  }

  leaveConversation(conversationId) {
    if (this.socket) {
      this.socket.emit('leave_conversation', { conversationId });
    }
  }

  sendMessage(conversationId, messageData) {
    if (this.socket) {
      this.socket.emit('send_message', {
        conversationId,
        ...messageData,
      });
    }
  }

  startTyping(conversationId) {
    if (this.socket) {
      this.socket.emit('typing_start', { conversationId });
    }
  }

  stopTyping(conversationId) {
    if (this.socket) {
      this.socket.emit('typing_stop', { conversationId });
    }
  }

  markAsRead(conversationId, messageIds) {
    if (this.socket) {
      this.socket.emit('mark_read', { conversationId, messageIds });
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Crear instancia singleton
const socketService = new SocketService();

export default socketService;