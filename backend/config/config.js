const dbConfig = require('../src/config/database.config');

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig,
};
