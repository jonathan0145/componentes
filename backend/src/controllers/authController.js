// Refresh token
exports.refresh = async (req, res) => {
  try {
    // Aquí va la lógica real de refresh
    res.json({
      success: true,
      data: { token: 'nuevo_token', refreshToken: 'nuevo_refresh' },
      message: 'Token renovado (stub)',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_004',
        message: 'Error al renovar token',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
const { User, Role } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    console.log('BODY REGISTRO:', req.body);
    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    const existe = await User.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    // Buscar el rol por nombre (case-insensitive)
    const roleObj = await Role.findOne({ where: { name: role.toLowerCase() } });
    if (!roleObj) {
      return res.status(400).json({ error: 'Rol no válido' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      role: roleObj.name, // Guardar el nombre del rol
      roleId: roleObj.id  // Relación con la tabla Role
    });
    res.status(201).json({ mensaje: 'Usuario registrado', user });
  } catch (error) {
    res.status(500).json({ error: 'Error en el registro', detalle: error.message });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    const user = await User.findOne({ where: { email }, include: Role });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const valido = await bcrypt.compare(password, user.password);
    if (!valido) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    const token = jwt.sign({ id: user.id, role: user.Role ? user.Role.name : null }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      mensaje: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.Role ? user.Role.name : null,
        emailVerified: user.emailVerified,
        verified: user.verified,
        // Puedes agregar aquí otros campos de verificación si los usas
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login', detalle: error.message });
  }
};
