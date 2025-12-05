"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Profiles", "licenseNumber", { type: Sequelize.STRING });
    await queryInterface.addColumn("Profiles", "agency", { type: Sequelize.STRING });
    await queryInterface.addColumn("Profiles", "experience", { type: Sequelize.STRING });
    await queryInterface.addColumn("Profiles", "specialization", { type: Sequelize.STRING });
    await queryInterface.addColumn("Profiles", "coverageArea", { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Profiles", "licenseNumber");
    await queryInterface.removeColumn("Profiles", "agency");
    await queryInterface.removeColumn("Profiles", "experience");
    await queryInterface.removeColumn("Profiles", "specialization");
    await queryInterface.removeColumn("Profiles", "coverageArea");
  }
};
