const { Sequelize } = require('sequelize');

let sequelize;
if (
  (process.env.NODE_ENV === 'test' && process.env.USE_TEST_MYSQL !== 'true' && process.env.FORCE_MEMORY_DB !== 'true')
) {
  // Usar SQLite en disco para tests (test.sqlite) para depuración y persistencia temporal
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'test.sqlite',
  logging: false
  });
} else if (process.env.FORCE_MEMORY_DB === 'true') {
  // Forzar SQLite en memoria para tests individuales
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
