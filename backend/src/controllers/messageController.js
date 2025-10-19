// Enviar mensaje validando chat y destinatario
const { Chat, User } = require('../models');
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;
    if (!chatId || !senderId || !content) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Faltan campos obligatorios: chatId, senderId, content'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (typeof content !== 'string' || content.trim().length < 1) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El contenido del mensaje no puede estar vacío'
        },
        timestamp: new Date().toISOString()
      });
    }
    const chat = await Chat.findByPk(chatId);
    const user = await User.findByPk(senderId);
    if (!chat) return res.status(404).json({
      success: false,
      error: {
        code: 'CHAT_002',
        message: 'Chat no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    if (!user) return res.status(404).json({
      success: false,
      error: {
        code: 'USER_001',
        message: 'Usuario no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    if (!chat.userIds.includes(senderId)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'CHAT_003',
          message: 'El usuario no pertenece a este chat'
        },
        timestamp: new Date().toISOString()
      });
    }
    const message = await Message.create({ chatId, senderId, content });
    res.status(201).json({
      success: true,
      data: message,
      message: 'Mensaje enviado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'MESSAGE_001',
        message: 'Error al enviar el mensaje',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
const { Message } = require('../models');

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.json({
      success: true,
      data: messages,
      message: 'Mensajes obtenidos correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'MESSAGE_002',
        message: 'Error al obtener mensajes',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).json({
      success: false,
      error: {
        code: 'MESSAGE_003',
        message: 'Mensaje no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    res.json({
      success: true,
      data: message,
      message: 'Mensaje obtenido correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'MESSAGE_004',
        message: 'Error al obtener el mensaje',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.createMessage = async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;
    if (!chatId || !senderId || !content) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Faltan campos obligatorios: chatId, senderId, content'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (typeof content !== 'string' || content.trim().length < 1) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El contenido del mensaje no puede estar vacío'
        },
        timestamp: new Date().toISOString()
      });
    }
    const message = await Message.create({ chatId, senderId, content });
    // Emitir evento socket
    try {
      const { getIo } = require('../services/socketProvider');
      const io = getIo();
      io.to(`conversation:${chatId}`).emit('new_message', {
        id: message.id,
        conversationId: chatId,
        content: message.content,
        senderId: message.senderId,
        type: 'text',
        isRead: false,
        createdAt: message.createdAt
      });
    } catch (e) {
      // no bloquear si socket falla
      console.warn('Socket emit failed:', e.message);
    }
    res.status(201).json({
      success: true,
      data: message,
      message: 'Mensaje creado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'MESSAGE_005',
        message: 'Error al crear el mensaje',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.updateMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).json({
      success: false,
      error: {
        code: 'MESSAGE_003',
        message: 'Mensaje no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    const { content } = req.body;
    if (content && (typeof content !== 'string' || content.trim().length < 1)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El contenido del mensaje no puede estar vacío'
        },
        timestamp: new Date().toISOString()
      });
    }
    await message.update(req.body);
    res.json({
      success: true,
      data: message,
      message: 'Mensaje actualizado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'MESSAGE_006',
        message: 'Error al actualizar el mensaje',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: 'Mensaje no encontrado' });
    await message.destroy();
    res.json({ mensaje: 'Mensaje eliminado', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el mensaje', detalle: error.message });
  }
};
