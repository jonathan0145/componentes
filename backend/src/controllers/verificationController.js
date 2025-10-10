const { Verification } = require('../models');

exports.getAllVerifications = async (req, res) => {
  try {
    const verifications = await Verification.findAll();
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener verificaciones' });
  }
};

exports.getVerificationById = async (req, res) => {
  try {
    const verification = await Verification.findByPk(req.params.id);
    if (!verification) return res.status(404).json({ error: 'Verificación no encontrada' });
    res.json(verification);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la verificación' });
  }
};


exports.createVerification = async (req, res) => {
  try {
    const { userId, type, status } = req.body;
    if (!userId || !type || !status) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: userId, type, status' });
    }
    if (typeof type !== 'string' || type.trim().length < 1) {
      return res.status(400).json({ error: 'El tipo de verificación no puede estar vacío' });
    }
    if (typeof status !== 'string' || status.trim().length < 1) {
      return res.status(400).json({ error: 'El estado de verificación no puede estar vacío' });
    }
    const verification = await Verification.create({ userId, type, status });
    res.status(201).json(verification);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la verificación', detalle: error.message });
  }
};


exports.updateVerification = async (req, res) => {
  try {
    const verification = await Verification.findByPk(req.params.id);
    if (!verification) return res.status(404).json({ error: 'Verificación no encontrada' });
    const { type, status } = req.body;
    if (type && (typeof type !== 'string' || type.trim().length < 1)) {
      return res.status(400).json({ error: 'El tipo de verificación no puede estar vacío' });
    }
    if (status && (typeof status !== 'string' || status.trim().length < 1)) {
      return res.status(400).json({ error: 'El estado de verificación no puede estar vacío' });
    }
    await verification.update(req.body);
    res.json(verification);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la verificación', detalle: error.message });
  }
};


exports.deleteVerification = async (req, res) => {
  try {
    const verification = await Verification.findByPk(req.params.id);
    if (!verification) return res.status(404).json({ error: 'Verificación no encontrada' });
    await verification.destroy();
    res.json({ mensaje: 'Verificación eliminada', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la verificación', detalle: error.message });
  }
};
