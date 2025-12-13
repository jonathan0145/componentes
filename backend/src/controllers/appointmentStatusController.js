const { Appointment } = require('../models');

// Confirmar cita
exports.confirmAppointment = async (req, res) => {
  try {
    const { Property } = require('../models');
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
    if (appointment.status === 'confirmed') {
      return res.status(400).json({ error: 'La cita ya está confirmada' });
    }
    // Solo el usuario que NO creó la cita puede confirmar
    const userId = req.user?.id;
    const property = await Property.findByPk(appointment.propertyId);
    if (!property) return res.status(404).json({ error: 'Propiedad no encontrada' });
    if (userId === appointment.userId) {
      return res.status(403).json({ error: 'No puedes confirmar tu propia cita. Solo el otro participante puede hacerlo.' });
    }
    if (userId !== property.sellerId && userId !== appointment.userId) {
      return res.status(403).json({ error: 'No tienes permisos para confirmar esta cita.' });
    }
    await appointment.update({
      status: 'confirmed',
      confirmedAt: new Date()
    });
    res.json({ success: true, data: appointment, message: 'Cita confirmada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al confirmar la cita', detalle: error.message });
  }
};

// Completar cita
exports.completeAppointment = async (req, res) => {
  try {
    const { Property } = require('../models');
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
    if (appointment.status === 'completed') {
      return res.status(400).json({ error: 'La cita ya está completada' });
    }
    // Solo el usuario que NO creó la cita puede completar
    const userId = req.user?.id;
    const property = await Property.findByPk(appointment.propertyId);
    if (!property) return res.status(404).json({ error: 'Propiedad no encontrada' });
    if (userId === appointment.userId) {
      return res.status(403).json({ error: 'No puedes marcar como completada tu propia cita. Solo el otro participante puede hacerlo.' });
    }
    if (userId !== property.sellerId && userId !== appointment.userId) {
      return res.status(403).json({ error: 'No tienes permisos para completar esta cita.' });
    }
    await appointment.update({
      status: 'completed',
      completedAt: new Date()
    });
    res.json({ success: true, data: appointment, message: 'Cita completada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al completar la cita', detalle: error.message });
  }
};

// Cancelar cita
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ error: 'La cita ya está cancelada' });
    }
    const { reason } = req.body;
    await appointment.update({
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelReason: reason || null
    });
    res.json({ success: true, data: appointment, message: 'Cita cancelada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar la cita', detalle: error.message });
  }
};
