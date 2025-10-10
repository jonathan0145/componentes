const { Notification } = require('../models');

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notificación no encontrada' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la notificación' });
  }
};


exports.createNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;
    if (!userId || !type || !message) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: userId, type, message' });
    }
    if (typeof message !== 'string' || message.trim().length < 1) {
      return res.status(400).json({ error: 'El mensaje de la notificación no puede estar vacío' });
    }
    const notification = await Notification.create({ userId, type, message });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la notificación', detalle: error.message });
  }
};


exports.updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notificación no encontrada' });
    const { message } = req.body;
    if (message && (typeof message !== 'string' || message.trim().length < 1)) {
      return res.status(400).json({ error: 'El mensaje de la notificación no puede estar vacío' });
    }
    await notification.update(req.body);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la notificación', detalle: error.message });
  }
};


exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notificación no encontrada' });
    await notification.destroy();
    res.json({ mensaje: 'Notificación eliminada', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la notificación', detalle: error.message });
  }
};
