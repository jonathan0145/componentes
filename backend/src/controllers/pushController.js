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

// No hay problema. Para obtener un token FCM válido necesitas crear una app móvil (aunque sea de prueba) y conectarla a tu proyecto Firebase.

// Pasos resumidos:

// Instala Android Studio en tu PC.
// Crea un nuevo proyecto Android (puede ser una app vacía).
// En la consola de Firebase, agrega una app Android y descarga el archivo google-services.json.
// Coloca ese archivo en la carpeta app de tu proyecto Android.
// Agrega la dependencia de Firebase Messaging en tu build.gradle.
// Usa el código para obtener el token FCM y verás el token en el log de la app.
// Ese token lo usas en tu backend para enviar notificaciones push.
