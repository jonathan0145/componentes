require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const { sequelize } = require('./models');

// Middlewares
app.use(cors({
  origin: '*', // Permitir todas las conexiones (para desarrollo)
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas base (ejemplo, se irán agregando)
app.get('/', (req, res) => {
  res.json({ message: 'API Inmotech FS funcionando' });
});

// Swagger Docs
const { swaggerUi, specs } = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Importar y usar rutas de módulos (auth, properties, chat, etc.) con prefijo /api/v1
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/properties', require('./routes/propertyRoutes'));
app.use('/api/v1/offers', require('./routes/offerRoutes'));
app.use('/api/v1/messages', require('./routes/messageRoutes'));
app.use('/api/v1/notifications', require('./routes/notificationRoutes'));
app.use('/api/v1/appointments', require('./routes/appointmentRoutes'));
app.use('/api/v1/chats', require('./routes/chatRoutes'));
app.use('/api/v1/conversations', require('./routes/conversationRoutes'));
app.use('/api/v1/pricehistories', require('./routes/priceHistoryRoutes'));
// alias por compatibilidad con tests
app.use('/api/v1/price-history', require('./routes/priceHistoryRoutes'));
app.use('/api/v1/verifications', require('./routes/verificationRoutes'));
app.use('/api/v1/roles', require('./routes/roleRoutes'));
app.use('/api/v1/permissions', require('./routes/permissionRoutes'));
app.use('/api/v1/files', require('./routes/fileRoutes'));
app.use('/api/v1/email', require('./routes/emailRoutes'));
app.use('/api/v1/push', require('./routes/pushRoutes'));
app.use('/api/v1/storage', require('./routes/storageRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Nota: sincronización se realiza dentro de startServer para controlar orden en tests
// Inicializar servidor HTTP y Socket.io (exponer función para tests)
const http = require('http');

async function startServer(port = PORT) {
  try {
    // Desactivado: Las tablas ya existen desde el SQL importado
    // await sequelize.sync({ alter: false });
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente');
    const server = http.createServer(app);
    const { init } = require('./services/socketProvider');
    const setupSockets = require('./sockets');

    const io = init(server);
    setupSockets();

    const host = process.env.HOST || '0.0.0.0';
    await new Promise((resolve) => {
      server.listen(port, host, () => {
        console.log(`Servidor API (HTTP+Socket.io) escuchando en ${host}:${port}`);
        console.log(`Accesible desde la red en: http://192.168.20.82:${port}`);
        resolve();
      });
    });

    return { server, io };
  } catch (err) {
    console.error('Error al sincronizar modelos:', err);
    throw err;
  }
}

// Si este archivo se ejecuta directamente, arrancar el servidor
if (require.main === module) {
  startServer();
}

// Nota: la sincronización de la BD para tests se realiza desde el setup de Jest

module.exports = app;
module.exports.startServer = startServer;
