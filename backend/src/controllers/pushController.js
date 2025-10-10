const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK (requiere archivo de credenciales)
try {
  admin.initializeApp({
    credential: admin.credential.cert(require('../../firebase-service-account.json'))
  });
} catch (e) {
  // Ya inicializado o error de credenciales
}

// Enviar notificación push
exports.sendPush = async (req, res) => {
  try {
    const { token, title, body, data } = req.body;
    if (!token || !title || !body) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: token, title, body' });
    }
    const message = {
      notification: { title, body },
      data: data || {},
      token
    };
    await admin.messaging().send(message);
    res.json({ mensaje: 'Notificación push enviada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar la notificación push', detalle: error.message });
  }
};
