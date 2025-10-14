const { File } = require('../models');

exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.findAll();
    res.json({
      success: true,
      data: files,
      message: 'Archivos obtenidos correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FILE_001',
        message: 'Error al obtener archivos',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

exports.getFileById = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({
      success: false,
      error: {
        code: 'FILE_002',
        message: 'Archivo no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    res.json({
      success: true,
      data: file,
      message: 'Archivo obtenido correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FILE_003',
        message: 'Error al obtener el archivo',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.createFile = async (req, res) => {
  try {
    const archivo = req.file;
    const userId = req.body.userId;
    const messageId = req.body.messageId;
    if (!archivo || !userId || !messageId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Faltan campos obligatorios: archivo, userId y messageId'
        },
        timestamp: new Date().toISOString()
      });
    }
    if ((typeof userId !== 'string' && typeof userId !== 'number') || isNaN(Number(messageId))) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'userId y messageId deben ser válidos'
        },
        timestamp: new Date().toISOString()
      });
    }
    const filename = archivo.originalname;
    const url = `/uploads/${archivo.filename}`;
    const file = await File.create({ filename, url, userId, messageId });
    res.status(201).json({
      success: true,
      data: file,
      message: 'Archivo subido correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FILE_004',
        message: 'Error al crear el archivo',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.updateFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({
      success: false,
      error: {
        code: 'FILE_002',
        message: 'Archivo no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    const { filename, url } = req.body;
    if (filename && (typeof filename !== 'string' || filename.trim().length < 3)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El nombre del archivo debe tener al menos 3 caracteres'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (url && (typeof url !== 'string' || !url.startsWith('http'))) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'La URL del archivo debe ser válida y comenzar con http'
        },
        timestamp: new Date().toISOString()
      });
    }
    await file.update(req.body);
    res.json({
      success: true,
      data: file,
      message: 'Archivo actualizado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FILE_005',
        message: 'Error al actualizar el archivo',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({
      success: false,
      error: {
        code: 'FILE_002',
        message: 'Archivo no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    await file.destroy();
    res.json({
      success: true,
      data: { id: req.params.id },
      message: 'Archivo eliminado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FILE_006',
        message: 'Error al eliminar el archivo',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
