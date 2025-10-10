// Aceptar una oferta
exports.acceptOffer = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Oferta no encontrada' });
    if (offer.status === 'aceptada') {
      return res.status(400).json({ error: 'La oferta ya fue aceptada' });
    }
    await offer.update({ status: 'aceptada' });
    res.json({ mensaje: 'Oferta aceptada', offer });
  } catch (error) {
    res.status(500).json({ error: 'Error al aceptar la oferta', detalle: error.message });
  }
};

// Rechazar una oferta
exports.rejectOffer = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Oferta no encontrada' });
    if (offer.status === 'rechazada') {
      return res.status(400).json({ error: 'La oferta ya fue rechazada' });
    }
    await offer.update({ status: 'rechazada' });
    res.json({ mensaje: 'Oferta rechazada', offer });
  } catch (error) {
    res.status(500).json({ error: 'Error al rechazar la oferta', detalle: error.message });
  }
};
const { Offer } = require('../models');

// Obtener todas las ofertas
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll();
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ofertas' });
  }
};

// Obtener una oferta por ID
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Oferta no encontrada' });
    res.json(offer);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la oferta' });
  }
};

// Crear una nueva oferta

exports.createOffer = async (req, res) => {
  try {
    const { propertyId, userId, amount, status } = req.body;
    if (!propertyId || !userId || !amount) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: propertyId, userId, amount' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'El monto debe ser un número positivo' });
    }
    const offer = await Offer.create({ propertyId, userId, amount, status });
    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la oferta', detalle: error.message });
  }
};

// Actualizar una oferta

exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Oferta no encontrada' });
    const { amount } = req.body;
    if (amount && (typeof amount !== 'number' || amount <= 0)) {
      return res.status(400).json({ error: 'El monto debe ser un número positivo' });
    }
    await offer.update(req.body);
    res.json(offer);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la oferta', detalle: error.message });
  }
};

// Eliminar una oferta

exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Oferta no encontrada' });
    await offer.destroy();
    res.json({ mensaje: 'Oferta eliminada', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la oferta', detalle: error.message });
  }
};
