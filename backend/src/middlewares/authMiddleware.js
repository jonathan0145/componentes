const jwt = require('jsonwebtoken');
const { User, Role, Permission } = require('../models');

// Middleware para verificar JWT
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = decoded;
    next();
  });
};

// Middleware para verificar rol
exports.requireRole = (roleName) => async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { include: Role });
    if (!user || !user.Role || user.Role.name !== roleName) {
      return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error de autorización' });
  }
};

// Middleware para verificar permiso
exports.requirePermission = (permissionName) => async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { include: [{ model: Role, include: [Permission] }] });
    const permisos = user?.Role?.Permissions?.map(p => p.name) || [];
    if (!permisos.includes(permissionName)) {
      return res.status(403).json({ error: 'Acceso denegado: permiso insuficiente' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error de autorización' });
  }
};
