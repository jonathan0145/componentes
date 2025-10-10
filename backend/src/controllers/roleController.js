const { Role } = require('../models');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener roles' });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ error: 'Rol no encontrado' });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el rol' });
  }
};


exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return res.status(400).json({ error: 'El nombre del rol es obligatorio y debe tener al menos 3 caracteres' });
    }
    const existe = await Role.findOne({ where: { name } });
    if (existe) {
      return res.status(409).json({ error: 'El nombre de rol ya existe' });
    }
    const role = await Role.create({ name });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el rol', detalle: error.message });
  }
};


exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ error: 'Rol no encontrado' });
    const { name } = req.body;
    if (name && (typeof name !== 'string' || name.trim().length < 3)) {
      return res.status(400).json({ error: 'El nombre del rol debe tener al menos 3 caracteres' });
    }
    await role.update(req.body);
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el rol', detalle: error.message });
  }
};


exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ error: 'Rol no encontrado' });
    await role.destroy();
    res.json({ mensaje: 'Rol eliminado', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el rol', detalle: error.message });
  }
};
