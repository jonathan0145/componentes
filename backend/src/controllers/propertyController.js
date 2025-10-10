// Cambiar estado de una propiedad
exports.changeStatus = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ error: 'Propiedad no encontrada' });
    const { status } = req.body;
    const estadosValidos = ['publicada', 'reservada', 'vendida'];
    if (!status || !estadosValidos.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido. Debe ser: publicada, reservada o vendida' });
    }
    await property.update({ status });
    res.json({ mensaje: 'Estado actualizado', property });
  } catch (err) {
    res.status(500).json({ error: 'Error al cambiar el estado de la propiedad', detalle: err.message });
  }
};
const { Property, User, PriceHistory } = require('../models');

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({ include: [{ model: User, as: 'seller' }, PriceHistory] });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener propiedades' });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, { include: [{ model: User, as: 'seller' }, PriceHistory] });
    if (!property) return res.status(404).json({ error: 'Propiedad no encontrada' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener propiedad' });
  }
};


exports.createProperty = async (req, res) => {
  try {
    const { title, description, price, address, sellerId } = req.body;
    if (!title || !price || !address || !sellerId) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: title, price, address, sellerId' });
    }
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'El precio debe ser un número positivo' });
    }
    if (title.length < 3) {
      return res.status(400).json({ error: 'El título debe tener al menos 3 caracteres' });
    }
    const property = await Property.create({ title, description, price, address, sellerId });
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear propiedad', detalle: err.message });
  }
};


exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ error: 'Propiedad no encontrada' });
    const { price, title } = req.body;
    if (price && (typeof price !== 'number' || price <= 0)) {
      return res.status(400).json({ error: 'El precio debe ser un número positivo' });
    }
    if (title && title.length < 3) {
      return res.status(400).json({ error: 'El título debe tener al menos 3 caracteres' });
    }
    await property.update(req.body);
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar propiedad', detalle: err.message });
  }
};


exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ error: 'Propiedad no encontrada' });
    await property.destroy();
    res.json({ message: 'Propiedad eliminada', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar propiedad', detalle: err.message });
  }
};
