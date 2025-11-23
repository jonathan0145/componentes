require('dotenv').config();

const baseConfig = {
  password: process.env.DB_PASS || 'jR3216417337',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

module.exports = {
  // Usuario de la aplicación (localhost)
  development: {
    ...baseConfig,
    username: process.env.DB_USER || 'inmotech_user',
    database: process.env.DB_NAME || 'inmotech'
  },
  // Usuario acceso desde cualquier host
  test: {
    ...baseConfig,
    username: 'inmotech_user1',
    database: 'inmotech_test'
  },
  // Usuario ip específica (misma máquina virtual) o cualquier ip de la red
  production: {
    ...baseConfig,
    username: 'inmotech_user2',
    database: 'inmotech'
  }
};
