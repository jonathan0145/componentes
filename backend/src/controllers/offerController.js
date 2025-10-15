// Responder a una oferta
exports.respondOffer = async (req, res) => {
  try {
    // Aquí va la lógica real de respuesta a la oferta
    res.json({
      success: true,
      data: null,
      message: 'Respuesta a la oferta registrada (stub)',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'OFFER_011',
        message: 'Error al responder la oferta',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
// Aceptar una oferta
exports.acceptOffer = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({
      success: false,
      error: {
        code: 'OFFER_001',
        message: 'Oferta no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    if (offer.status === 'aceptada') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'OFFER_002',
          message: 'La oferta ya fue aceptada'
        },
        timestamp: new Date().toISOString()
      });
    }
    await offer.update({ status: 'aceptada' });
    res.json({
      success: true,
      data: offer,
      message: 'Oferta aceptada',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'OFFER_003',
        message: 'Error al aceptar la oferta',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Rechazar una oferta
exports.rejectOffer = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({
      success: false,
      error: {
        code: 'OFFER_001',
        message: 'Oferta no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    if (offer.status === 'rechazada') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'OFFER_004',
          message: 'La oferta ya fue rechazada'
        },
        timestamp: new Date().toISOString()
      });
    }
    await offer.update({ status: 'rechazada' });
    res.json({
      success: true,
      data: offer,
      message: 'Oferta rechazada',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'OFFER_005',
        message: 'Error al rechazar la oferta',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
const { Offer } = require('../models');

// Obtener todas las ofertas
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll();
    res.json({
      success: true,
      data: offers,
      message: 'Ofertas obtenidas correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'OFFER_006',
        message: 'Error al obtener ofertas',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Obtener una oferta por ID
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({
      success: false,
      error: {
        code: 'OFFER_001',
        message: 'Oferta no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    res.json({
      success: true,
      data: offer,
      message: 'Oferta obtenida correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'OFFER_007',
        message: 'Error al obtener la oferta',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Crear una nueva oferta

exports.createOffer = async (req, res) => {
  try {
    const { propertyId, buyerId, amount, status } = req.body;
    if (!propertyId || !buyerId || !amount) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Faltan campos obligatorios: propertyId, buyerId, amount'
        },
        timestamp: new Date().toISOString()
      });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El monto debe ser un número positivo'
        },
        timestamp: new Date().toISOString()
      });
    }
    const { User } = require('../models');
    const buyer = await User.findByPk(buyerId);
    if (!buyer || buyer.role !== 'buyer') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El buyerId no corresponde a un usuario con rol buyer'
        },
        timestamp: new Date().toISOString()
      });
    }
    const offer = await Offer.create({ propertyId, buyerId, amount, status });
    res.status(201).json({
      success: true,
      data: offer,
      message: 'Oferta creada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'OFFER_008',
        message: 'Error al crear la oferta',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Actualizar una oferta

exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({
      success: false,
      error: {
        code: 'OFFER_001',
        message: 'Oferta no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    const { amount } = req.body;
    if (amount && (typeof amount !== 'number' || amount <= 0)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'El monto debe ser un número positivo'
        },
        timestamp: new Date().toISOString()
      });
    }
    await offer.update(req.body);
    res.json({
      success: true,
      data: offer,
      message: 'Oferta actualizada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'OFFER_009',
        message: 'Error al actualizar la oferta',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Eliminar una oferta

exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({
      success: false,
      error: {
        code: 'OFFER_001',
        message: 'Oferta no encontrada'
      },
      timestamp: new Date().toISOString()
    });
    await offer.destroy();
    res.json({
      success: true,
      data: { id: req.params.id },
      message: 'Oferta eliminada',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'OFFER_010',
        message: 'Error al eliminar la oferta',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};
