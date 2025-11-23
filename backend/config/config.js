const dbConfig = require('../src/config/database.config');

module.exports = {
  // Usuario de la aplicación (localhost) - inmotech_user
  development: dbConfig.development,
  
  // Usuario acceso desde cualquier host - inmotech_user1
  test: dbConfig.test,
  
  // Usuario IP específica o cualquier IP de la red - inmotech_user2/inmotech_user3
  production: dbConfig.production,
  
  // Acceso directo a todas las configuraciones
  allConfigs: dbConfig
};
