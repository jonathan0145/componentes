const { Role } = require('../models');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json({
      success: true,
      data: roles,
      message: 'Roles obtenidos correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'ROLE_001',
        message: 'Error al obtener roles',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({
      success: false,
      error: {
        code: 'ROLE_002',
        message: 'Rol no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    res.json({
      success: true,
      data: role,
      message: 'Rol obtenido correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'ROLE_003',
        message: 'Error al obtener el rol',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El nombre del rol es obligatorio y debe tener al menos 3 caracteres'
        },
        timestamp: new Date().toISOString()
      });
    }
    const existe = await Role.findOne({ where: { name } });
    if (existe) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'ROLE_004',
          message: 'El nombre de rol ya existe'
        },
        timestamp: new Date().toISOString()
      });
    }
    const role = await Role.create({ name });
    res.status(201).json({
      success: true,
      data: role,
      message: 'Rol creado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'ROLE_005',
        message: 'Error al crear el rol',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({
      success: false,
      error: {
        code: 'ROLE_002',
        message: 'Rol no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    const { name } = req.body;
    if (name && (typeof name !== 'string' || name.trim().length < 3)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El nombre del rol debe tener al menos 3 caracteres'
        },
        timestamp: new Date().toISOString()
      });
    }
    await role.update(req.body);
    res.json({
      success: true,
      data: role,
      message: 'Rol actualizado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'ROLE_006',
        message: 'Error al actualizar el rol',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({
      success: false,
      error: {
        code: 'ROLE_002',
        message: 'Rol no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    await role.destroy();
    res.json({
      success: true,
      data: { id: req.params.id },
      message: 'Rol eliminado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'ROLE_007',
        message: 'Error al eliminar el rol',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
