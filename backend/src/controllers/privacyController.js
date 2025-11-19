// src/controllers/privacyController.js
const { Profile } = require('../models');

// Obtener configuración de privacidad
exports.getPrivacy = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) return res.status(404).json({ error: 'Perfil no encontrado' });
    res.json({
      showContactInfo: profile.showContactInfo,
      receiveEmailNotifications: profile.receiveEmailNotifications
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener configuración de privacidad' });
  }
};

// Actualizar configuración de privacidad
exports.updatePrivacy = async (req, res) => {
  try {
    console.log('PUT /api/v1/user/privacy recibido');
    console.log('req.user:', req.user);
    console.log('req.body:', req.body);
    const userId = req.user.id;
    const { showContactInfo, receiveEmailNotifications } = req.body;
    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      console.log('Perfil no encontrado para userId:', userId);
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    if (typeof showContactInfo !== 'undefined') profile.showContactInfo = !!showContactInfo;
    if (typeof receiveEmailNotifications !== 'undefined') profile.receiveEmailNotifications = !!receiveEmailNotifications;
    await profile.save();
    console.log('Perfil actualizado:', profile.toJSON());
    res.json({
      showContactInfo: profile.showContactInfo,
      receiveEmailNotifications: profile.receiveEmailNotifications
    });
  } catch (error) {
    console.error('Error en updatePrivacy:', error);
    res.status(500).json({ error: 'Error al actualizar configuración de privacidad' });
  }
};
