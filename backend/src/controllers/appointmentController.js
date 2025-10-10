// Agendar cita con validación de disponibilidad
exports.scheduleAppointment = async (req, res) => {
  try {
    const { userId, propertyId, date } = req.body;
    if (!userId || !propertyId || !date) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: userId, propertyId, date' });
    }
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ error: 'Formato de fecha inválido' });
    }
    // Validar disponibilidad: no debe haber otra cita para la propiedad en esa fecha
    const existe = await Appointment.findOne({ where: { propertyId, date } });
    if (existe) {
      return res.status(409).json({ error: 'Ya existe una cita para esta propiedad en esa fecha' });
    }
    const appointment = await Appointment.create({ userId, propertyId, date, status: 'pendiente' });
    res.status(201).json({ mensaje: 'Cita agendada', appointment });
  } catch (error) {
    res.status(500).json({ error: 'Error al agendar la cita', detalle: error.message });
  }
};
const { Appointment } = require('../models');

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener citas' });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la cita' });
  }
};


exports.createAppointment = async (req, res) => {
  try {
    const { userId, propertyId, date, status } = req.body;
    if (!userId || !propertyId || !date) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: userId, propertyId, date' });
    }
    // Validación de formato de fecha
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ error: 'Formato de fecha inválido' });
    }
    const appointment = await Appointment.create({ userId, propertyId, date, status });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la cita', detalle: error.message });
  }
};


exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
    const { date } = req.body;
    if (date && isNaN(Date.parse(date))) {
      return res.status(400).json({ error: 'Formato de fecha inválido' });
    }
    await appointment.update(req.body);
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cita', detalle: error.message });
  }
};


exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });
    await appointment.destroy();
    res.json({ mensaje: 'Cita eliminada', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la cita', detalle: error.message });
  }
};
