const { User, Profile, Role } = require('../models');

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: { message: 'No autenticado' } });

    const user = await User.findByPk(userId, {
      include: [
        { model: Profile, as: 'profile' },
        { model: Role }
      ]
    });
    if (!user) return res.status(404).json({ success: false, error: { message: 'Usuario no encontrado' } });

    const { password, ...userData } = user.toJSON();
    const profile = userData.profile || {};
    res.json({
      success: true,
      data: {
        id: userData.id,
        email: userData.email,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        role: userData.role,
        phone: profile.phone || '',
        avatarUrl: profile.avatar || '',
        isVerified: userData.verified || false,
        preferences: profile.preferences || {},
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      },
      message: 'Perfil obtenido correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_003',
        message: 'Error al obtener perfil',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });

  }
}

// Actualizar perfil del usuario autenticado
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      console.error('No autenticado');
      return res.status(401).json({ success: false, error: { message: 'No autenticado' } });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      console.error('Usuario no encontrado');
      return res.status(404).json({ success: false, error: { message: 'Usuario no encontrado' } });
    }

    // Actualizar datos de perfil
    const { firstName, lastName, phone, preferences } = req.body;
    let profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      profile = await Profile.create({
        userId,
        firstName: firstName || '',
        lastName: lastName || ''
      });
    }
    if (firstName !== undefined) profile.firstName = firstName;
    if (lastName !== undefined) profile.lastName = lastName;
    if (phone !== undefined) profile.phone = phone;
    if (preferences !== undefined) profile.preferences = preferences;
    await profile.save();

    // Si se quiere actualizar la contraseña
    if (req.body.password) {
      const bcrypt = require('bcrypt');
      user.password = await bcrypt.hash(req.body.password, 10);
      await user.save();
    }

    // Obtener datos completos del usuario y perfil para respuesta consistente
    const userWithProfile = await User.findByPk(userId, {
      include: [
        { model: Profile, as: 'profile' },
        { model: Role }
      ]
    });
    const { password, ...userData } = userWithProfile.toJSON();
    const profileData = userData.profile || {};
    res.json({
      success: true,
      data: {
        id: userData.id,
        email: userData.email,
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        role: userData.role,
        phone: profileData.phone || '',
        avatarUrl: profileData.avatar || '',
        isVerified: userData.verified || false,
        preferences: profileData.preferences || {},
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      },
      message: 'Perfil actualizado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_004',
        message: 'Error al actualizar perfil',
        details: error.message,
        stack: error.stack
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Subir avatar del usuario autenticado
exports.uploadAvatar = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: { message: 'No autenticado' } });

    let profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      profile = await Profile.create({ userId });
    }

    if (!req.file) return res.status(400).json({ success: false, error: { message: 'No se subió ningún archivo' } });

    // Guardar ruta relativa del avatar
    const avatarUrl = `/uploads/${req.file.filename}`;
    profile.avatar = avatarUrl;
    await profile.save();

    res.json({ success: true, data: { avatarUrl }, message: 'Avatar subido correctamente', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_005',
        message: 'Error al subir avatar',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: Role });
    res.json(users);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_001',
        message: 'Error al obtener usuarios',
        details: err.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { include: Role });
    if (!user) return res.status(404).json({
      success: false,
      error: {
        code: 'USER_001',
        message: 'Usuario no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    res.json({
      success: true,
      data: user,
      message: 'Usuario obtenido correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_002',
        message: 'Error al obtener usuario',
        details: err.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.createUser = async (req, res) => {
  try {
    const { email, password, name, roleId } = req.body;
    if (!email || !password || !name || !roleId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Faltan campos obligatorios: email, password, name, roleId'
        },
        timestamp: new Date().toISOString()
      });
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Formato de email inválido'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'La contraseña debe tener al menos 6 caracteres'
        },
        timestamp: new Date().toISOString()
      });
    }
    const existe = await User.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_002',
          message: 'El email ya está registrado'
        },
        timestamp: new Date().toISOString()
      });
    }
    const user = await User.create({ email, password, name, roleId });
    res.status(201).json({
      success: true,
      data: user,
      message: 'Usuario creado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_003',
        message: 'Error al crear usuario',
        details: err.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({
      success: false,
      error: {
        code: 'USER_001',
        message: 'Usuario no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    const { email, password, name, roleId } = req.body;
    if (email) {
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_001',
            message: 'Formato de email inválido'
          },
          timestamp: new Date().toISOString()
        });
      }
    }
    if (password && password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'La contraseña debe tener al menos 6 caracteres'
        },
        timestamp: new Date().toISOString()
      });
    }
    await user.update(req.body);
    res.json({
      success: true,
      data: user,
      message: 'Usuario actualizado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_004',
        message: 'Error al actualizar usuario',
        details: err.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({
      success: false,
      error: {
        code: 'USER_001',
        message: 'Usuario no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    await user.destroy();
    res.json({
      success: true,
      data: { id: req.params.id },
      message: 'Usuario eliminado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_005',
        message: 'Error al eliminar usuario',
        details: err.message
      },
      timestamp: new Date().toISOString()
    });
  }
};