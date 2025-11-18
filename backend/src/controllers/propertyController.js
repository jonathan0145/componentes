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
    res.status(500).json({
      success: false,
      error: {
        code: 'PROPERTY_001',
        message: 'Error al obtener propiedades',
        details: err.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, { include: [{ model: User, as: 'seller' }, PriceHistory] });
    if (!property) return res.status(404).json({
      success: false,
      error: {
        code: 'PROPERTY_002',
        message: 'Propiedad no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    res.json({
      success: true,
      data: property,
      message: 'Propiedad obtenida correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PROPERTY_003',
        message: 'Error al obtener propiedad',
        details: err.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.createProperty = async (req, res) => {
  try {
    const { title, description, price, address, sellerId } = req.body;
    if (!title || !price || !address || !sellerId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Faltan campos obligatorios: title, price, address, sellerId'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El precio debe ser un número positivo'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (title.length < 3) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El título debe tener al menos 3 caracteres'
        },
        timestamp: new Date().toISOString()
      });
    }
    const property = await Property.create({ title, description, price, address, sellerId });
    res.status(201).json({
      success: true,
      data: property,
      message: 'Propiedad creada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PROPERTY_004',
        message: 'Error al crear propiedad',
        details: err.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({
      success: false,
      error: {
        code: 'PROPERTY_002',
        message: 'Propiedad no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    const { price, title } = req.body;
    if (price && (typeof price !== 'number' || price <= 0)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El precio debe ser un número positivo'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (title && title.length < 3) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El título debe tener al menos 3 caracteres'
        },
        timestamp: new Date().toISOString()
      });
    }
    await property.update(req.body);
    res.json({
      success: true,
      data: property,
      message: 'Propiedad actualizada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PROPERTY_005',
        message: 'Error al actualizar propiedad',
        details: err.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({
      success: false,
      error: {
        code: 'PROPERTY_002',
        message: 'Propiedad no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    await property.destroy();
    res.json({
      success: true,
      data: { id: req.params.id },
      message: 'Propiedad eliminada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PROPERTY_006',
        message: 'Error al eliminar propiedad',
        details: err.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
