const { Verification, User } = require('../models');
const { sendVerificationEmail } = require('../services/emailService');

// POST /api/verifications/email/confirm
exports.confirmEmailVerificationCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email y código requeridos' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    if (!user.emailVerificationCode || !user.emailVerificationExpires) {
      return res.status(400).json({ success: false, message: 'No hay código pendiente de verificación' });
    }
    if (user.emailVerificationExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'El código ha expirado' });
    }
    if (user.emailVerificationCode !== code) {
      return res.status(400).json({ success: false, message: 'Código incorrecto' });
    }
    user.emailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationExpires = null;
    await user.save();
    return res.json({ success: true, message: 'Email verificado correctamente' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error verificando código', error: err.message });
  }
};

// POST /api/verifications/email/send
exports.sendEmailVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email requerido' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // Expira en 15 minutos
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    // Guardar en el usuario
    user.emailVerificationCode = code;
    user.emailVerificationExpires = expires;
    await user.save();
    // Enviar email
    await sendVerificationEmail(email, code);
    return res.json({ success: true, message: 'Código de verificación enviado al email' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error enviando código', error: err.message });
  }
};
exports.getAllVerifications = async (req, res) => {
  try {
    const verifications = await Verification.findAll();
    res.json(verifications);
  } catch (error) {
  // Error in controller: logged in error response
    res.status(500).json({
      success: false,
      error: {
        code: 'VERIFICATION_001',
        message: 'Error al obtener verificaciones',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

exports.getVerificationById = async (req, res) => {
  try {
    const verification = await Verification.findByPk(req.params.id);
    if (!verification) return res.status(404).json({
      success: false,
      error: {
        code: 'VERIFICATION_002',
        message: 'Verificación no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    res.json({
      success: true,
      data: verification,
      message: 'Verificación obtenida correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'VERIFICATION_003',
        message: 'Error al obtener la verificación',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.createVerification = async (req, res) => {
  try {
    const { userId, type, status } = req.body;
    if (!userId || !type || !status) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Faltan campos obligatorios: userId, type, status'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (typeof type !== 'string' || type.trim().length < 1) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_002',
          message: 'El tipo de verificación no puede estar vacío'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (typeof status !== 'string' || status.trim().length < 1) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_003',
          message: 'El estado de verificación no puede estar vacío'
        },
        timestamp: new Date().toISOString()
      });
    }
    const verification = await Verification.create({ userId, type, status });
    res.status(201).json({
      success: true,
      data: verification,
      message: 'Verificación creada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'VERIFICATION_004',
        message: 'Error al crear la verificación',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.updateVerification = async (req, res) => {
  try {
    const verification = await Verification.findByPk(req.params.id);
    if (!verification) return res.status(404).json({
      success: false,
      error: {
        code: 'VERIFICATION_002',
        message: 'Verificación no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    const { type, status } = req.body;
    if (type && (typeof type !== 'string' || type.trim().length < 1)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_002',
          message: 'El tipo de verificación no puede estar vacío'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (status && (typeof status !== 'string' || status.trim().length < 1)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_003',
          message: 'El estado de verificación no puede estar vacío'
        },
        timestamp: new Date().toISOString()
      });
    }
    await verification.update(req.body);
    res.json({
      success: true,
      data: verification,
      message: 'Verificación actualizada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'VERIFICATION_005',
        message: 'Error al actualizar la verificación',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.deleteVerification = async (req, res) => {
  try {
    const verification = await Verification.findByPk(req.params.id);
    if (!verification) return res.status(404).json({ error: 'Verificación no encontrada' });
    await verification.destroy();
    res.json({ mensaje: 'Verificación eliminada', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la verificación', detalle: error.message });
  }
};
