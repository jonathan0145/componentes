'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Appointments', 'confirmationCode', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      comment: 'Código único de confirmación para la cita'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Appointments', 'confirmationCode');
  }
};
