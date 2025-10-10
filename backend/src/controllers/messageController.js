// Enviar mensaje validando chat y destinatario
const { Chat, User } = require('../models');
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;
    if (!chatId || !senderId || !content) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: chatId, senderId, content' });
    }
    if (typeof content !== 'string' || content.trim().length < 1) {
      return res.status(400).json({ error: 'El contenido del mensaje no puede estar vacío' });
    }
    // Validar existencia de chat y usuario
    const chat = await Chat.findByPk(chatId);
    const user = await User.findByPk(senderId);
    if (!chat) return res.status(404).json({ error: 'Chat no encontrado' });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    // Validar que el usuario sea parte del chat
    if (!chat.userIds.includes(senderId)) {
      return res.status(403).json({ error: 'El usuario no pertenece a este chat' });
    }
    const message = await Message.create({ chatId, senderId, content });
    res.status(201).json({ mensaje: 'Mensaje enviado', message });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el mensaje', detalle: error.message });
  }
};
const { Message } = require('../models');

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: 'Mensaje no encontrado' });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el mensaje' });
  }
};


exports.createMessage = async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;
    if (!chatId || !senderId || !content) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: chatId, senderId, content' });
    }
    if (typeof content !== 'string' || content.trim().length < 1) {
      return res.status(400).json({ error: 'El contenido del mensaje no puede estar vacío' });
    }
    const message = await Message.create({ chatId, senderId, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el mensaje', detalle: error.message });
  }
};


exports.updateMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: 'Mensaje no encontrado' });
    const { content } = req.body;
    if (content && (typeof content !== 'string' || content.trim().length < 1)) {
      return res.status(400).json({ error: 'El contenido del mensaje no puede estar vacío' });
    }
    await message.update(req.body);
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el mensaje', detalle: error.message });
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
