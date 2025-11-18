require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const { sequelize } = require('./models');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas base (ejemplo, se irán agregando)
app.get('/', (req, res) => {
  res.json({ message: 'API Inmotech FS funcionando' });
});

// Swagger Docs
const { swaggerUi, specs } = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Importar y usar rutas de módulos (auth, properties, chat, etc.)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/conversations', require('./routes/conversationRoutes'));
app.use('/api/pricehistories', require('./routes/priceHistoryRoutes'));
// alias por compatibilidad con tests
app.use('/api/price-history', require('./routes/priceHistoryRoutes'));
app.use('/api/verifications', require('./routes/verificationRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/permissions', require('./routes/permissionRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));
app.use('/api/push', require('./routes/pushRoutes'));
app.use('/api/storage', require('./routes/storageRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

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
    await sequelize.sync({ alter: false });
    console.log('Modelos sincronizados con la base de datos');
    const server = http.createServer(app);
    const { init } = require('./services/socketProvider');
    const setupSockets = require('./sockets');

    const io = init(server);
    setupSockets();

    await new Promise((resolve) => {
      server.listen(port, () => {
        console.log(`Servidor API (HTTP+Socket.io) escuchando en puerto ${port}`);
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
