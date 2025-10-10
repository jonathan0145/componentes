const { Permission } = require('../models');

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener permisos' });
  }
};

exports.getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ error: 'Permiso no encontrado' });
    res.json(permission);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el permiso' });
  }
};


exports.createPermission = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return res.status(400).json({ error: 'El nombre del permiso es obligatorio y debe tener al menos 3 caracteres' });
    }
    const existe = await Permission.findOne({ where: { name } });
    if (existe) {
      return res.status(409).json({ error: 'El nombre de permiso ya existe' });
    }
    const permission = await Permission.create({ name });
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el permiso', detalle: error.message });
  }
};


exports.updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ error: 'Permiso no encontrado' });
    const { name } = req.body;
    if (name && (typeof name !== 'string' || name.trim().length < 3)) {
      return res.status(400).json({ error: 'El nombre del permiso debe tener al menos 3 caracteres' });
    }
    await permission.update(req.body);
    res.json(permission);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el permiso', detalle: error.message });
  }
};


exports.deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ error: 'Permiso no encontrado' });
    await permission.destroy();
    res.json({ mensaje: 'Permiso eliminado', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el permiso', detalle: error.message });
  }
};
