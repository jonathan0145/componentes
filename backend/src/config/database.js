const { Sequelize } = require('sequelize');

let sequelize;
if (process.env.NODE_ENV === 'test' && process.env.USE_TEST_MYSQL !== 'true') {
  // Por defecto en tests usamos sqlite in-memory para ser rápidos y aislados.
  // Si quieres usar MySQL para tests, exporta USE_TEST_MYSQL=true (ver instrucciones en docs).
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
} else {
  // Usar MySQL (producción/desarrollo o tests con USE_TEST_MYSQL=true)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'inmotech',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      logging: false,
    }
  );
}

module.exports = sequelize;
