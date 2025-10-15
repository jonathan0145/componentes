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
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'Faltan campos obligatorios: token, title, body'
        },
        timestamp: new Date().toISOString()
      });
    }
    const message = {
      notification: { title, body },
      data: data || {},
      token
    };
    await admin.messaging().send(message);
    res.json({
      success: true,
      data: null,
      message: 'Notificación push enviada correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PUSH_001',
        message: 'Error al enviar la notificación push',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
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
