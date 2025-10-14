const { User, Role } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: Role });
    res.json({
      success: true,
      data: users,
      message: 'Usuarios obtenidos correctamente',
      timestamp: new Date().toISOString()
    });
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
