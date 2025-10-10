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
    const { userIds } = req.body;
    if (!userIds || !Array.isArray(userIds) || userIds.length < 2) {
      return res.status(400).json({ error: 'Faltan usuarios para el chat (mínimo 2)' });
    }
    const chat = await Chat.create({ userIds });
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
