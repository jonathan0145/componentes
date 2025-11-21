'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Elimina la columna 'type' si existe
    return queryInterface.removeColumn('Properties', 'type').catch(() => {});
  },
  down: async (queryInterface, Sequelize) => {
    // Vuelve a agregar la columna 'type' si se revierte la migración
    return queryInterface.addColumn('Properties', 'type', { type: Sequelize.STRING });
  }
};
