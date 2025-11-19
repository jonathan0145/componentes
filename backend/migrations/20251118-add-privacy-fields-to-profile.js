"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Profiles", "showContactInfo", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("Profiles", "receiveEmailNotifications", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Profiles", "showContactInfo");
    await queryInterface.removeColumn("Profiles", "receiveEmailNotifications");
  },
};
