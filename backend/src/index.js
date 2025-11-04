require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const { sequelize } = require('./models');
const { Role } = require('./models');

// Middlewares

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Crear roles básicos si no existen
async function ensureDefaultRoles() {
  const defaultRoles = [
    { name: 'buyer', description: 'Comprador' },
    { name: 'seller', description: 'Vendedor' },
    { name: 'agent', description: 'Agente' }
  ];
  for (const role of defaultRoles) {
    await Role.findOrCreate({ where: { name: role.name }, defaults: role });
  }
}

ensureDefaultRoles().then(() => {
  console.log('Roles básicos verificados/creados');
});

// Rutas base (ejemplo, se irán agregando)
app.get('/', (req, res) => {
  res.json({ message: 'API Inmotech FS funcionando' });
});

// Swagger Docs
const { swaggerUi, specs } = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// Agrupar todas las rutas bajo /api/v1
const apiV1Router = express.Router();
apiV1Router.use('/users', require('./routes/userRoutes'));
apiV1Router.use('/properties', require('./routes/propertyRoutes'));
apiV1Router.use('/offers', require('./routes/offerRoutes'));
apiV1Router.use('/messages', require('./routes/messageRoutes'));
apiV1Router.use('/notifications', require('./routes/notificationRoutes'));
apiV1Router.use('/appointments', require('./routes/appointmentRoutes'));
apiV1Router.use('/chats', require('./routes/chatRoutes'));
apiV1Router.use('/conversations', require('./routes/conversationRoutes'));
apiV1Router.use('/pricehistories', require('./routes/priceHistoryRoutes'));
// alias por compatibilidad con tests
apiV1Router.use('/price-history', require('./routes/priceHistoryRoutes'));
apiV1Router.use('/verifications', require('./routes/verificationRoutes'));
apiV1Router.use('/roles', require('./routes/roleRoutes'));
apiV1Router.use('/permissions', require('./routes/permissionRoutes'));
apiV1Router.use('/files', require('./routes/fileRoutes'));
apiV1Router.use('/email', require('./routes/emailRoutes'));
apiV1Router.use('/push', require('./routes/pushRoutes'));
apiV1Router.use('/storage', require('./routes/storageRoutes'));
apiV1Router.use('/auth', require('./routes/authRoutes'));
app.use('/api/v1', apiV1Router);

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
