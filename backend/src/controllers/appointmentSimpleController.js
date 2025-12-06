const { Appointment } = require('../models');

// Agendar cita SIN validación de conversación/chat
exports.createSimpleAppointment = async (req, res) => {
  try {
    const { userId, propertyId, date, time, notes } = req.body;
    const { User, Profile } = require('../models');
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
    const appointment = await Appointment.create({ userId, propertyId, date, time, notes, status: 'pendiente' });
    // Obtener datos de usuario y perfil
    const user = await User.findByPk(userId, { include: [{ model: Profile, as: 'profile' }] });
    console.log('Usuario completo:', JSON.stringify(user, null, 2));
    const profile = user?.profile;
    console.log('Perfil encontrado:', JSON.stringify(profile, null, 2));
    // Adjuntar datos relevantes al appointment (no guardar en BD, solo para respuesta)
    const appointmentData = appointment.toJSON();
    let nombreVisitante = '';
    if (profile && (profile.firstName || profile.lastName)) {
      nombreVisitante = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
    } else if (user?.name) {
      nombreVisitante = user.name;
    } else {
      nombreVisitante = '';
    }
    console.log('Nombre armado para visitante:', nombreVisitante);
    appointmentData.visitor = {
      name: nombreVisitante,
      email: user?.email || '',
      phone: profile?.phone || user?.phone || ''
    };
    res.status(201).json({
      success: true,
      data: appointmentData,
      message: 'Cita agendada',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
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
