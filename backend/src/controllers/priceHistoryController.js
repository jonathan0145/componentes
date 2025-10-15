const { PriceHistory } = require('../models');

exports.getAllPriceHistories = async (req, res) => {
  try {
    const histories = await PriceHistory.findAll();
    res.json({
      success: true,
      data: histories,
      message: 'Historiales de precios obtenidos correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PRICEHISTORY_001',
        message: 'Error al obtener historiales de precios',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

exports.getPriceHistoryById = async (req, res) => {
  try {
    const history = await PriceHistory.findByPk(req.params.id);
    if (!history) return res.status(404).json({
      success: false,
      error: {
        code: 'PRICEHISTORY_002',
        message: 'Historial no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    res.json({
      success: true,
      data: history,
      message: 'Historial obtenido correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PRICEHISTORY_003',
        message: 'Error al obtener el historial',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.createPriceHistory = async (req, res) => {
  try {
    const { propertyId, price, date } = req.body;
    if (!propertyId || !price || !date) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Faltan campos obligatorios: propertyId, price, date'
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
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Formato de fecha inválido'
        },
        timestamp: new Date().toISOString()
      });
    }
    const history = await PriceHistory.create({ propertyId, price, date });
    res.status(201).json({
      success: true,
      data: history,
      message: 'Historial creado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PRICEHISTORY_004',
        message: 'Error al crear el historial',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.updatePriceHistory = async (req, res) => {
  try {
    const history = await PriceHistory.findByPk(req.params.id);
    if (!history) return res.status(404).json({
      success: false,
      error: {
        code: 'PRICEHISTORY_002',
        message: 'Historial no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    const { price, date } = req.body;
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
    if (date && isNaN(Date.parse(date))) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Formato de fecha inválido'
        },
        timestamp: new Date().toISOString()
      });
    }
    await history.update(req.body);
    res.json({
      success: true,
      data: history,
      message: 'Historial actualizado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PRICEHISTORY_005',
        message: 'Error al actualizar el historial',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};


exports.deletePriceHistory = async (req, res) => {
  try {
    const history = await PriceHistory.findByPk(req.params.id);
    if (!history) return res.status(404).json({
      success: false,
      error: {
        code: 'PRICEHISTORY_002',
        message: 'Historial no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    await history.destroy();
    res.json({
      success: true,
      data: { id: req.params.id },
      message: 'Historial eliminado correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PRICEHISTORY_006',
        message: 'Error al eliminar el historial',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
