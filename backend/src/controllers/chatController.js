const { Chat } = require('../models');

exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.findAll();
    res.json(chats);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CHAT_001',
        message: 'Error al obtener chats',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);
    if (!chat) return res.status(404).json({
      success: false,
      error: {
        code: 'CHAT_002',
        message: 'Chat no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    res.json({
      success: true,
      data: chat,
      message: 'Chat obtenido correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CHAT_003',
        message: 'Error al obtener el chat',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.createChat = async (req, res) => {
  try {
    const { propertyId, buyerId, sellerId, intermediaryId, status } = req.body;
    if (!propertyId || !buyerId || !sellerId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'propertyId, buyerId y sellerId son obligatorios'
        },
        timestamp: new Date().toISOString()
      });
    }
    const { User } = require('../models');
    const buyer = await User.findByPk(buyerId);
    const seller = await User.findByPk(sellerId);
    if (!buyer || buyer.role !== 'buyer') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El buyerId no corresponde a un usuario con rol buyer'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (!seller || seller.role !== 'seller') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El sellerId no corresponde a un usuario con rol seller'
        },
        timestamp: new Date().toISOString()
      });
    }
    const chat = await Chat.create({ propertyId, buyerId, sellerId, intermediaryId, status });
    res.status(201).json({
      success: true,
      data: chat,
      message: 'Chat creado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CHAT_004',
        message: 'Error al crear el chat',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.updateChat = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);
    if (!chat) return res.status(404).json({
      success: false,
      error: {
        code: 'CHAT_002',
        message: 'Chat no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    const { userIds } = req.body;
    if (userIds && (!Array.isArray(userIds) || userIds.length < 2)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El chat debe tener al menos 2 usuarios'
        },
        timestamp: new Date().toISOString()
      });
    }
    await chat.update(req.body);
    res.json({
      success: true,
      data: chat,
      message: 'Chat actualizado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CHAT_005',
        message: 'Error al actualizar el chat',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);
    if (!chat) return res.status(404).json({
      success: false,
      error: {
        code: 'CHAT_002',
        message: 'Chat no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    await chat.destroy();
    res.json({
      success: true,
      data: { id: req.params.id },
      message: 'Chat eliminado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CHAT_006',
        message: 'Error al eliminar el chat',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
