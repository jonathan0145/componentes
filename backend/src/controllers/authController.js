const { User, Role } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { email, password, name, roleId } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    const existe = await User.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name, roleId });
    res.status(201).json({ mensaje: 'Usuario registrado', user });
  } catch (error) {
    res.status(500).json({ error: 'Error en el registro' });
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
    res.json({ mensaje: 'Login exitoso', token, user: { id: user.id, email: user.email, name: user.name, role: user.Role ? user.Role.name : null } });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login' });
  }
};
