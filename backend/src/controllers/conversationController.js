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
    const appointment = await Appointment.create({ propertyId: chat.propertyId, userId, date: new Date(scheduledFor), notes: notes || null, status: 'pending' });
    // Emitir evento socket
    try {
      const { getIo } = require('../services/socketProvider');
      const io = getIo();
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
      io.to(`conversation:${conversationId}`).emit('new_offer', createdOffer);
    } catch (e) {
      console.warn('Socket emit new_offer failed:', e.message);
    }

    res.status(201).json({ success: true, data: createdOffer, message: 'Oferta creada correctamente', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'CONV_OFFERS_002', message: 'Error al crear oferta', details: error.message }, timestamp: new Date().toISOString() });
  }
};
const { Message } = require('../models');

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
