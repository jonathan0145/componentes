const { Chat } = require('../models');

exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.findAll();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener chats' });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Chat no encontrado' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el chat' });
  }
};


exports.createChat = async (req, res) => {
  try {
    const { propertyId, buyerId, sellerId, intermediaryId, status } = req.body;
    if (!propertyId || !buyerId || !sellerId) {
      return res.status(400).json({ error: 'propertyId, buyerId y sellerId son obligatorios' });
    }
    const { User } = require('../models');
    const buyer = await User.findByPk(buyerId);
    const seller = await User.findByPk(sellerId);
    if (!buyer || buyer.role !== 'buyer') {
      return res.status(400).json({ error: 'El buyerId no corresponde a un usuario con rol buyer' });
    }
    if (!seller || seller.role !== 'seller') {
      return res.status(400).json({ error: 'El sellerId no corresponde a un usuario con rol seller' });
    }
    const chat = await Chat.create({ propertyId, buyerId, sellerId, intermediaryId, status });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el chat', detalle: error.message });
  }
};


exports.updateChat = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Chat no encontrado' });
    const { userIds } = req.body;
    if (userIds && (!Array.isArray(userIds) || userIds.length < 2)) {
      return res.status(400).json({ error: 'El chat debe tener al menos 2 usuarios' });
    }
    await chat.update(req.body);
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el chat', detalle: error.message });
  }
};


exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Chat no encontrado' });
    await chat.destroy();
    res.json({ mensaje: 'Chat eliminado', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el chat', detalle: error.message });
  }
};
