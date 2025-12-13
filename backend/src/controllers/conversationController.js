// GET /conversations/:id/messages - Obtener mensajes de una conversación
exports.getConversationMessages = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: { code: 'AUTH_001', message: 'No autenticado' }, timestamp: new Date().toISOString() });
    }
    // Verifica que la conversación existe y el usuario pertenece
    const chat = await require('../models').Chat.findByPk(conversationId);
    if (!chat) {
      return res.status(404).json({ success: false, error: { code: 'CONV_NOT_FOUND', message: 'Conversación no encontrada' }, timestamp: new Date().toISOString() });
    }
    if (![chat.buyerId, chat.sellerId, chat.intermediaryId].includes(userId)) {
      return res.status(403).json({ success: false, error: { code: 'CONV_403', message: 'No tienes permiso para ver los mensajes de esta conversación' }, timestamp: new Date().toISOString() });
    }
    // Buscar mensajes
    const Message = require('../models').Message;
    const User = require('../models').User;
    const messages = await Message.findAll({
      where: { chatId: conversationId },
      order: [['createdAt', 'ASC']],
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] }
      ]
    });
    // Mapear mensajes con archivo
    const mappedMessages = messages.map(msg => {
      const plain = msg.toJSON();
      if (plain.fileUrl) {
        // Extraer nombre y tipo del archivo
        const url = plain.fileUrl;
        const name = url.split('/').pop();
        // Intentar inferir el tipo por extensión
        let type = '';
        if (name) {
          const ext = name.split('.').pop().toLowerCase();
          if (["jpg","jpeg","png","gif","bmp","webp"].includes(ext)) type = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
          else if (ext === 'pdf') type = 'application/pdf';
          else if (["doc","docx"].includes(ext)) type = 'application/msword';
          else if (["xls","xlsx"].includes(ext)) type = 'application/vnd.ms-excel';
          else if (ext === 'txt') type = 'text/plain';
        }
        plain.file = {
          url,
          name,
          type,
          size: null // Si quieres, puedes guardar el tamaño en la BD y retornarlo aquí
        };
        plain.type = 'file';
      }
      return plain;
    });
    res.json({
      success: true,
      data: mappedMessages,
      message: 'Mensajes obtenidos correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'MSG_LIST_001', message: 'Error al obtener mensajes', details: error.message },
      timestamp: new Date().toISOString()
    });
  }
};
// POST /conversations/:id/messages - Crear mensaje de texto
exports.createMessageInConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { text } = req.body;
    const senderId = req.user?.id;

    if (!text || !senderId) {
      return res.status(400).json({
        success: false,
        error: { code: 'MSG_CREATE_001', message: 'Faltan campos obligatorios: text, senderId' },
        timestamp: new Date().toISOString()
      });
    }

    // Verifica que la conversación exista
    const chat = await require('../models').Chat.findByPk(conversationId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: { code: 'CONV_NOT_FOUND', message: 'Conversación no encontrada' },
        timestamp: new Date().toISOString()
      });
    }

    // Crea el mensaje
    const Message = require('../models').Message;
    const message = await Message.create({
      chatId: conversationId,
      senderId,
      content: text,
      createdAt: new Date()
    });

    // (Opcional) Emitir por socket si tienes sockets
    try {
      const { getIo } = require('../services/socketProvider');
      const io = getIo();
      io.to(`conversation:${conversationId}`).emit('new_message', {
        id: message.id,
        conversationId,
        content: text,
        senderId,
        type: 'text',
        isRead: false,
        createdAt: message.createdAt
      });
    } catch (e) {
      // No socket, no pasa nada
    }

    res.status(201).json({
      success: true,
      data: message,
      message: 'Mensaje enviado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'MSG_CREATE_002', message: 'Error al enviar mensaje', details: error.message },
      timestamp: new Date().toISOString()
    });
  }
};
// POST /conversations - Crear una nueva conversación
exports.createConversation = async (req, res) => {
  try {
    const { propertyId, buyerId, sellerId, intermediaryId, participants } = req.body;
    if (!propertyId || !buyerId || !sellerId) {
      return res.status(400).json({
        success: false,
        error: { code: 'CONV_CREATE_001', message: 'Faltan campos obligatorios: propertyId, buyerId, sellerId' },
        timestamp: new Date().toISOString()
      });
    }
    const chat = await require('../models').Chat.create({
      propertyId,
      buyerId,
      sellerId,
      intermediaryId: intermediaryId || null,
      participants: participants || null
    });
    res.status(201).json({
      success: true,
      data: chat,
      message: 'Conversación creada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al crear conversación:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CONV_CREATE_002',
        message: 'Error al crear conversación',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
// GET /conversations - Listar todas las conversaciones del usuario autenticado
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: { code: 'AUTH_001', message: 'No autenticado' }, timestamp: new Date().toISOString() });
    }
    // Buscar todas las conversaciones donde el usuario es buyer, seller o intermediary
    const conversations = await require('../models').Chat.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { buyerId: userId },
          { sellerId: userId },
          { intermediaryId: userId }
        ]
      },
      order: [['updatedAt', 'DESC']],
      include: [
        { model: require('../models').User, as: 'buyer', attributes: ['id', 'name', 'avatar'] },
        { model: require('../models').User, as: 'seller', attributes: ['id', 'name', 'avatar'] },
        { model: require('../models').User, as: 'intermediary', attributes: ['id', 'name', 'avatar'] },
        { model: require('../models').Property, as: 'property', attributes: ['id', 'title', 'address', 'lat', 'lng', 'images'] }
      ]
    });
    res.json({
      success: true,
      data: conversations,
      message: 'Conversaciones obtenidas correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en getUserConversations:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CONV_LIST_001',
        message: 'Error al obtener conversaciones',
        details: error.message,
        stack: error.stack
      },
      timestamp: new Date().toISOString()
    });
  }
};
const { Chat, Offer, Appointment, Message, User } = require('../models');

// GET /conversations/:id/offers
exports.getConversationOffers = async (req, res) => {
  try {
    // Aquí iría la lógica para obtener las ofertas de la conversación
    res.json({
      success: true,
      data: [],
      message: 'Ofertas obtenidas correctamente (stub)',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CONV_OFFERS_001',
        message: 'Error al obtener ofertas',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// POST /conversations/:id/appointments
exports.createAppointment = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { scheduledFor, duration, type, notes, location } = req.body;
    if (!scheduledFor) return res.status(400).json({ success: false, error: { code: 'VALIDATION_001', message: 'scheduledFor es obligatorio' }, timestamp: new Date().toISOString() });
  const chat = await Chat.findByPk(conversationId);
    if (!chat) return res.status(404).json({ success: false, error: { code: 'CONV_001', message: 'Conversación no encontrada' }, timestamp: new Date().toISOString() });
    const userId = req.user?.id || req.body.userId;
    // Validar que el usuario pertenece a la conversación
    if (![chat.buyerId, chat.sellerId, chat.intermediaryId].includes(userId)) {
      return res.status(403).json({ success: false, error: { code: 'CONV_403', message: 'No tienes permiso para interactuar en esta conversación' }, timestamp: new Date().toISOString() });
    }
    const appointment = await Appointment.create({ propertyId: chat.propertyId, userId, date: new Date(scheduledFor), notes: notes || null, status: 'pending' });
    // Emitir evento socket
    try {
      const { getIo } = require('../services/socketProvider');
      const io = getIo();
      console.log('Emit appointment_scheduled to conversation:', conversationId);
      io.to(`conversation:${conversationId}`).emit('appointment_scheduled', appointment);
    } catch (e) {
      console.warn('Socket emit appointment_scheduled failed:', e.message);
    }
    res.status(201).json({ success: true, data: appointment, message: 'Cita creada correctamente', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'CONV_APPT_001', message: 'Error al crear cita', details: error.message }, timestamp: new Date().toISOString() });
  }
};
// POST /conversations/:id/offers
exports.createOfferInConversation = async (req, res) => {
  try {
  const conversationId = req.params.id;
    const { amount, paymentTerms, closingDate, conditions, validUntil } = req.body;
    if (!amount) return res.status(400).json({ success: false, error: { code: 'VALIDATION_001', message: 'amount es obligatorio' }, timestamp: new Date().toISOString() });
    // Buscar la conversación para obtener propertyId
  const chat = await Chat.findByPk(conversationId);
    if (!chat) return res.status(404).json({ success: false, error: { code: 'CONV_001', message: 'Conversación no encontrada' }, timestamp: new Date().toISOString() });


    const buyerId = req.user?.id || req.body.buyerId;
    if (!buyerId) return res.status(400).json({ success: false, error: { code: 'VALIDATION_002', message: 'buyerId es obligatorio' }, timestamp: new Date().toISOString() });
    // Validar que el usuario pertenece a la conversación
    if (![chat.buyerId, chat.sellerId, chat.intermediaryId].includes(buyerId)) {
      return res.status(403).json({ success: false, error: { code: 'CONV_403', message: 'No tienes permiso para interactuar en esta conversación' }, timestamp: new Date().toISOString() });
    }
    // Mapear campos al modelo Offer
    const offerPayload = {
      propertyId: chat.propertyId,
      buyerId,
      amount,
      terms: paymentTerms || conditions || null,
      status: 'pending'
    };
    // Persistir la oferta
    const createdOffer = await Offer.create(offerPayload);

    // Emitir evento socket con la oferta persistida
    try {
      const { getIo } = require('../services/socketProvider');
      const io = getIo();
      console.log('Emit new_offer to conversation:', conversationId);
      io.to(`conversation:${conversationId}`).emit('new_offer', createdOffer);
    } catch (e) {
      console.warn('Socket emit new_offer failed:', e.message);
    }

    res.status(201).json({ success: true, data: createdOffer, message: 'Oferta creada correctamente', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'CONV_OFFERS_002', message: 'Error al crear oferta', details: error.message }, timestamp: new Date().toISOString() });
  }
};
// const { Message } = require('../models');
// POST /conversations/:id/messages/file
exports.sendFileMessage = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const chat = await Chat.findByPk(conversationId);
    if (!chat) return res.status(404).json({ success: false, error: { code: 'CONV_001', message: 'Conversación no encontrada' }, timestamp: new Date().toISOString() });
    if (!req.file) return res.status(400).json({ success: false, error: { code: 'VALIDATION_001', message: 'Archivo requerido' }, timestamp: new Date().toISOString() });
    const fileUrl = req.file.path || req.file.filename;
    const senderId = req.user?.id || req.body.senderId;
    const message = await Message.create({ chatId: conversationId, senderId, content: null, fileUrl });
    // Emitir evento socket con tipo file
    try {
      const { getIo } = require('../services/socketProvider');
      const io = getIo();
      io.to(`conversation:${conversationId}`).emit('new_message', {
        id: message.id,
        conversationId,
        content: null,
        file: { url: fileUrl, name: req.file.originalname, size: req.file.size, mimeType: req.file.mimetype },
        senderId,
        type: 'file',
        isRead: false,
        createdAt: message.createdAt
      });
    } catch (e) {
      console.warn('Socket emit new_message (file) failed:', e.message);
    }
    res.status(201).json({ success: true, data: message, message: 'Archivo enviado correctamente', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'MESSAGE_FILE_001', message: 'Error al enviar archivo', details: error.message }, timestamp: new Date().toISOString() });
  }
};

// PUT /conversations/:id/messages/read
exports.markMessagesAsRead = async (req, res) => {
  try {
    // Aquí iría la lógica para marcar mensajes como leídos
    // Ejemplo: req.body.messageIds
    res.json({
      success: true,
      data: null,
      message: 'Mensajes marcados como leídos (stub)',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'MESSAGE_READ_001',
        message: 'Error al marcar mensajes como leídos',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
