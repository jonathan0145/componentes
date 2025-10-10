const { File } = require('../models');

exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.findAll();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener archivos' });
  }
};

exports.getFileById = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'Archivo no encontrado' });
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el archivo' });
  }
};


exports.createFile = async (req, res) => {
  try {
    const { filename, url, userId } = req.body;
    if (!filename || !url || !userId) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: filename, url, userId' });
    }
    if (typeof filename !== 'string' || filename.trim().length < 3) {
      return res.status(400).json({ error: 'El nombre del archivo debe tener al menos 3 caracteres' });
    }
    if (typeof url !== 'string' || !url.startsWith('http')) {
      return res.status(400).json({ error: 'La URL del archivo debe ser válida y comenzar con http' });
    }
    const file = await File.create({ filename, url, userId });
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el archivo', detalle: error.message });
  }
};


exports.updateFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'Archivo no encontrado' });
    const { filename, url } = req.body;
    if (filename && (typeof filename !== 'string' || filename.trim().length < 3)) {
      return res.status(400).json({ error: 'El nombre del archivo debe tener al menos 3 caracteres' });
    }
    if (url && (typeof url !== 'string' || !url.startsWith('http'))) {
      return res.status(400).json({ error: 'La URL del archivo debe ser válida y comenzar con http' });
    }
    await file.update(req.body);
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el archivo', detalle: error.message });
  }
};


exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'Archivo no encontrado' });
    await file.destroy();
    res.json({ mensaje: 'Archivo eliminado', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el archivo', detalle: error.message });
  }
};
