"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Appointments", "time", {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "Hora de la cita (HH:mm)"
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Appointments", "time");
  }
};
