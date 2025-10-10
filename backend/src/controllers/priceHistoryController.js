const { PriceHistory } = require('../models');

exports.getAllPriceHistories = async (req, res) => {
  try {
    const histories = await PriceHistory.findAll();
    res.json(histories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historiales de precios' });
  }
};

exports.getPriceHistoryById = async (req, res) => {
  try {
    const history = await PriceHistory.findByPk(req.params.id);
    if (!history) return res.status(404).json({ error: 'Historial no encontrado' });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
};


exports.createPriceHistory = async (req, res) => {
  try {
    const { propertyId, price, date } = req.body;
    if (!propertyId || !price || !date) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: propertyId, price, date' });
    }
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'El precio debe ser un número positivo' });
    }
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ error: 'Formato de fecha inválido' });
    }
    const history = await PriceHistory.create({ propertyId, price, date });
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el historial', detalle: error.message });
  }
};


exports.updatePriceHistory = async (req, res) => {
  try {
    const history = await PriceHistory.findByPk(req.params.id);
    if (!history) return res.status(404).json({ error: 'Historial no encontrado' });
    const { price, date } = req.body;
    if (price && (typeof price !== 'number' || price <= 0)) {
      return res.status(400).json({ error: 'El precio debe ser un número positivo' });
    }
    if (date && isNaN(Date.parse(date))) {
      return res.status(400).json({ error: 'Formato de fecha inválido' });
    }
    await history.update(req.body);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el historial', detalle: error.message });
  }
};


exports.deletePriceHistory = async (req, res) => {
  try {
    const history = await PriceHistory.findByPk(req.params.id);
    if (!history) return res.status(404).json({ error: 'Historial no encontrado' });
    await history.destroy();
    res.json({ mensaje: 'Historial eliminado', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el historial', detalle: error.message });
  }
};
