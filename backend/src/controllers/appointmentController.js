const { userBelongsToConversation } = require('../utils/conversationUtils');
// Agendar cita con validación de disponibilidad
exports.scheduleAppointment = async (req, res) => {
  try {
    const { userId, propertyId, date, time } = req.body;
    if (!userId || !propertyId || !date) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Faltan campos obligatorios: userId, propertyId, date'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_002',
          message: 'Formato de fecha inválido'
        },
        timestamp: new Date().toISOString()
      });
    }
    // Validar que el usuario pertenece a la conversación (propertyId como conversationId)
    const allowed = await userBelongsToConversation(userId, propertyId);
    if (!allowed) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'CONV_403',
          message: 'El usuario no pertenece a la conversación o propiedad indicada'
        },
        timestamp: new Date().toISOString()
      });
    }
    // Validar disponibilidad: no debe haber otra cita para la propiedad en esa fecha
    const existe = await Appointment.findOne({ where: { propertyId, date } });
    if (existe) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'APPOINTMENT_001',
          message: 'Ya existe una cita para esta propiedad en esa fecha'
        },
        timestamp: new Date().toISOString()
      });
    }
    const appointment = await Appointment.create({ userId, propertyId, date, time, status: 'pendiente' });
    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Cita agendada',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
  // error creating appointment
    res.status(500).json({
      success: false,
      error: {
        code: 'APPOINTMENT_002',
        message: 'Error al agendar la cita',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
const { Appointment } = require('../models');

exports.getAllAppointments = async (req, res) => {
  try {
    const { Property, User, Profile } = require('../models');
    // Obtener el id del usuario autenticado (vendedor)
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ success: false, error: { message: 'No autenticado' } });
    }
    const appointments = await Appointment.findAll({
      include: [
        {
          model: Property,
          as: 'property',
          where: { sellerId },
          include: [
            { model: User, as: 'seller' }
          ]
        },
        {
          model: User,
          as: 'user',
          include: [{ model: Profile, as: 'profile' }]
        }
      ]
    });
    if (appointments.length > 0) {
      console.log('Primera cita:', JSON.stringify(appointments[0], null, 2));
      if (appointments[0].User) {
        console.log('Usuario:', JSON.stringify(appointments[0].User, null, 2));
        if (appointments[0].User.profile) {
          console.log('Perfil:', JSON.stringify(appointments[0].User.profile, null, 2));
        } else {
          console.log('No hay perfil en appointments[0].User');
        }
      } else {
        console.log('No hay User en appointments[0]');
      }
    }
    res.json(appointments);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'APPOINTMENT_003',
        message: 'Error al obtener citas',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({
      success: false,
      error: {
        code: 'APPOINTMENT_004',
        message: 'Cita no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    res.json({
      success: true,
      data: appointment,
      message: 'Cita obtenida correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'APPOINTMENT_005',
        message: 'Error al obtener la cita',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.createAppointment = async (req, res) => {
  try {
  // createAppointment called
    const { userId, propertyId, date, time, status } = req.body;
    if (!userId || !propertyId || !date) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Faltan campos obligatorios: userId, propertyId, date'
        },
        timestamp: new Date().toISOString()
      });
    }
    // Validación de formato de fecha
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_002',
          message: 'Formato de fecha inválido'
        },
        timestamp: new Date().toISOString()
      });
    }
  const appointment = await Appointment.create({ userId, propertyId, date, time, status });
    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Cita creada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'APPOINTMENT_006',
        message: 'Error al crear la cita',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
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
