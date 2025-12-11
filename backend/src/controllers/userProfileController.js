const { User, Profile, Property } = require('../models');

// GET /api/user/profile-by-property/:propertyId
exports.getUserProfileWithProperties = async (req, res) => {
  try {
    const propertyId = req.params.id;
    // Buscar la propiedad y su usuario creador
    const property = await Property.findByPk(propertyId, {
      include: [
        {
          model: User,
          as: 'seller',
          include: [
            { model: Profile, as: 'profile', attributes: ['avatar'] },
            { model: Property, as: 'properties', attributes: ['id'] }
          ]
        }
      ]
    });
    if (!property || !property.seller) {
      return res.status(404).json({ success: false, message: 'Propiedad o vendedor no encontrado' });
    }
    const seller = property.seller;
    const profile = seller.profile || {};
    res.json({
      success: true,
      data: {
        avatar: profile.avatar || null,
        name: seller.name || '',
        memberSince: seller.createdAt,
        propertiesCount: Array.isArray(seller.properties) ? seller.properties.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener perfil', error: error.message });
  }
};
