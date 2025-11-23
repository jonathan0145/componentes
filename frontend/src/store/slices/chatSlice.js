import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '@services/chatService';
import { toast } from 'react-toastify';

// Thunks asíncronos
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await chatService.getConversations(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Error al cargar conversaciones');
    }
  }
);

export const fetchConversation = createAsyncThunk(
  'chat/fetchConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatService.getConversation(conversationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Error al cargar conversación');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ conversationId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await chatService.getMessages(conversationId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Error al cargar mensajes');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, messageData }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(conversationId, messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Error al enviar mensaje');
    }
  }
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (conversationData, { rejectWithValue }) => {
    try {
      const response = await chatService.createConversation(conversationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Error al crear conversación');
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'chat/markMessagesAsRead',
  async ({ conversationId, messageIds }, { rejectWithValue }) => {
    try {
      await chatService.markMessagesAsRead(conversationId, messageIds);
      return { conversationId, messageIds };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Error al marcar mensajes como leídos');
    }
  }
);

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  typingUsers: {},
  onlineUsers: [],
  isConnected: false,
  loading: false,
  messagesLoading: false,
  error: null,
  pagination: {
    hasMore: false,
    nextCursor: null,
  },
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Socket.io eventos
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    
    addMessage: (state, action) => {
      const message = action.payload;
      const existingIndex = state.messages.findIndex(m => m.id === message.id);
      
      if (existingIndex === -1) {
        state.messages.push(message);
        // Ordenar por fecha
        state.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
      
      // Actualizar último mensaje en la conversación
      const conversationIndex = state.conversations.findIndex(
        c => c.id === message.conversationId
      );
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = message;
        state.conversations[conversationIndex].updatedAt = message.createdAt;
      }
    },
    
    updateMessage: (state, action) => {
      const updatedMessage = action.payload;
      const messageIndex = state.messages.findIndex(m => m.id === updatedMessage.id);
      if (messageIndex !== -1) {
        state.messages[messageIndex] = { ...state.messages[messageIndex], ...updatedMessage };
      }
    },
    
    setTypingUser: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      
      if (isTyping) {
        if (!state.typingUsers[conversationId].includes(userId)) {
          state.typingUsers[conversationId].push(userId);
        }
      } else {
        state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(
          id => id !== userId
        );
      }
    },
    
    updateOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    
    addOnlineUser: (state, action) => {
      const userId = action.payload;
      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
    },
    
    removeOnlineUser: (state, action) => {
      const userId = action.payload;
      state.onlineUsers = state.onlineUsers.filter(id => id !== userId);
    },
    
    markConversationMessagesAsRead: (state, action) => {
      const { conversationId, messageIds } = action.payload;
      
      // Marcar mensajes como leídos
      state.messages.forEach(message => {
        if (messageIds.includes(message.id)) {
          message.isRead = true;
        }
      });
      
      // Actualizar contador de no leídos en la conversación
      const conversationIndex = state.conversations.findIndex(c => c.id === conversationId);
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].unreadCount = 0;
      }
    },
    
    updateConversationUnreadCount: (state, action) => {
      const { conversationId, count } = action.payload;
      const conversationIndex = state.conversations.findIndex(c => c.id === conversationId);
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].unreadCount = count;
      }
    },
    
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
      state.messages = [];
      state.pagination = { hasMore: false, nextCursor: null };
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.conversations || [];
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Fetch Conversation
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.currentConversation = action.payload;
      })
      
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        const { messages, pagination } = action.payload;
        
        if (pagination?.nextCursor) {
          // Paginación - agregar mensajes al inicio
          state.messages = [...messages, ...state.messages];
        } else {
          // Primera carga
          state.messages = messages || [];
        }
        
        state.pagination = pagination || { hasMore: false, nextCursor: null };
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // El mensaje se agregará a través del socket
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Create Conversation
      .addCase(createConversation.fulfilled, (state, action) => {
        const { conversation } = action.payload;
        state.conversations.unshift(conversation);
        state.currentConversation = conversation;
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Mark Messages as Read
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const { conversationId, messageIds } = action.payload;
        
        state.messages.forEach(message => {
          if (messageIds.includes(message.id)) {
            message.isRead = true;
          }
        });
        
        const conversationIndex = state.conversations.findIndex(c => c.id === conversationId);
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].unreadCount = 0;
        }
      });
  },
});

export const {
  setConnectionStatus,
  addMessage,
  updateMessage,
  setTypingUser,
  updateOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  markConversationMessagesAsRead,
  updateConversationUnreadCount,
  clearCurrentConversation,
  clearError,
} = chatSlice.actions;

// Selectores
export const selectConnectionStatus = (state) => state.chat.isConnected;
export const selectConversations = (state) => state.chat.conversations;
export const selectCurrentConversation = (state) => state.chat.currentConversation;
export const selectMessages = (state, conversationId) => {
  if (conversationId && state.chat.messages[conversationId]) {
    return state.chat.messages[conversationId];
  }
  return [];
};
export const selectOnlineUsers = (state) => state.chat.onlineUsers;
export const selectTypingUsers = (state) => state.chat.typingUsers;
export const selectChatLoading = (state) => state.chat.loading;
export const selectChatError = (state) => state.chat.error;

export default chatSlice.reducer;