const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { userBelongsToConversation } = require('../utils/conversationUtils');
const { getIo } = require('../services/socketProvider');

module.exports = function setupSockets() {
  const io = getIo();

  io.on('connection', (socket) => {
    socket.auth = false;
    socket.user = null;

    socket.on('authenticate', async (data) => {
      try {
        const token = data?.token;
        if (!token) return socket.emit('authentication_error', { code: 'AUTH_001', message: 'Token requerido' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // token decoded
        socket.auth = true;
        socket.user = decoded;
        socket.join(`user:${decoded.id}`);
  socket.emit('authenticated', { userId: decoded.id, role: decoded.role });
  io.emit('user_online', { userId: decoded.id });
      } catch (err) {
        socket.emit('authentication_error', { code: 'AUTH_001', message: 'Token inválido' });
        // optionally disconnect
        // socket.disconnect();
      }
    });

    socket.on('join_conversation', async ({ conversationId }) => {
      if (!socket.auth) return socket.emit('authentication_error', { code: 'AUTH_001', message: 'No autenticado' });
      const userId = socket.user.id;
      const allowed = await userBelongsToConversation(userId, conversationId);
      if (!allowed) {
        return socket.emit('join_error', { code: 'CONV_403', message: 'No tienes permiso para unirte a esta conversación' });
      }
      socket.join(`conversation:${conversationId}`);
      socket.emit('joined_conversation', { conversationId });
    });

    socket.on('leave_conversation', ({ conversationId }) => {
      if (!socket.auth) return socket.emit('authentication_error', { code: 'AUTH_001', message: 'No autenticado' });
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('send_message', async (payload) => {
      if (!socket.auth) return socket.emit('authentication_error', { code: 'AUTH_001', message: 'No autenticado' });
      const userId = socket.user.id;
      const allowed = await userBelongsToConversation(userId, payload.conversationId);
      if (!allowed) {
        return socket.emit('send_message_error', { code: 'CONV_403', message: 'No tienes permiso para enviar mensajes en esta conversación' });
      }
      // payload: { conversationId, content, type, meta }
      const message = {
        id: Date.now(),
        conversationId: payload.conversationId,
        content: payload.content,
        senderId: userId,
        type: payload.type || 'text',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      io.to(`conversation:${payload.conversationId}`).emit('new_message', message);
    });

    socket.on('send_offer', async (payload) => {
      if (!socket.auth) return socket.emit('authentication_error', { code: 'AUTH_001', message: 'No autenticado' });
      const userId = socket.user.id;
      const allowed = await userBelongsToConversation(userId, payload.conversationId);
      if (!allowed) {
        return socket.emit('send_offer_error', { code: 'CONV_403', message: 'No tienes permiso para enviar ofertas en esta conversación' });
      }
      // payload: { conversationId, amount, paymentTerms, closingDate, conditions, validUntil }
      const offer = {
        id: Date.now(),
        conversationId: payload.conversationId,
        buyerId: userId,
        amount: payload.amount,
        paymentTerms: payload.paymentTerms,
        closingDate: payload.closingDate,
        conditions: payload.conditions,
        validUntil: payload.validUntil,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      io.to(`conversation:${payload.conversationId}`).emit('new_offer', offer);
    });

    socket.on('schedule_appointment', async (payload) => {
      if (!socket.auth) return socket.emit('authentication_error', { code: 'AUTH_001', message: 'No autenticado' });
      const userId = socket.user.id;
      const allowed = await userBelongsToConversation(userId, payload.conversationId);
      if (!allowed) {
        return socket.emit('schedule_appointment_error', { code: 'CONV_403', message: 'No tienes permiso para agendar citas en esta conversación' });
      }
      // payload: { conversationId, scheduledFor, duration, type, notes, location }
      const appt = {
        id: Date.now(),
        conversationId: payload.conversationId,
        userId: userId,
        scheduledFor: payload.scheduledFor,
        duration: payload.duration,
        type: payload.type,
        notes: payload.notes,
        location: payload.location,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      io.to(`conversation:${payload.conversationId}`).emit('appointment_scheduled', appt);
    });

    socket.on('typing_start', ({ conversationId }) => {
      if (!socket.auth) return;
      io.to(`conversation:${conversationId}`).emit('user_typing', { userId: socket.user.id, conversationId });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      if (!socket.auth) return;
      io.to(`conversation:${conversationId}`).emit('user_stop_typing', { userId: socket.user.id, conversationId });
    });

    socket.on('mark_read', ({ conversationId, messageIds }) => {
      if (!socket.auth) return;
      io.to(`conversation:${conversationId}`).emit('messages_read', { userId: socket.user.id, messageIds, conversationId });
    });

    socket.on('disconnect', (reason) => {
      if (socket.user) io.emit('user_offline', { userId: socket.user.id, lastSeen: new Date().toISOString() });
    });
  });
};
