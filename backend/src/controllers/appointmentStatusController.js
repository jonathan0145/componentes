const { Appointment } = require('../models');

// Confirmar cita
exports.confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
    if (appointment.status === 'confirmed') {
      return res.status(400).json({ error: 'La cita ya está confirmada' });
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
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
    if (appointment.status === 'completed') {
      return res.status(400).json({ error: 'La cita ya está completada' });
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
