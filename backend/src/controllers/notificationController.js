const { Notification } = require('../models');

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'NOTIFICATION_001',
        message: 'Error al obtener notificaciones',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({
      success: false,
      error: {
        code: 'NOTIFICATION_002',
        message: 'Notificación no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    res.json({
      success: true,
      data: notification,
      message: 'Notificación obtenida correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'NOTIFICATION_003',
        message: 'Error al obtener la notificación',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.createNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;
    if (!userId || !type || !message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Faltan campos obligatorios: userId, type, message'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (typeof message !== 'string' || message.trim().length < 1) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El mensaje de la notificación no puede estar vacío'
        },
        timestamp: new Date().toISOString()
      });
    }
    const notification = await Notification.create({ userId, type, message });
    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notificación creada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'NOTIFICATION_004',
        message: 'Error al crear la notificación',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({
      success: false,
      error: {
        code: 'NOTIFICATION_002',
        message: 'Notificación no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    const { message } = req.body;
    if (message && (typeof message !== 'string' || message.trim().length < 1)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El mensaje de la notificación no puede estar vacío'
        },
        timestamp: new Date().toISOString()
      });
    }
    await notification.update(req.body);
    res.json({
      success: true,
      data: notification,
      message: 'Notificación actualizada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'NOTIFICATION_005',
        message: 'Error al actualizar la notificación',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({
      success: false,
      error: {
        code: 'NOTIFICATION_002',
        message: 'Notificación no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    await notification.destroy();
    res.json({
      success: true,
      data: { id: req.params.id },
      message: 'Notificación eliminada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'NOTIFICATION_006',
        message: 'Error al eliminar la notificación',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
