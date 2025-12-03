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
const { Op } = require('sequelize');

exports.getAllProperties = async (req, res) => {
  try {
    // Construir filtros dinámicos
    const { city, minPrice, maxPrice, propertyType, bedrooms, bathrooms, status, search } = req.query;
    const where = {};
    if (city) where.city = city;
    if (propertyType) where.propertyType = propertyType;
    if (status) where.status = status;
    if (minPrice) where.price = { ...(where.price || {}), [Op.gte]: Number(minPrice) };
    if (maxPrice) where.price = { ...(where.price || {}), [Op.lte]: Number(maxPrice) };
    if (bedrooms) where.bedrooms = { [Op.gte]: Number(bedrooms) };
    if (bathrooms) where.bathrooms = { [Op.gte]: Number(bathrooms) };
    if (search) {
      // Usar LIKE para MariaDB/MySQL
      where.title = { [Op.like]: `%${search}%` };
    }
    // Eliminar filtros si el valor es nulo
    Object.keys(where).forEach(key => {
      if (where[key] === null || where[key] === undefined) delete where[key];
    });
    const properties = await Property.findAll({ where, include: [{ model: User, as: 'seller' }, PriceHistory] });
    // Construir features en cada propiedad para la respuesta
    const propertiesWithFeatures = properties.map(p => {
      const data = p.toJSON();
      data.features = {
        furnished: data.furnished ?? false,
        petFriendly: data.petFriendly ?? false,
        elevator: data.elevator ?? false,
        balcony: data.balcony ?? false,
        garden: data.garden ?? false,
        pool: data.pool ?? false,
        gym: data.gym ?? false,
        security: data.security ?? false,
        airConditioning: data.airConditioning ?? false,
        heating: data.heating ?? false,
        internet: data.internet ?? false,
        laundry: data.laundry ?? false
      };
      return data;
    });
    res.json(propertiesWithFeatures);
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
    // Construir features en la respuesta
    const data = property.toJSON();
    // Asegurar que images sea un array
    if (typeof data.images === 'string') {
      try {
        data.images = JSON.parse(data.images);
      } catch (e) {
        data.images = [];
      }
    }
    console.log('DETALLE DE PROPIEDAD ENVIADO:', data); // Log para depuración
    data.features = {
      furnished: data.furnished ?? false,
      petFriendly: data.petFriendly ?? false,
      elevator: data.elevator ?? false,
      balcony: data.balcony ?? false,
      garden: data.garden ?? false,
      pool: data.pool ?? false,
      gym: data.gym ?? false,
      security: data.security ?? false,
      airConditioning: data.airConditioning ?? false,
      heating: data.heating ?? false,
      internet: data.internet ?? false,
      laundry: data.laundry ?? false
    };
    res.json({
      success: true,
      data,
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
    const {
      title, description, price, address, sellerId,
      city, state, postalCode, location,
      propertyType, status,
      features = {},
      images,
      yearBuilt, floor, totalFloors, daysOnMarket, views
    } = req.body;

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

    // Extraer features planos
    const {
      furnished, petFriendly, elevator, balcony, garden, pool, gym, security,
      airConditioning, heating, internet, laundry, bedrooms, bathrooms, area, parkingSpaces
    } = features;

    const property = await Property.create({
      title,
      description,
      price,
      address,
      sellerId,
      city,
      state,
      postalCode,
      location,
      propertyType,
      status,
      furnished,
      petFriendly,
      elevator,
      balcony,
      garden,
      pool,
      gym,
      security,
      airConditioning,
      heating,
      internet,
      laundry,
      bedrooms,
      bathrooms,
      area,
      parkingSpaces,
      images,
      yearBuilt,
      floor,
      totalFloors,
      daysOnMarket,
      views
    });
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
    const { price, title, yearBuilt, floor, totalFloors, daysOnMarket, views } = req.body;
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
    // Extraer campos planos de features si existen
    const { features = {} } = req.body;
    const {
      bedrooms,
      bathrooms,
      area,
      parkingSpaces
    } = features;

    await property.update({
      ...req.body,
      bedrooms: bedrooms !== undefined ? bedrooms : property.bedrooms,
      bathrooms: bathrooms !== undefined ? bathrooms : property.bathrooms,
      area: area !== undefined ? area : property.area,
      parkingSpaces: parkingSpaces !== undefined ? parkingSpaces : property.parkingSpaces,
      yearBuilt,
      floor,
      totalFloors,
      daysOnMarket,
      views
    });
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
