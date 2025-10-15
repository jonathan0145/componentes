const { Permission } = require('../models');

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.json({
      success: true,
      data: permissions,
      message: 'Permisos obtenidos correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PERMISSION_001',
        message: 'Error al obtener permisos',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

exports.getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({
      success: false,
      error: {
        code: 'PERMISSION_002',
        message: 'Permiso no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    res.json({
      success: true,
      data: permission,
      message: 'Permiso obtenido correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PERMISSION_003',
        message: 'Error al obtener el permiso',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.createPermission = async (req, res) => {
  try {
    const { action, roleId, allowed } = req.body;
    if (!action || typeof action !== 'string' || action.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El campo action es obligatorio y debe tener al menos 3 caracteres'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (!roleId || typeof roleId !== 'number') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El campo roleId es obligatorio y debe ser un número válido'
        },
        timestamp: new Date().toISOString()
      });
    }
    const existe = await Permission.findOne({ where: { action, roleId } });
    if (existe) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'PERMISSION_004',
          message: 'El permiso ya existe para ese rol'
        },
        timestamp: new Date().toISOString()
      });
    }
    const permission = await Permission.create({ action, roleId, allowed: allowed !== undefined ? allowed : true });
    res.status(201).json({
      success: true,
      data: permission,
      message: 'Permiso creado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PERMISSION_005',
        message: 'Error al crear el permiso',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({
      success: false,
      error: {
        code: 'PERMISSION_002',
        message: 'Permiso no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    const { name } = req.body;
    if (name && (typeof name !== 'string' || name.trim().length < 3)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El nombre del permiso debe tener al menos 3 caracteres'
        },
        timestamp: new Date().toISOString()
      });
    }
    await permission.update(req.body);
    res.json({
      success: true,
      data: permission,
      message: 'Permiso actualizado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PERMISSION_006',
        message: 'Error al actualizar el permiso',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({
      success: false,
      error: {
        code: 'PERMISSION_002',
        message: 'Permiso no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    await permission.destroy();
    res.json({
      success: true,
      data: { id: req.params.id },
      message: 'Permiso eliminado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PERMISSION_007',
        message: 'Error al eliminar el permiso',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
